import { InkEditor } from "./dist/ink-editor.min.js";
import { marked } from "https://esm.sh/marked";

const DEFAULT_CONTENT = await fetch('https://raw.githubusercontent.com/xyzshantaram/ink-editor/master/README.md')
    .then(res => res.ok ? res.text() : '# Editor Demo');

const editor = new InkEditor('#root', {
    enableSnippets: true,
    defaultContents: DEFAULT_CONTENT,
    snippets: [
        '# Heading',
        '## Subtitle',
        "```\nSome code\n```"
    ],
    makePreview: (contents) => marked.parse(contents),
    keybinds: {
        "CA+i": "italic",
    }
});

window.editor = editor;