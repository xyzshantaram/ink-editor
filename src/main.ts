import { autosaveFn, debounce, queryUnsafe } from './utils';
import { createCmEditor, generateInserters, insertWithNewline } from './editor';
import { EditorView } from '@codemirror/view';
import { parse } from './marked';
import { WRITR_DOM } from './dom';
import { confirm } from 'cf-alert';

const hidePrompts = () => {
    queryUnsafe('#writr-prompts').style.display = 'none';
}

const showPrompts = () => {
    const prompts = queryUnsafe('#writr-prompts');
    prompts.style.display = 'flex';
    prompts.scrollTop = 0;
}

const setPrompts = (editor: EditorView, prompts: string[]) => {
    const list = queryUnsafe('#writr-prompts-list>ul');
    prompts.forEach((prompt: string) => {
        if (!prompt) return;
        const elt = document.createElement('li');
        elt.innerHTML = prompt;
        list.appendChild(elt);
        elt.onclick = () => {
            insertWithNewline(editor, `## ${prompt}`);
            hidePrompts();
        }
    })
};

const setup = async (
    defaultContent: string,
    prompts: string[],
    placeholder: string,
    autosave: autosaveFn,
    retrieve: () => string | Promise<string>,
    doneFn: (text: string) => void | Promise<void>,
    exit: (text: string) => void | Promise<void>) => {
    const editor = createCmEditor(placeholder, autosave);

    const saved = await retrieve();
    editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: saved !== null ? saved : defaultContent } });
    setPrompts(editor, prompts);

    const ctrlBar = queryUnsafe('#writr-ctrl-buttons');
    const ctrlBtns = Array.from(ctrlBar.querySelectorAll("[id^=writr-ctrl-]:not(#writr-ctrl-preview)"));

    const controls = {
        disable: () => ctrlBtns.forEach(elt => elt.classList.add('disabled')),
        enable: () => ctrlBtns.forEach(elt => elt.classList.remove('disabled'))
    };

    let slideTimeout: NodeJS.Timeout;
    document.querySelector('#controls-toggle-button')?.addEventListener('click', () => {
        const btns = queryUnsafe('#writr-ctrl-buttons');
        if (btns.classList.contains('mobile-hidden')) {
            btns.classList.remove('mobile-hidden');
            btns.style.animation = 'slide-in 0.5s forwards';
        }
        else {
            btns.style.animation = 'slide-out 0.5s forwards';
            if (slideTimeout) clearTimeout(slideTimeout);
            slideTimeout = setTimeout(() => btns.classList.add('mobile-hidden'), 500);
        }
    })


    const cmElem = queryUnsafe('#writr-editor');

    Array.from(document.querySelectorAll('.writr-ctrl-dropdown')).forEach(elt => {
        const menu = queryUnsafe('.writr-ctrl-dropdown-menu', elt);
        const btn = queryUnsafe('span.icon.button', elt);

        let open = false;

        const hide = () => {
            open = false;
            menu.style.display = 'none';
        }

        const show = () => {
            open = true;
            menu.style.display = 'block';
        }

        const toggle = () => {
            open ? hide() : show();
        }

        window.addEventListener('click', (e) => {
            if (e.target !== btn) hide();
        });

        btn.addEventListener('click', toggle);
    })

    const insert = generateInserters(editor);
    /*
        TODO: improve heading insertion. Existing headings should 
              be converted to the requested heading. Heading request
              in the middle of a line should make heading show up at
              the start of the line.
    */

    let previewing = false;
    const preview = queryUnsafe('#writr-bio');

    const handlers = {
        "bold": () => insert.around("**"),
        "italic": () => insert.around("_"),
        "st": () => insert.around("~~"),
        "quote": () => insert.before("> "),
        "a": () => insert.at("[Link text](Link url)"),
        "h1": () => insert.before('# ', 2),
        "h2": () => insert.before('## ', 3),
        "done": async () => {
            await doneFn(editor.state.doc.toString());
        },
        "exit": async () => {
            if (await confirm('Are you sure you want to exit?', {})) {
                await exit(editor.state.doc.toString());
            }
        },
        "prompt": showPrompts,
        "cancel-prompt": hidePrompts,
        "preview": () => {
            const createLabel = (icon, text) => `<span class="icon" >${icon}</span> ${text}`;
            previewing = !previewing;
            controls[previewing ? 'disable' : 'enable']();
            cmElem.style.display = previewing ? 'none' : 'block';
            preview.style.display = previewing ? 'block' : 'none';
            preview.innerHTML = parse(editor.state.doc.toString());
            queryUnsafe('#writr-ctrl-preview').innerHTML = previewing ? createLabel('', 'Edit') : createLabel('󰈈', 'Preview')
        },
        "reset": async () => {
            if (await confirm('Are you sure you want to reset the editor contents?', {})) {
                editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: defaultContent } })
            }
        }
    }

    for (const [key, val] of Object.entries(handlers)) {
        const btn = queryUnsafe(`#writr-ctrl-${key}`);
        btn.onclick = val;
    }

    return { editor };
}

const init = async (
    root: string | HTMLElement,
    defaultContent = '',
    prompts: string[] = [],
    placeholder = '',
    options = {
        autosave: (text) => { },
        retrieve: () => '',
        done: console.log,
        exit: (text: string) => { },
        width: '100%',
        height: '100%'
    }) => {
    let rootDiv: HTMLElement;
    if (typeof root === 'string') {
        const tmp = document.querySelector(root) as HTMLElement;
        if (tmp === null) throw new Error('root div not found while initialising editor');
        rootDiv = tmp;
    }
    else {
        rootDiv = root;
    }

    const elt = document.createElement('div');
    elt.id = 'writr-editor-root';
    elt.innerHTML = WRITR_DOM;
    rootDiv.appendChild(elt);
    rootDiv.style.width = options.width;
    rootDiv.style.height = options.height;
    const { editor } = await setup(defaultContent, prompts, placeholder, options.autosave, options.retrieve, options.done, options.exit);

    const getVal = () => {
        return editor.state.doc.toString();
    }

    const setVal = (text: string) => {
        editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: text } })
    }

    return { editor, getVal, setVal };
}

export { debounce, init };
