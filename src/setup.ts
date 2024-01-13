import { EditorView } from "@codemirror/view";
import { insertWithNewline, createCmEditor, generateInserters } from "./editor/editor";
import { queryUnsafe, autosaveFn } from "./utils";
import cf from "campfire.js";
import { confirm } from 'cf-alert';

const hidePrompts = () => {
    queryUnsafe('#ink-prompts').style.display = 'none';
}

const showPrompts = () => {
    const prompts = queryUnsafe('#ink-prompts');
    prompts.style.display = 'flex';
    prompts.scrollTop = 0;
}

const setPrompts = (editor: EditorView, prompts: string[]) => {
    const list = queryUnsafe('#ink-prompts-list>ul');
    prompts.forEach((prompt: string) => {
        if (!prompt) return;
        list.append(...cf.nu('li', {
            raw: true,
            c: prompt,
            on: {
                click: () => {
                    insertWithNewline(editor, `## ${prompt}`);
                    hidePrompts();
                }
            }
        }));
    })
};

const createLabel = (icon: string, text: string, verticalMode = false) => cf.html`<span class="icon">${icon}</span> ${verticalMode ? '' : text}`;

const setupControls = () => {
    const ctrlBar = queryUnsafe('#ink-ctrl-buttons');
    const ctrlBtns = Array.from(ctrlBar.querySelectorAll("[id^=ink-ctrl-]:not(#ink-ctrl-preview)"));

    return {
        disable: () => ctrlBtns.forEach(elt => elt.classList.add('disabled')),
        enable: () => ctrlBtns.forEach(elt => elt.classList.remove('disabled'))
    };
}

const setupToggles = () => {
    let timeout: NodeJS.Timeout;
    const handler = () => {
        const btns = queryUnsafe('#ink-ctrl-buttons');
        if (btns.classList.contains('mobile-hidden')) {
            btns.classList.remove('mobile-hidden');
            btns.style.animation = 'slide-in 0.5s forwards';
        }
        else {
            btns.style.animation = 'slide-out 0.5s forwards';
            if (timeout) clearTimeout(timeout);
            timeout = setTimeout(() => btns.classList.add('mobile-hidden'), 500);
        }
    }
    document.querySelectorAll('.controls-toggle-button').forEach(btn =>
        btn.addEventListener('click', handler));
};

const setupDropdowns = () => {
    Array.from(document.querySelectorAll('.ink-ctrl-dropdown')).forEach(elt => {
        const menu = queryUnsafe('.ink-ctrl-dropdown-menu', elt);
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

        const toggle = () => open ? hide() : show();

        window.addEventListener('click', (e) => e.target !== btn ? hide() : undefined);
        btn.addEventListener('click', toggle);
    })
}

interface HandlerSetup {
    cmRoot: HTMLElement,
    previewPane: HTMLElement,
    insert: ReturnType<typeof generateInserters>,
    editor: EditorView,
    doneFn: (text: string) => void | Promise<void>,
    exitFn: (contents: string) => void | Promise<void>;
    controls: ReturnType<typeof setupControls>;
    verticalMode: boolean;
    defaultContent: string;
    parse: (src: string) => string;
}

const handlePreview = (
    previewing: boolean,
    parse: (src: string) => string,
    { cmRoot, previewPane, controls, editor, verticalMode }:
        Omit<HandlerSetup, "insert" | "doneFn" | "exitFn" | "defaultContent" | "parse">
) => {
    const res = !previewing;
    controls[res ? 'disable' : 'enable']();
    cmRoot.style.display = res ? 'none' : 'block';
    previewPane.style.display = res ? 'block' : 'none';
    previewPane.innerHTML = parse(editor.state.doc.toString());
    queryUnsafe('#ink-ctrl-preview').innerHTML = res ?
        createLabel('', 'Edit', verticalMode) : createLabel('󰈈', 'Preview', verticalMode);
    return res;
}

const setupHandlers = ({
    parse,
    cmRoot,
    previewPane,
    insert,
    doneFn,
    editor,
    exitFn,
    controls,
    verticalMode,
    defaultContent
}: HandlerSetup) => {
    let previewing = false;
    /*
        TODO: improve heading insertion. Existing headings should 
              be converted to the requested heading. Heading request
              in the middle of a line should make heading show up at
              the start of the line.
    */
    return {
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
        "exit": async () => await confirm('Are you sure you want to exit?', {})
            && await exitFn(editor.state.doc.toString()),
        "prompt": showPrompts,
        "cancel-prompt": hidePrompts,
        "preview": () => {
            previewing = handlePreview(previewing, parse, { cmRoot, previewPane, controls, editor, verticalMode });
        },
        "reset": async () => {
            if (await confirm('Are you sure you want to reset the editor contents?', {})) {
                editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: defaultContent } })
            }
        }
    }
}

interface SetupOptions {
    autosave: autosaveFn,
    retrieve: () => string | Promise<string>,
    doneFn: (text: string) => void | Promise<void>,
    exit: (text: string) => void | Promise<void>,
    fontFamily: string,
    verticalMode: boolean,
    parse: (src: string) => string
}

export const setup = async (
    cmRoot: HTMLElement,
    previewPane: HTMLElement,
    defaultContent: string,
    prompts: string[],
    placeholder: string,
    options: SetupOptions) => {

    cmRoot.style.fontFamily = options.fontFamily;
    const [editor, injectExtension] = createCmEditor({
        placeholder,
        autosave: options.autosave,
        fontFamily: options.fontFamily
    }) as [EditorView, (extn) => void];

    const saved = await options.retrieve();
    editor.dispatch({
        changes: {
            from: 0,
            to: editor.state.doc.length,
            insert: saved !== null ? saved : defaultContent
        }
    });

    if (prompts?.length >= 1) setPrompts(editor, prompts);
    const controls = setupControls();
    setupToggles();
    setupDropdowns();

    const insert = generateInserters(editor);
    const handlers = setupHandlers({
        cmRoot,
        controls,
        editor,
        insert,
        previewPane,
        defaultContent,
        doneFn: options.doneFn,
        exitFn: options.exit,
        verticalMode: options.verticalMode,
        parse: options.parse
    });

    for (const [key, val] of Object.entries(handlers)) {
        const btn = queryUnsafe(`#ink-ctrl-${key}`);
        if (btn) btn.onclick = val;
    }

    return { editor, injectExtension };
}