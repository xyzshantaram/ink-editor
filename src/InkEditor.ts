/**
 * Core editor module that implements the primary InkEditor functionality.
 * This module provides a rich-text markdown editor built on top of CodeMirror.
 */

import { EditorView } from "@codemirror/view";
import { debounce, getRootElt } from "./utils/misc.ts";
import cf, { ListStore, Store } from "campfire.js";
import {
    KeybindString,
    KEYBOARD_EVENT_KEYS,
    VALID_KEYBIND_MODIFIERS,
} from "./KeybindString.ts";
import {
    createCmEditor,
    getDocAndCursor,
    insertAround,
    insertBefore,
    insertWithNewline,
} from "./utils/editor.ts";
import type { ButtonArgs, ButtonSpec } from "./components/EditorButton.ts";
import { DEFAULT_ARGS, EDITOR_DEFAULT_ACTIONS } from "./defaults.ts";
import { SnippetView } from "./components/SnippetView.ts";
import { ToolbarButtons } from "./components/Toolbar.ts";
import { PreviewController } from "./components/PreviewController.ts";

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
        enable: boolean;
        defaults: boolean;
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

    /**
     * Key bindings to set up. Keybinds must be strings matching
     * `/C?S?A?\+KeyboardEvent['key']`. The editor warns if any
     * invalid bindings or key names are passed.
     */
    keybinds?: Partial<Record<KeybindString, string>>;
}

/**
 * Arguments passed to editor action functions
 * @interface EditorActionArgs
 */
export interface EditorActionArgs {
    /** Reference to the InkEditor instance */
    editor: InkEditor;
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

    keybinds = new Map<KeybindString, string>();

    /** Preview state and controls */
    preview: {
        /** Store for preview content */
        contents: Store<string>;
        /** Store controlling preview visibility */
        visibility: Store<boolean>;
    };

    /** Function to toggle read-only state */
    setReadOnly: (state: boolean) => void;

    /**
     * Creates a new InkEditor instance
     * @param {HTMLElement | string} root - Container element or selector for the editor
     * @param {Partial<InkOptions>} [userOptions] - Custom editor options
     */
    constructor(root: HTMLElement | string, userOptions?: Partial<InkOptions>) {
        this.options = Object.assign({}, DEFAULT_ARGS, userOptions);
        this.parent = getRootElt(root);

        this.parent.classList.add("ink-root");
        this.isCompact = this.parent.classList.contains("compact");
        const [_, snippets, ctrls, preview, cmRoot] = cf.nu(this.parent)
            .gimme(
                ".ink-snippets",
                ".ink-ctrl-btns",
                ".ink-preview",
                ".ink-editor",
            )
            .html`
            <div class=ink-editor-wrapper>
                <div class="ink-ctrl-btns"></div>
                <div class="ink-preview"></div>
                <div class="ink-snippets"></div>
                <div class="ink-editor"></div>
            </div>
            `
            .style("width", this.options.width)
            .style("height", this.options.height)
            .done();
        this.#cmRoot = cmRoot;

        this.preview = PreviewController(preview, this.options.makePreview);
        this.#actions = new Map();

        if (!this.options.toolbar) ctrls.remove();
        else this.#toolbar = ToolbarButtons(ctrls, this, this.options.toolbar);

        if (!this.options.enableSnippets) snippets.remove();
        else {this.snippetsOpen = SnippetView(
                snippets,
                this,
                this.options.snippets,
            );}

        if (this.options.enableDefaultActions) {
            Object.entries(EDITOR_DEFAULT_ACTIONS).forEach(
                ([k, v]) => this.registerAction(k, v),
            );
        }

        if (this.options.keybinds) {
            Object.entries(this.options.keybinds || {})
                .forEach(([binding, action]: [KeybindString, string]) => {
                    this.registerKeybind(binding, action);
                });

            this.setupKeybindListener();
        }

        const { view, setReadOnly } = createCmEditor({
            placeholder: this.options.placeholder,
            onAutosave: debounce(
                this.options.onAutosave,
                this.options.autosaveDelayMs,
            ),
            parent: cmRoot,
            fontFamily: this.options.fontFamily,
        });

        this.editor = view;
        this.setReadOnly = setReadOnly;

        this.initialize();
    }

    /**
     * Initializes the editor with saved or default content
     * @returns {Promise<void>}
     */
    async initialize(): Promise<void> {
        const saved = await this.options.retrieveSaved();
        if (saved) {
            this.setContents(saved);
        } else {
            this.setContents(this.options.defaultContents);
        }
    }

    static isMacOS(): boolean {
        // 1. Browser frontend
        if (typeof navigator !== "undefined") {
            if (
                navigator.maxTouchPoints &&
                navigator.maxTouchPoints > 1
            ) return false;

            const uaPlatform =
                (navigator.userAgentData && navigator.userAgentData.platform) ||
                navigator.platform || "";

            return uaPlatform.toLowerCase().includes("mac");
        }

        // @ts-ignore this is fine
        if (typeof process !== "undefined" && process.platform) {
            // @ts-ignore this is fine
            return process.platform === "darwin";
        }

        // 3. Unknown or sandboxed — default to false
        return false;
    }

    static isCtrlDown(e: KeyboardEvent) {
        return InkEditor.isMacOS() ? e.metaKey : e.ctrlKey;
    }

    static KEYBIND_RE = /(C)?(S)?(A)?\+(\w+)/;

    setupKeybindListener() {
        globalThis.addEventListener("keydown", (e) => {
            const binding = [];
            if (InkEditor.isCtrlDown(e)) binding.push("C");
            if (e.altKey) binding.push("A");
            if (e.shiftKey) binding.push("S");
            binding.push("+");
            binding.push(e.key);
            const built = binding.join("");

            if (["Control", "Meta", "Alt", "Option"].includes(e.key)) return;

            if (
                !(InkEditor.isKeybindString(built) && this.keybinds.has(built))
            ) {
                return;
            }

            e.preventDefault();
            const action = this.keybinds.get(built);
            if (action) return this.action(action);
        });
    }

    /**
     * Executes a registered editor action by name
     * @param {string} name - Name of the action to execute
     */
    action(name: string) {
        const action = this.#actions.get(name);
        if (!action) {
            console.warn("Action", name, "called, but no such action exists.");
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
            before: (
                insertion: string,
                cursorOffset: number = insertion.length,
            ) => {
                const { cursor } = getDocAndCursor(this.editor);
                insertBefore(this.editor, cursor!, insertion, cursorOffset);
            },

            /**
             * Wraps selected text with start and end strings
             * @param {string} start - Text to insert before selection
             * @param {string} [end=start] - Text to insert after selection (defaults to start)
             */
            around: (start: string, end: string = start) => {
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
                        insert: str,
                    },
                });
            },

            /**
             * Inserts text with proper newline handling
             * @param {string} text - Text to insert
             */
            withNewline: (text: string) => insertWithNewline(this.editor, text),
        };
    }

    /**
     * Gets the current editor contents as a string
     * @returns {string} Current editor contents
     */
    getContents(): string {
        return this.editor.state.doc.toString();
    }

    /**
     * Sets the editor content
     * @param {string} contents - New content to set
     */
    setContents(contents: string) {
        this.editor.dispatch({
            changes: {
                from: 0,
                to: this.editor.state.doc.length,
                insert: contents,
            },
        });
    }

    /**
     * Shows or hides the editor
     * @param {boolean} state - Whether editor should be visible
     */
    setEditorVisibility(state: boolean) {
        this.#cmRoot.classList.toggle("hidden", !state);
    }

    static isKeybindString(binding: string): binding is KeybindString {
        const [mod, key] = binding.split("+");
        if (!mod || !key) return false;

        return VALID_KEYBIND_MODIFIERS.includes(mod as any) &&
            KEYBOARD_EVENT_KEYS.includes(key as any);
    }

    registerKeybind(binding: KeybindString, action: string) {
        const err = (s: string) => console.warn(s);

        if (!InkEditor.isKeybindString(binding)) {
            return err(
                `Tried to register invalid keybind "${binding}", dropping...`,
            );
        }

        if (!this.#actions.has(action)) {
            return err(
                `Tried to register invalid action "${action}", dropping...`,
            );
        }

        this.keybinds.set(binding, action);
    }

    /**
     * Disables all toolbar buttons except one
     * @param {number} target - Index of button to keep enabled
     */
    disableButtonsExcept(target: number) {
        this.#toolbar?.forEach((btn, idx) => {
            if (idx === target) return;
            this.#toolbar?.set(idx, { ...btn, disabled: true });
        });
    }

    /**
     * Enables all toolbar buttons
     */
    enableButtons() {
        this.#toolbar?.forEach((btn, idx) => {
            this.#toolbar?.set(idx, { ...btn, disabled: false });
        });
    }
}
