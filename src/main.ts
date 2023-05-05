import { DEFAULT_BIO } from './bio';
import { download, queryUnsafe } from './utils';
import { createEditor, generateInserters, insertWithNewline } from './editor';
import { EditorView } from '@codemirror/view';
import { parse } from './marked';

const hidePrompts = () => {
    queryUnsafe('#writr-prompts').style.display = 'none';
}

const showPrompts = () => {
    const prompts = queryUnsafe('#writr-prompts');
    prompts.style.display = 'flex';
    prompts.scrollTop = 0;
}

const setPrompts = (editor: EditorView) => fetch('./data/prompts.json')
    .then((res: Response) => res.json())
    .then((prompts: string[]) => {
        const list = queryUnsafe('#writr-prompts-list>ul');
        prompts.forEach((prompt: string) => {
            if (!prompt) return;
            const elt = document.createElement('li');
            elt.innerHTML = prompt;
            list.appendChild(elt);
            elt.onclick = () => {
                insertWithNewline(editor, `\n## ${prompt}\n`);
                hidePrompts();
            }
        })
    });

window.addEventListener('DOMContentLoaded', async () => {
    const editor = createEditor();

    const saved = localStorage.getItem('bio-contents');
    editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: saved || DEFAULT_BIO } });
    await setPrompts(editor);

    const ctrlBar = queryUnsafe('#writr-ctrl-buttons');
    const ctrlBtns = Array.from(ctrlBar.querySelectorAll(".icon.button")).filter(elt => {
        if (elt.parentElement?.id === 'writr-exit-menu') return false;
        return true;
    });
    console.log(ctrlBtns);

    const controls = {
        disable: () => ctrlBtns.forEach(elt => elt.classList.add('disabled')),
        enable: () => ctrlBtns.forEach(elt => elt.classList.remove('disabled'))
    }

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
    const preview = queryUnsafe('#writr-preview');

    const handlers = {
        "bold": () => insert.around("**"),
        "italic": () => insert.around("_"),
        "st": () => insert.around("~~"),
        "quote": () => insert.before("> "),
        "img": () => insert.at("![Image caption](image url)"),
        "a": () => insert.at("[Link text](Link url)"),
        "h1": () => insert.before('# ', 2),
        "h2": () => insert.before('## ', 3),
        "done": () => {
            download(`writr-bio-${new Date().toJSON()}.md`, editor.state.doc.toString())
        },
        "prompt": showPrompts,
        "cancel-prompt": hidePrompts,
        "preview": () => {
            previewing = !previewing;
            controls[previewing ? 'disable' : 'enable']();
            cmElem.style.display = previewing ? 'none' : 'block';
            preview.style.display = previewing ? 'block' : 'none';
            preview.innerHTML = parse(editor.state.doc.toString());
        }
    }

    for (const [key, val] of Object.entries(handlers)) {
        const btn = queryUnsafe(`#writr-ctrl-${key}`);
        btn.onclick = val;
    }
});