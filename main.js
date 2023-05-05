import cm from 'https://esm.sh/codemirror@5.65.2/lib/codemirror.js';
import 'https://esm.sh/codemirror@5.65.2/addon/display/placeholder.js';
import 'https://esm.sh/codemirror@5.65.2/mode/gfm/gfm.js';
import * as marked from 'https://esm.sh/marked';
import { DEFAULT_BIO } from './bio.js';

const hidePrompts = () => {
    document.querySelector('#writr-prompts').style.display = 'none';
}

const showPrompts = () => {
    const prompts = document.querySelector('#writr-prompts');
    prompts.style.display = 'flex';
    prompts.scrollTop = 0;
}

const insertWithNewline = (editor, text) => {
    var doc = editor.getDoc();
    var cursor = doc.getCursor();
    var line = doc.getLine(cursor.line);
    var pos = {
        line: cursor.line,
        ch: line.length
    }
    doc.replaceRange(`\n${text}`, pos);
}

const setPrompts = (editor) => fetch('./prompts.json').then(req => req.json()).then(prompts => {
    const list = document.querySelector('#writr-prompts-list>ul');
    prompts.forEach(prompt => {
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

const generateInserters = (editor) => {
    const before = (insertion, cursorOffset = insertion.length) => {
        const doc = editor.getDoc();
        const cursor = doc.getCursor();

        if (doc.somethingSelected()) {
            const selections = doc.listSelections();
            selections.forEach((selection) => {
                const pos = [selection.head.line, selection.anchor.line].sort();

                for (let i = pos[0]; i <= pos[1]; i++) {
                    doc.replaceRange(insertion, { line: i, ch: 0 });
                }

                doc.setCursor({ line: pos[0], ch: cursorOffset || 0 });
            });
        } else {
            doc.replaceRange(insertion, { line: cursor.line, ch: 0 });
            doc.setCursor({ line: cursor.line, ch: cursorOffset || 0 });
        }
    }

    const around = (start, end = start) => {
        const doc = editor.getDoc();
        const cursor = doc.getCursor();

        if (doc.somethingSelected()) {
            const selection = doc.getSelection();
            doc.replaceSelection(start + selection + end);
        } else {
            doc.replaceRange(start + end, { line: cursor.line, ch: cursor.ch });
            doc.setCursor({ line: cursor.line, ch: cursor.ch + start.length });
        }

        editor.focus();
    }

    const at = (str) => {
        const doc = editor.getDoc();
        const cursor = doc.getCursor();
        doc.replaceRange(str, cursor);
    }

    return { before, around, at };
}

const renderer = {
    image: (href, _, text) =>
        `<div class='img-wrapper'>
            <a href="${href}">
                <span class="icon"></span>
                <span>${text}</span>
            </a>
        </div>`,
    html: () => '',
    table: () => '',
    checkbox: () => '',
    listitem: (text, task, checked) => {
        if (task) return `<li class=checkbox checked=${checked}>${text}</li>`;
        return `<li>${text}</li>`
    },
    heading: (text, level, raw) => {
        console.log(raw);
        const lv = `h${level == 1 ? 1 : 2}`
        return `<${lv}>${text}</${lv}>`
    }
};

marked.use({ renderer, smartypants: true });

window.addEventListener('DOMContentLoaded', async () => {
    const ta = document.getElementById('writr-editor');
    const editor = cm.fromTextArea(ta, {
        lineNumbers: false,
        mode: 'gfm',
        lineWrapping: true,
        passThrough: true,
        placeholder: 'Your Writr bio. Markdown is supported, and the sky\'s the limit!'
    });

    const saved = localStorage.getItem('bio-contents');

    if (saved) {
        editor.setValue(saved);
    }
    else {
        editor.setValue(DEFAULT_BIO);
    }

    editor.on('change', () => {
        const value = editor.getValue();
        localStorage.setItem('bio-contents', value);
    });

    await setPrompts(editor);

    const ctrlBar = document.querySelector('#writr-ctrl-buttons');
    const ctrlBtns = ctrlBar.querySelectorAll(":not(#writr-ctrl-preview)");

    const controls = {
        disable: () => ctrlBtns.forEach(elt => elt.classList.add('disabled')),
        enable: () => ctrlBtns.forEach(elt => elt.classList.remove('disabled'))
    }

    const cmElem = editor.getWrapperElement();

    Array.from(document.querySelectorAll('.writr-ctrl-dropdown')).forEach(elt => {
        const menu = elt.querySelector('.writr-ctrl-dropdown-menu');
        const btn = elt.querySelector('span.icon.button');

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
        editor.on('touchstart', hide);
        editor.on('mousedown', hide);
    })

    const insert = generateInserters(editor);
    /*
        TODO: improve heading insertion. Existing headings should 
              be converted to the requested heading. Heading request
              in the middle of a line should make heading show up at
              the start of the line.
    */

    const download = (filename, text) => {
        const elt = document.createElement('a');
        elt.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        elt.setAttribute('download', filename);

        elt.style.display = 'none';
        document.body.appendChild(elt);

        elt.click();

        document.body.removeChild(elt);
    }

    let previewing = false;
    const preview = document.querySelector('#writr-preview');

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
            download(`writr-bio-${new Date().toJSON()}.md`, editor.getValue())
        },
        "prompt": showPrompts,
        "cancel-prompt": hidePrompts,
        "preview": () => {
            previewing = !previewing;
            controls[previewing ? 'disable' : 'enable']();
            cmElem.style.display = previewing ? 'none' : 'block';
            preview.style.display = previewing ? 'block' : 'none';
            preview.innerHTML = marked.parse(editor.getValue());
        }
    }

    for (const [key, val] of Object.entries(handlers)) {
        const btn = document.querySelector(`#writr-ctrl-${key}`);
        btn.onclick = val;
    }
});