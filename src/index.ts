import { debounce } from './utils';
import { INK_DOM } from './dom';
import cf from "campfire.js";
import { setup } from './setup';


const DEFAULT_OPTIONS = {
    autosave: () => { console.log('Autosaving...') },
    retrieve: () => '',
    doneFn: console.log,
    exit: () => { console.warn('exit clicked') },
    width: '100%',
    height: '100%',
    fontFamily: "monospace",
    disablePrompts: false,
    verticalMode: false,
    parse: (str: string) => str
}

const getRootElt = (root: string | HTMLElement): HTMLElement => {
    if (typeof root === 'string') {
        const tmp = document.querySelector(root) as HTMLElement;
        if (tmp === null) throw new Error('root div not found while initialising editor');
        return tmp;
    }
    return root;
}

const EditorRoot = (options: typeof DEFAULT_OPTIONS) =>
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
    userOptions: Partial<Record<keyof typeof DEFAULT_OPTIONS, any>>
) => {
    const options = Object.assign({}, DEFAULT_OPTIONS, userOptions);
    const [elt, cmRoot, previewPane] = EditorRoot(options);

    if (options.disablePrompts) {
        prompts = [];
        elt.classList.add('prompts-disabled');
    }

    getRootElt(root).appendChild(elt);
    const { editor } = await setup(
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
