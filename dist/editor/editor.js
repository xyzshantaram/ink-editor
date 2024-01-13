import { EditorView } from "@codemirror/view";
import { offsetToPos, posToOffset, queryUnsafe } from '../utils';
import { StateEffect } from "@codemirror/state";
import { getExtensions, getDocAndCursor, getLineOffset } from "./utils";
;
export const createCmEditor = ({ placeholder, autosave, fontFamily }) => {
    const view = new EditorView({
        extensions: getExtensions(placeholder, autosave, fontFamily),
        parent: queryUnsafe('#ink-editor'),
    });
    function injectExtension(extension) {
        view.dispatch({
            effects: StateEffect.appendConfig.of(extension)
        });
    }
    return [view, injectExtension];
};
export const hasSelection = (editor) => editor.state.selection.ranges.some(r => !r.empty);
const insertBefore = (editor, cursor, insertion, cursorOffset = insertion.length) => {
    if (!hasSelection(editor)) {
        const offset = getLineOffset(editor, cursor);
        editor.dispatch({ changes: { from: offset, to: offset, insert: insertion } });
        editor.dispatch({ selection: { anchor: offset + (cursorOffset || 0) } });
        return;
    }
    editor.state.selection.ranges.forEach((selection) => {
        [selection.head, selection.anchor].toSorted().forEach((pos, i) => {
            const offset = getLineOffset(editor, i);
            editor.dispatch({ changes: { from: offset, to: offset, insert: insertion } });
            if (i == 0) {
                const selection = {
                    anchor: posToOffset(editor, { line: pos[0], ch: cursorOffset || 0 })
                };
                editor.dispatch({ selection });
            }
        });
    });
};
const insertAround = (editor, cursor, start, end = start) => {
    if (hasSelection(editor)) {
        const selection = editor.state.sliceDoc(editor.state.selection.main.from, editor.state.selection.main.to);
        editor.dispatch(editor.state.replaceSelection(start + selection + end));
    }
    else {
        editor.dispatch({
            changes: {
                from: cursor, to: cursor, insert: start + end
            }
        });
        editor.dispatch({ selection: { anchor: editor.state.selection.main.head + start.length } });
    }
    editor.focus();
};
export const insertWithNewline = (editor, text) => {
    const { doc, cursor } = getDocAndCursor(editor);
    const pos = offsetToPos(editor, cursor);
    pos.ch = doc.lineAt(cursor).length;
    const newPos = posToOffset(editor, pos);
    editor.dispatch({
        changes: { from: newPos, to: newPos, insert: `\n${text}` }
    });
};
export const generateInserters = (editor) => {
    return {
        before: (insertion, cursorOffset = insertion.length) => {
            const { cursor } = getDocAndCursor(editor);
            insertBefore(editor, cursor, insertion, cursorOffset);
        },
        around: (start, end = start) => {
            const { cursor } = getDocAndCursor(editor);
            insertAround(editor, cursor, start, end);
        },
        at: (str) => {
            const { cursor } = getDocAndCursor(editor);
            editor.dispatch({
                changes: {
                    from: cursor,
                    to: cursor,
                    insert: str
                }
            });
        },
        withNewline: (text) => insertWithNewline(editor, text)
    };
};
