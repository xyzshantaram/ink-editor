/**
 * Core editor module that implements the primary InkEditor functionality.
 * This module provides a rich-text markdown editor built on top of CodeMirror.
 */
import { debounce, getRootElt } from './utils/misc';
import cf from 'campfire.js';
import { createCmEditor, getDocAndCursor, insertAround, insertBefore, insertWithNewline } from './utils/editor';
import { DEFAULT_ARGS, EDITOR_DEFAULT_ACTIONS } from './defaults';
import { SnippetView } from './components/SnippetView';
import { ToolbarButtons } from './components/Toolbar';
import { PreviewController } from './components/PreviewController';
/**
 * Main InkEditor class that provides a rich markdown editing experience
 * with toolbar buttons, snippets, and preview functionality.
 */
export class InkEditor {
    /** Store for toolbar buttons */
    #toolbar;
    /** Map of registered editor actions by name */
    #actions;
    /** Root element for CodeMirror editor */
    #cmRoot;
    /** Parent element containing the editor */
    parent;
    /** The underlying CodeMirror editor instance */
    editor;
    /** Whether editor is in compact mode */
    isCompact;
    /** Store controlling snippet panel visibility */
    snippetsOpen;
    /** Editor configuration options */
    options;
    /** Preview state and controls */
    preview;
    /** Function to toggle read-only state */
    setReadOnly;
    /**
     * Creates a new InkEditor instance
     * @param {HTMLElement | string} root - Container element or selector for the editor
     * @param {Partial<InkOptions>} [userOptions] - Custom editor options
     */
    constructor(root, userOptions) {
        this.options = Object.assign({}, DEFAULT_ARGS, userOptions);
        const parent = getRootElt(root);
        parent.classList.add('ink-root');
        this.isCompact = parent.classList.contains('compact');
        const [_, snippets, ctrls, preview, cmRoot, editorWrapper] = cf.extend(parent, {
            raw: true,
            gimme: ['.ink-snippets', '.ink-ctrl-btns', '.ink-preview', '.ink-editor', '.ink-editor-wrapper'],
            contents: cf.html `
            <div class=ink-editor-wrapper>
                <div class="ink-ctrl-btns"></div>
                <div class="ink-preview"></div>
                <div class="ink-snippets"></div>
                <div class="ink-editor"></div>
            </div>`,
            style: {
                width: this.options.width,
                height: this.options.height
            }
        });
        this.#cmRoot = cmRoot;
        this.preview = PreviewController(preview, this.options.makePreview);
        this.#actions = new Map();
        if (!this.options.toolbar)
            ctrls.remove();
        else
            this.#toolbar = ToolbarButtons(ctrls, this, this.options.toolbar);
        if (!this.options.enableSnippets)
            snippets.remove();
        else
            this.snippetsOpen = SnippetView(snippets, this, this.options.snippets);
        if (this.options.enableDefaultActions)
            Object.entries(EDITOR_DEFAULT_ACTIONS).forEach(([k, v]) => this.registerAction(k, v));
        const { view, setReadOnly } = createCmEditor({
            placeholder: this.options.placeholder,
            onAutosave: debounce(this.options.onAutosave, this.options.autosaveDelayMs),
            parent: cmRoot,
            fontFamily: this.options.fontFamily
        });
        this.editor = view;
        this.setReadOnly = setReadOnly;
        this.initialize();
    }
    /**
     * Initializes the editor with saved or default content
     * @returns {Promise<void>}
     */
    async initialize() {
        const saved = await this.options.retrieveSaved();
        if (saved) {
            this.setContents(saved);
        }
        else {
            this.setContents(this.options.defaultContents);
        }
    }
    /**
     * Executes a registered editor action by name
     * @param {string} name - Name of the action to execute
     */
    action(name) {
        const action = this.#actions.get(name);
        if (!action) {
            console.warn('Action', name, 'called, but no such action exists.');
            return;
        }
        action({ editor: this });
    }
    /**
     * Registers a new button in the toolbar
     * @param {ButtonArgs} btn - Button configuration
     */
    registerButton(btn) {
        this.#toolbar?.push(btn);
    }
    /**
     * Registers a new editor action
     * @param {string} name - Unique name for the action
     * @param {EditorAction} action - Function to execute when action is triggered
     */
    registerAction(name, action) {
        this.#actions.set(name, action);
    }
    /**
     * Removes a registered action
     * @param {string} name - Name of the action to remove
     */
    deregisterAction(name) {
        this.#actions.delete(name);
    }
    /**
     * Provides methods for inserting content at various positions in the editor
     */
    get insert() {
        return {
            /**
             * Inserts text before the current cursor position
             * @param {string} insertion - Text to insert
             * @param {number} [cursorOffset=insertion.length] - Where to place cursor after insertion
             */
            before: (insertion, cursorOffset = insertion.length) => {
                const { cursor } = getDocAndCursor(this.editor);
                insertBefore(this.editor, cursor, insertion, cursorOffset);
            },
            /**
             * Wraps selected text with start and end strings
             * @param {string} start - Text to insert before selection
             * @param {string} [end=start] - Text to insert after selection (defaults to start)
             */
            around: (start, end = start) => {
                const { cursor } = getDocAndCursor(this.editor);
                insertAround(this.editor, cursor, start, end);
            },
            /**
             * Inserts text at the current cursor position
             * @param {string} str - Text to insert
             */
            at: (str) => {
                const { cursor } = getDocAndCursor(this.editor);
                this.editor.dispatch({
                    changes: {
                        from: cursor,
                        to: cursor,
                        insert: str
                    }
                });
            },
            /**
             * Inserts text with proper newline handling
             * @param {string} text - Text to insert
             */
            withNewline: (text) => insertWithNewline(this.editor, text)
        };
    }
    /**
     * Gets the current editor contents as a string
     * @returns {string} Current editor contents
     */
    getContents() {
        return this.editor.state.doc.toString();
    }
    /**
     * Sets the editor content
     * @param {string} contents - New content to set
     */
    setContents(contents) {
        this.editor.dispatch({
            changes: { from: 0, to: this.editor.state.doc.length, insert: contents }
        });
    }
    /**
     * Shows or hides the editor
     * @param {boolean} state - Whether editor should be visible
     */
    setEditorVisibility(state) {
        this.#cmRoot.classList.toggle('hidden', !state);
    }
    /**
     * Disables all toolbar buttons except one
     * @param {number} target - Index of button to keep enabled
     */
    disableButtonsExcept(target) {
        this.#toolbar?.value.forEach((btn, idx) => {
            if (idx === target)
                return;
            this.#toolbar?.set(idx, { ...btn, disabled: true });
        });
    }
    /**
     * Enables all toolbar buttons
     */
    enableButtons() {
        this.#toolbar?.value.forEach((btn, idx) => {
            this.#toolbar?.set(idx, { ...btn, disabled: false });
        });
    }
}
