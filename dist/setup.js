import { insertWithNewline, createCmEditor, generateInserters } from "./editor/editor";
import cf from "campfire.js";
import { confirm } from 'cf-alert';
const hidePrompts = (parent) => {
    parent.querySelector('#ink-prompts').style.display = 'none';
};
const showPrompts = (parent) => {
    const prompts = parent.querySelector('#ink-prompts');
    prompts.style.display = 'flex';
    prompts.scrollTop = 0;
};
const setPrompts = (editor, prompts, parent) => {
    const list = parent.querySelector('#ink-prompts-list>ul');
    prompts.forEach((prompt) => {
        if (!prompt)
            return;
        list.append(...cf.nu('li', {
            raw: true,
            c: prompt,
            on: {
                click: () => {
                    insertWithNewline(editor, `## ${prompt}`);
                    hidePrompts(parent);
                }
            }
        }));
    });
};
const createLabel = (icon, text, verticalMode = false) => cf.html `<span class="icon">${icon}</span> ${verticalMode ? '' : text}`;
const setupControls = (parent) => {
    const ctrlBar = parent.querySelector('#ink-ctrl-buttons');
    const ctrlBtns = ctrlBar.querySelectorAll("button");
    const toToggle = Array.from(ctrlBar.querySelectorAll("[id^=ink-ctrl-]:not(#ink-ctrl-preview)"));
    return {
        disable: () => toToggle.forEach(elt => elt.classList.add('disabled')),
        enable: () => toToggle.forEach(elt => elt.classList.remove('disabled')),
        buttons: ctrlBtns
    };
};
const setupToggles = (parent) => {
    let timeout;
    const handler = () => {
        const btns = parent.querySelector('#ink-ctrl-buttons');
        if (btns.classList.contains('mobile-hidden')) {
            btns.classList.remove('mobile-hidden');
            btns.style.animation = 'slide-in 0.5s forwards';
        }
        else {
            btns.style.animation = 'slide-out 0.5s forwards';
            if (timeout)
                clearTimeout(timeout);
            timeout = setTimeout(() => btns.classList.add('mobile-hidden'), 500);
        }
    };
    parent.querySelectorAll('.controls-toggle-button').forEach(btn => btn.addEventListener('click', handler));
};
const setupDropdowns = (parent) => {
    Array.from(parent.querySelectorAll('.ink-ctrl-dropdown')).forEach(elt => {
        const menu = elt.querySelector('.ink-ctrl-dropdown-menu');
        const btn = elt.querySelector('span.icon.ink-button');
        let open = false;
        const hide = () => {
            open = false;
            menu.style.display = 'none';
        };
        const show = () => {
            open = true;
            menu.style.display = 'block';
        };
        const toggle = () => open ? hide() : show();
        window.addEventListener('click', (e) => e.target !== btn ? hide() : undefined);
        btn.addEventListener('click', toggle);
    });
};
const handlePreview = (previewing, parse, { cmRoot, previewPane, controls, editor, verticalMode, parent }) => {
    const res = !previewing;
    controls[res ? 'disable' : 'enable']();
    cmRoot.style.display = res ? 'none' : 'block';
    previewPane.style.display = res ? 'block' : 'none';
    previewPane.innerHTML = parse(editor.state.doc.toString());
    parent.querySelector('#ink-ctrl-preview').innerHTML = res ?
        createLabel('', 'Edit', verticalMode) : createLabel('󰈈', 'Preview', verticalMode);
    return res;
};
const setupHandlers = ({ parse, cmRoot, previewPane, insert, doneFn, editor, exitFn, controls, verticalMode, defaultContent, parent }) => {
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
            previewing = handlePreview(previewing, parse, { cmRoot, previewPane, controls, editor, verticalMode, parent });
        },
        "reset": async () => {
            if (await confirm('Are you sure you want to reset the editor contents?', {})) {
                editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: defaultContent } });
            }
        }
    };
};
export const setup = async (parent, cmRoot, previewPane, defaultContent, prompts, placeholder, options) => {
    cmRoot.style.fontFamily = options.fontFamily;
    const [editor, injectExtension] = createCmEditor({
        placeholder,
        autosave: options.autosave,
        fontFamily: options.fontFamily,
        parent: cmRoot
    });
    const saved = await options.retrieve();
    editor.dispatch({
        changes: {
            from: 0,
            to: editor.state.doc.length,
            insert: saved !== null ? saved : defaultContent
        }
    });
    if (prompts?.length >= 1)
        setPrompts(editor, prompts, parent);
    const controls = setupControls(parent);
    setupToggles(parent);
    setupDropdowns(parent);
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
        parse: options.parse,
        parent
    });
    for (const [key, val] of Object.entries(handlers)) {
        const btn = parent.querySelector(`#ink-ctrl-${key}`);
        if (btn)
            btn.onclick = val;
    }
    return { editor, injectExtension };
};
