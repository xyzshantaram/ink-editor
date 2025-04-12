/**
 * Core editor module that implements the primary InkEditor functionality.
 * This module provides a rich-text markdown editor built on top of CodeMirror.
 */
import { EditorView } from '@codemirror/view';
import { Store } from 'campfire.js';
import type { ButtonArgs } from './components/EditorButton.ts';
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
export declare class InkEditor {
    #private;
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
    };
    /** Function to toggle read-only state */
    setReadOnly: (state: boolean) => void;
    /**
     * Creates a new InkEditor instance
     * @param {HTMLElement | string} root - Container element or selector for the editor
     * @param {Partial<InkOptions>} [userOptions] - Custom editor options
     */
    constructor(root: HTMLElement | string, userOptions?: Partial<InkOptions>);
    /**
     * Initializes the editor with saved or default content
     * @returns {Promise<void>}
     */
    initialize(): Promise<void>;
    /**
     * Executes a registered editor action by name
     * @param {string} name - Name of the action to execute
     */
    action(name: string): void;
    /**
     * Registers a new button in the toolbar
     * @param {ButtonArgs} btn - Button configuration
     */
    registerButton(btn: ButtonArgs): void;
    /**
     * Registers a new editor action
     * @param {string} name - Unique name for the action
     * @param {EditorAction} action - Function to execute when action is triggered
     */
    registerAction(name: string, action: EditorAction): void;
    /**
     * Removes a registered action
     * @param {string} name - Name of the action to remove
     */
    deregisterAction(name: string): void;
    /**
     * Provides methods for inserting content at various positions in the editor
     */
    get insert(): {
        /**
         * Inserts text before the current cursor position
         * @param {string} insertion - Text to insert
         * @param {number} [cursorOffset=insertion.length] - Where to place cursor after insertion
         */
        before: (insertion: string, cursorOffset?: number) => void;
        /**
         * Wraps selected text with start and end strings
         * @param {string} start - Text to insert before selection
         * @param {string} [end=start] - Text to insert after selection (defaults to start)
         */
        around: (start: string, end?: string) => void;
        /**
         * Inserts text at the current cursor position
         * @param {string} str - Text to insert
         */
        at: (str: string) => void;
        /**
         * Inserts text with proper newline handling
         * @param {string} text - Text to insert
         */
        withNewline: (text: string) => void;
    };
    /**
     * Gets the current editor contents as a string
     * @returns {string} Current editor contents
     */
    getContents(): string;
    /**
     * Sets the editor content
     * @param {string} contents - New content to set
     */
    setContents(contents: string): void;
    /**
     * Shows or hides the editor
     * @param {boolean} state - Whether editor should be visible
     */
    setEditorVisibility(state: boolean): void;
    /**
     * Disables all toolbar buttons except one
     * @param {number} target - Index of button to keep enabled
     */
    disableButtonsExcept(target: number): void;
    /**
     * Enables all toolbar buttons
     */
    enableButtons(): void;
}
