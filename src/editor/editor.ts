import { EditorView } from "@codemirror/view";
import { autosaveFn, offsetToPos, posToOffset, queryUnsafe } from '../utils';
import { StateEffect } from "@codemirror/state";
import { getExtensions, getDocAndCursor, getLineOffset } from "./utils";

interface CmEditorOptions {
    placeholder: string,
    autosave: autosaveFn,
    fontFamily: string
};

export const createCmEditor = ({ placeholder, autosave, fontFamily }: CmEditorOptions) => {
    const view = new EditorView({
        extensions: getExtensions(placeholder, autosave, fontFamily),
        parent: queryUnsafe('#writr-editor'),
    });

    function injectExtension(extension) {
        view.dispatch({
            effects: StateEffect.appendConfig.of(extension)
        })
    }

    return [view, injectExtension];
}

export const hasSelection = (editor: EditorView) => editor.state.selection.ranges.some(r => !r.empty);

const insertBefore = (
    editor: EditorView, cursor: number, insertion: string, cursorOffset = insertion.length
) => {
    if (!hasSelection(editor)) {
        const offset = getLineOffset(editor, cursor);
        editor.dispatch({ changes: { from: offset, to: offset, insert: insertion } });
        editor.dispatch({ selection: { anchor: offset + (cursorOffset || 0) } });
        return;
    }

    editor.state.selection.ranges.forEach((selection) => {
        [selection.head, selection.anchor].toSorted().forEach((pos, i) => {
            const offset = getLineOffset(editor, i);
            editor.dispatch({ changes: { from: offset, to: offset, insert: insertion } })

            if (i == 0) {
                const selection = {
                    anchor: posToOffset(editor, { line: pos[0], ch: cursorOffset || 0 })
                }
                editor.dispatch({ selection });
            }
        });
    });
}

const insertAround = (editor: EditorView, cursor: number, start: string, end = start) => {
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

export const insertWithNewline = (editor: EditorView, text: string) => {
    const { doc, cursor } = getDocAndCursor(editor);
    const pos = offsetToPos(editor, cursor);
    pos.ch = doc.lineAt(cursor).length;
    const newPos = posToOffset(editor, pos);
    editor.dispatch({
        changes: { from: newPos, to: newPos, insert: `\n${text}` }
    });
}

export const generateInserters = (editor: EditorView) => {
    const { cursor } = getDocAndCursor(editor);

    return {
        before: (insertion: string, cursorOffset = insertion.length) => {
            insertBefore(editor, cursor, insertion, cursorOffset);
        },
        around: (start: string, end = start) => {
            insertAround(editor, cursor, start, end);
        },
        at: (str: string) => editor.dispatch({
            changes: {
                from: cursor,
                to: cursor,
                insert: str
            }
        }),
        withNewline: (text: string) => insertWithNewline(editor, text)
    }
}
