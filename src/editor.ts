import { keymap, EditorView, placeholder } from "@codemirror/view";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { syntaxHighlighting, defaultHighlightStyle } from "@codemirror/language";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { autosaveFn, offsetToPos, posToOffset, queryUnsafe } from './utils';
// import { languages } from '@codemirror/language-data';
import { tags } from "@lezer/highlight"
import { HighlightStyle } from "@codemirror/language"

const theme = (fontFamily: string) => EditorView.theme({
    "&": {
        fontSize: "1rem",
        color: "black",
    },
    ".cm-content": {
        fontFamily: fontFamily,
    }
})

export const insertWithNewline = (editor: EditorView, text: string) => {
    const doc = editor.state.doc;
    const cursor = editor.state.selection.main.head;
    const pos = offsetToPos(editor, cursor);
    pos.ch = doc.lineAt(cursor).length;
    const newPos = posToOffset(editor, pos);
    editor.dispatch({
        changes: { from: newPos, to: newPos, insert: `\n${text}` }
    });
}

const headingStyles = HighlightStyle.define([
    {
        tag: tags.heading1,
        color: 'black',
        fontSize: '1.75rem',
        fontWeight: '700',
    },
    {
        tag: tags.heading2,
        color: 'black',
        fontSize: '1.6rem',
        fontWeight: '700',
    },
    {
        tag: tags.heading3,
        color: 'black',
        fontSize: '1.5rem',
        fontWeight: '700',
    },
    {
        tag: tags.heading4,
        color: 'black',
        fontSize: '1.4rem',
        fontWeight: '700',
    },
    {
        tag: tags.heading5,
        color: 'black',
        fontSize: '1.2rem',
        fontWeight: '700',
    },
    {
        tag: tags.heading6,
        color: 'black',
        fontSize: '1.1rem',
        fontWeight: '700',
    },
]);

const editorExtensions = (ph: string, autosave: autosaveFn, fontFamily: string, disableLanguages: boolean) => [
    history(),
    keymap.of([...defaultKeymap, ...historyKeymap]),
    markdown({
        base: markdownLanguage,
        // codeLanguages: languages,
    }),
    syntaxHighlighting(defaultHighlightStyle),
    syntaxHighlighting(headingStyles),
    placeholder(ph),
    EditorView.updateListener.of(async (e: { state: { doc: { toString: () => any; }; }; }): Promise<void> => {
        await autosave(e.state.doc.toString());
    }),
    EditorView.lineWrapping,
    theme(fontFamily)
];

interface CmEditorOptions {
    placeholder: string,
    autosave: autosaveFn,
    fontFamily: string,
    disableLanguages: boolean
};
export const createCmEditor = ({ placeholder, autosave, fontFamily, disableLanguages = false }: CmEditorOptions):
    EditorView => {
    return new EditorView({
        extensions: editorExtensions(placeholder, autosave, fontFamily, disableLanguages),
        parent: queryUnsafe('#writr-editor'),
    });
}

export const hasSelection = (editor: EditorView) => editor.state.selection.ranges.some(r => !r.empty);
const getLineOffset = (editor: EditorView, offset: number) => {
    const p = offsetToPos(editor, offset);
    p.ch = 0;
    const newOffset = posToOffset(editor, p);
    return newOffset;
}

export const generateInserters = (editor: EditorView) => {
    const doc = editor.state.doc;
    const before = (insertion: string, cursorOffset = insertion.length) => {
        const cursor = editor.state.selection.main.head;

        if (hasSelection(editor)) {
            const selections = editor.state.selection.ranges;
            selections.forEach((selection) => {
                const pos = [selection.head, selection.anchor].sort();
                for (let i = pos[0]; i <= pos[1]; i++) {
                    const offset = getLineOffset(editor, i);
                    editor.dispatch({ changes: { from: offset, to: offset, insert: insertion } })
                }

                editor.dispatch({
                    selection: {
                        anchor: posToOffset(editor, {
                            line: pos[0], ch: cursorOffset || 0
                        })
                    }
                });
            });
        } else {
            const offset = getLineOffset(editor, cursor);
            editor.dispatch({ changes: { from: offset, to: offset, insert: insertion } })
            editor.dispatch({ selection: { anchor: offset + (cursorOffset || 0) } })
        }
    }

    const around = (start: string, end = start) => {
        const cursor = editor.state.selection.main.head;

        if (hasSelection(editor)) {
            const selection = editor.state.sliceDoc(
                editor.state.selection.main.from,
                editor.state.selection.main.to);
            editor.dispatch(editor.state.replaceSelection(start + selection + end));
        } else {
            editor.dispatch({
                changes: {
                    from: cursor, to: cursor, insert: start + end
                }
            })
            editor.dispatch({ selection: { anchor: editor.state.selection.main.head + start.length } })
        }

        editor.focus();
    }

    const at = (str: string) => {
        const cursor = editor.state.selection.main.head;
        editor.dispatch({
            changes: { from: cursor, to: cursor, insert: str }
        })
    }

    return { before, around, at };
}
