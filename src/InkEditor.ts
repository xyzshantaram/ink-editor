/**
 * Core editor module that implements the primary InkEditor functionality.
 * This module provides a rich-text markdown editor built on top of CodeMirror.
 */

import { EditorView } from '@codemirror/view';
import { debounce, getRootElt } from './utils/misc';
import cf, { ListStore, Store } from 'campfire.js';
import { createCmEditor, getDocAndCursor, insertAround, insertBefore, insertWithNewline } from './utils/editor';
import { ButtonArgs, ButtonSpec } from './components/EditorButton';
import { DEFAULT_ARGS, EDITOR_DEFAULT_ACTIONS } from './defaults';
import { SnippetView } from './components/SnippetView';
import { ToolbarButtons } from './components/Toolbar';
import { PreviewController } from './components/PreviewController';

/**
 * Configuration options for the InkEditor instance
 * @interface InkOptions
 */
export interface InkOptions {
    /** 
     * Controls toolbar visibility and configuration
     * @type {boolean | {enable: boolean, defaults: boolean}}
     */
    toolbar: boolean | {
        enable: boolean,
        defaults: boolean
    };

    /**
     * Whether to enable default editor actions (bold, italic, etc.)
     * @type {boolean}
     */
    enableDefaultActions: boolean;

    /**
     * Default content to populate the editor with
     * @type {string}
     */
    defaultContents: string;

    /**
     * Whether to enable the snippets feature
     * @type {boolean}
     */
    enableSnippets: boolean;

    /**
     * Font family for the editor content
     * @type {string}
     */
    fontFamily: string;

    /**
     * Editor height (CSS value)
     * @type {string}
     */
    height: string;

    /**
     * Placeholder text to display when editor is empty
     * @type {string}
     */
    placeholder: string;

    /**
     * Array of snippet strings available for insertion
     * @type {string[]}
     */
    snippets: string[];

    /**
     * Editor width (CSS value)
     * @type {string}
     */
    width: string;

    /**
     * Callback for autosaving editor contents
     * @param {string} contents - Current editor contents
     * @returns {void | Promise<void>}
     */
    onAutosave: (contents: string) => void | Promise<void>;

    /**
     * Callback when editor task is completed
     * @param {string} contents - Current editor contents
     * @returns {void | Promise<void>}
     */
    onDone: (contents: string) => void | Promise<void>;

    /**
     * Callback when editor is exited
     * @param {string} contents - Current editor contents
     * @returns {void | Promise<void>}
     */
    onExit: (contents: string) => void | Promise<void>;

    /**
     * Function to generate preview HTML from editor contents
     * @param {string} contents - Current editor contents
     * @returns {string | Promise<string>} HTML preview content
     */
    makePreview: (contents: string) => string | Promise<string>;

    /**
     * Function to retrieve previously saved content
     * @returns {string | Promise<string>} Saved content
     */
    retrieveSaved: () => string | Promise<string>;

    /**
     * Delay in milliseconds before triggering autosave
     * @type {number}
     */
    autosaveDelayMs: number;
}

/**
 * Arguments passed to editor action functions
 * @interface EditorActionArgs
 */
export interface EditorActionArgs {
    /** Reference to the InkEditor instance */
    editor: InkEditor
}

/**
 * Type definition for editor action functions
 * @param {EditorActionArgs} args - Arguments containing editor reference
 * @returns {void | Promise<void>}
 */
export type EditorAction = (args: EditorActionArgs) => void | Promise<void>;

/**
 * Main InkEditor class that provides a rich markdown editing experience
 * with toolbar buttons, snippets, and preview functionality.
 */
export class InkEditor {
    /** Store for toolbar buttons */
    #toolbar: ListStore<ButtonSpec> | undefined;

    /** Map of registered editor actions by name */
    #actions: Map<string, EditorAction>;

    /** Root element for CodeMirror editor */
    #cmRoot: HTMLElement;

    /** Parent element containing the editor */
    parent: HTMLElement;

    /** The underlying CodeMirror editor instance */
    editor: EditorView;

    /** Whether editor is in compact mode */
    isCompact: boolean;

    /** Store controlling snippet panel visibility */
    snippetsOpen: Store<boolean> | undefined;

    /** Editor configuration options */
    options: InkOptions;

    /** Preview state and controls */
    preview: {
        /** Store for preview content */
        contents: Store<string>;
        /** Store controlling preview visibility */
        visibility: Store<boolean>;
    }

    /** Function to toggle read-only state */
    setReadOnly: (state: boolean) => void;

    /**
     * Creates a new InkEditor instance
     * @param {HTMLElement | string} root - Container element or selector for the editor
     * @param {Partial<InkOptions>} [userOptions] - Custom editor options
     */
    constructor(root: HTMLElement | string, userOptions?: Partial<InkOptions>) {
        this.options = Object.assign({}, DEFAULT_ARGS, userOptions);
        const parent = getRootElt(root);

        parent.classList.add('ink-root');
        this.isCompact = parent.classList.contains('compact');
        const [_, snippets, ctrls, preview, cmRoot, editorWrapper] = cf.extend(parent, {
            raw: true,
            gimme: ['.ink-snippets', '.ink-ctrl-btns', '.ink-preview', '.ink-editor', '.ink-editor-wrapper'],
            contents: cf.html`
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

        if (!this.options.toolbar) ctrls.remove();
        else this.#toolbar = ToolbarButtons(ctrls, this, this.options.toolbar);

        if (!this.options.enableSnippets) snippets.remove();
        else this.snippetsOpen = SnippetView(snippets, this, this.options.snippets);

        if (this.options.enableDefaultActions) Object.entries(EDITOR_DEFAULT_ACTIONS).forEach(
            ([k, v]) => this.registerAction(k, v));

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
    action(name: string) {
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
    registerButton(btn: ButtonArgs) {
        this.#toolbar?.push(btn);
    }

    /**
     * Registers a new editor action
     * @param {string} name - Unique name for the action
     * @param {EditorAction} action - Function to execute when action is triggered
     */
    registerAction(name: string, action: EditorAction) {
        this.#actions.set(name, action);
    }

    /**
     * Removes a registered action
     * @param {string} name - Name of the action to remove
     */
    deregisterAction(name: string) {
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
            before: (insertion: string, cursorOffset = insertion.length) => {
                const { cursor } = getDocAndCursor(this.editor);
                insertBefore(this.editor, cursor!, insertion, cursorOffset);
            },

            /**
             * Wraps selected text with start and end strings
             * @param {string} start - Text to insert before selection
             * @param {string} [end=start] - Text to insert after selection (defaults to start)
             */
            around: (start: string, end = start) => {
                const { cursor } = getDocAndCursor(this.editor);
                insertAround(this.editor, cursor!, start, end);
            },

            /**
             * Inserts text at the current cursor position
             * @param {string} str - Text to insert
             */
            at: (str: string) => {
                const { cursor } = getDocAndCursor(this.editor);
                this.editor.dispatch({
                    changes: {
                        from: cursor!,
                        to: cursor!,
                        insert: str
                    }
                })
            },

            /**
             * Inserts text with proper newline handling
             * @param {string} text - Text to insert
             */
            withNewline: (text: string) => insertWithNewline(this.editor, text)
        }
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
    setContents(contents: string) {
        this.editor.dispatch({
            changes: { from: 0, to: this.editor.state.doc.length, insert: contents }
        });
    }

    /**
     * Shows or hides the editor
     * @param {boolean} state - Whether editor should be visible
     */
    setEditorVisibility(state: boolean) {
        this.#cmRoot.classList.toggle('hidden', !state);
    }

    /**
     * Disables all toolbar buttons except one
     * @param {number} target - Index of button to keep enabled
     */
    disableButtonsExcept(target: number) {
        this.#toolbar?.value.forEach((btn, idx) => {
            if (idx === target) return;
            this.#toolbar?.setAt(idx, {
                ...btn,
                disabled: true
            });
        })
    }

    /**
     * Enables all toolbar buttons
     */
    enableButtons() {
        this.#toolbar?.value.forEach((btn, idx) => {
            this.#toolbar?.setAt(idx, {
                ...btn,
                disabled: false
            })
        })
    }
}