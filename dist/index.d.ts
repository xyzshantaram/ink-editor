import { debounce } from './utils';
interface EditorOptions {
    /**
     * The function to use for autosaving the document.
     */
    autosave: (contents: string) => void | Promise<void>;
    /**
     * A function the editor calls to get autosaved content if it is nonempty.
     * @returns The autosaved content.
     */
    retrieve: () => string | Promise<string>;
    /**
     * Function called when Done is clicked in the editor.
     */
    doneFn: (text: string) => void | Promise<void>;
    /**
     * A function called when Exit is clicked in the editor.
     */
    exit: () => void | Promise<void>;
    /**
     * Width of the editor in CSS units.
     */
    width: string;
    /**
     * Height of the editor in CSS units.
     */
    height: string;
    /**
     * Font family to use in the editor.
     */
    fontFamily: string;
    /**
     * Whether to disable the Prompts feature.
     */
    disablePrompts: boolean;
    /**
     * Whether to lay out the editor vertically (with controls in a horizontal top bar)
     * or horizontally (controls go in a sidebar and are hidden on mobile).
     */
    verticalMode: boolean;
    /**
     * A parsing function. By default, this is the identity function.
     * @param str The markdown string to parse.
     * @returns The parsed markdown.
     */
    parse: (str: string) => string;
}
declare const init: (root: string | HTMLElement, defaultContent: string | undefined, prompts: string[] | undefined, placeholder: string | undefined, userOptions: Partial<EditorOptions>) => Promise<{
    editor: import("@codemirror/view").EditorView;
    getVal: () => string;
    setVal: (text: string) => void;
}>;
export { debounce, init };
