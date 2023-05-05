import { keymap, EditorView, placeholder } from "@codemirror/view"
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands"
import { syntaxHighlighting, defaultHighlightStyle } from "@codemirror/language"
import { markdown, markdownLanguage } from "@codemirror/lang-markdown"
import { offsetToPos, posToOffset, queryUnsafe } from './utils';

const theme = EditorView.theme({
    "&": {
        fontSize: "1rem",
        color: "black",
    },
    ".cm-content": {
        fontFamily: "'CMU Typewriter Text', monospace",
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

export const createEditor = () => {
    return new EditorView({
        extensions: [
            history(),
            keymap.of([...defaultKeymap, ...historyKeymap]),
            markdown({ base: markdownLanguage }),
            syntaxHighlighting(defaultHighlightStyle),
            placeholder('Your Writr bio. Markdown is supported, and the sky\'s the limit!'),
            EditorView.updateListener.of((e) => {
                localStorage.setItem('bio-contents', e.state.doc.toString());
            }),
            EditorView.lineWrapping,
            theme
        ],
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
