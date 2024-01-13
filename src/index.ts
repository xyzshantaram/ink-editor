import { debounce } from './utils';
import { INK_DOM } from './dom';
import cf from "campfire.js";
import { setup } from './setup';


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

const DEFAULT_OPTIONS: EditorOptions = {
    autosave: () => {
        console.log('Autosaving...');
    },
    retrieve: () => '',
    doneFn: console.log,
    exit: () => console.warn('exit clicked'),
    width: '100%',
    height: '100%',
    fontFamily: "monospace",
    disablePrompts: false,
    verticalMode: false,
    parse: (str: string) => str,
};

const getRootElt = (root: string | HTMLElement): HTMLElement => {
    if (typeof root === 'string') {
        const tmp = document.querySelector(root) as HTMLElement;
        if (tmp === null) throw new Error('root div not found while initialising editor');
        return tmp;
    }
    return root;
}

const EditorRoot = (options: EditorOptions) =>
    cf.nu('div#ink-editor-root' + (options.verticalMode ? '.vertical' : ''), {
        raw: true,
        c: INK_DOM({
            buttonLabels: !options.verticalMode,
            verticalMode: options.verticalMode
        }),
        s: {
            width: options.width,
            height: options.height,
            fontFamily: options.fontFamily,
            flexDirection: options.verticalMode ? 'column' : 'row'
        },
        gimme: ['#ink-editor', '#ink-preview']
    })

const init = async (
    root: string | HTMLElement,
    defaultContent = '',
    prompts: string[] = [],
    placeholder = '',
    userOptions: Partial<EditorOptions>
) => {
    const options = Object.assign({}, DEFAULT_OPTIONS, userOptions);
    const [elt, cmRoot, previewPane] = EditorRoot(options);

    if (options.disablePrompts) {
        prompts = [];
        elt.classList.add('prompts-disabled');
    }

    getRootElt(root).appendChild(elt);
    const { editor } = await setup(
        elt,
        cmRoot,
        previewPane,
        defaultContent,
        prompts,
        placeholder,
        options
    );

    const getVal = () => editor.state.doc.toString();

    const setVal = (text: string) =>
        editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: text } });

    return { editor, getVal, setVal };
}

export { debounce, init };
