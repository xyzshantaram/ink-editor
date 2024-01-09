import { debounce } from './utils';
import { WRITR_DOM } from './dom';
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
    disableLanguages: false,
    disablePrompts: false,
    verticalMode: false
}

const getRootElt = (root: string | HTMLElement): HTMLElement => {
    if (typeof root === 'string') {
        const tmp = document.querySelector(root) as HTMLElement;
        if (tmp === null) throw new Error('root div not found while initialising editor');
        return tmp;
    }
    return root;
}

const init = async (
    root: string | HTMLElement,
    defaultContent = '',
    prompts: string[] = [],
    placeholder = '',
    userOptions: Partial<Record<keyof typeof DEFAULT_OPTIONS, any>>
) => {
    const options = Object.assign({}, DEFAULT_OPTIONS, userOptions);
    const [elt] = cf.nu('div#writr-editor-root' + (options.verticalMode ? '.vertical' : ''), {
        raw: true,
        c: WRITR_DOM({
            buttonLabels: !options.verticalMode,
            verticalMode: options.verticalMode
        }),
        s: {
            width: options.width,
            height: options.height,
            fontFamily: options.fontFamily,
            flexDirection: options.verticalMode ? 'column' : 'row'
        }
    })

    if (options.disablePrompts) {
        prompts = [];
        elt.classList.add('prompts-disabled');
    }

    getRootElt(root).appendChild(elt);
    const { editor } = await setup(
        defaultContent,
        prompts,
        placeholder,
        options
    );

    const getVal = () => {
        return editor.state.doc.toString();
    }

    const setVal = (text: string) => {
        editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: text } })
    }

    return { editor, getVal, setVal };
}

export { debounce, init };
