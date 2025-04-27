import { EditorView, keymap, placeholder } from "@codemirror/view";
import {
    defaultHighlightStyle,
    syntaxHighlighting,
} from "@codemirror/language";
import { Compartment, EditorState } from "@codemirror/state";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import type { InkOptions } from "../InkEditor.ts";
import {
    defaultKeymap,
    history,
    historyKeymap,
    indentWithTab,
} from "@codemirror/commands";
import { tags } from "@lezer/highlight";
import { HighlightStyle } from "@codemirror/language";

export const getDocAndCursor = (editor: EditorView) => ({
    doc: editor.state.doc,
    cursor: editor.state.selection.main.head,
});

export const posToOffset = (
    e: EditorView,
    pos: { line: number; ch: number },
) => {
    const doc = e.state.doc;
    return doc.line(pos.line + 1).from + pos.ch;
};

export const offsetToPos = (e: EditorView, offset: number) => {
    const doc = e.state.doc;
    let line = doc.lineAt(offset);
    return { line: line.number - 1, ch: offset - line.from };
};

export const getLineOffset = (editor: EditorView, offset: number) => {
    const p = offsetToPos(editor, offset);
    p.ch = 0;
    const newOffset = posToOffset(editor, p);
    return newOffset;
};

export const hasSelection = (editor: EditorView) =>
    editor.state.selection.ranges.some((r) => !r.empty);

export const insertBefore = (
    editor: EditorView,
    cursor: number,
    insertion: string,
    cursorOffset = insertion.length,
) => {
    if (!hasSelection(editor)) {
        const offset = getLineOffset(editor, cursor);
        editor.dispatch({
            changes: { from: offset, to: offset, insert: insertion },
        });
        editor.dispatch({
            selection: { anchor: offset + (cursorOffset || 0) },
        });
        return;
    }

    editor.state.selection.ranges.forEach((selection) => {
        [selection.head, selection.anchor].toSorted().forEach((pos, i) => {
            const offset = getLineOffset(editor, i);
            editor.dispatch({
                changes: { from: offset, to: offset, insert: insertion },
            });

            if (i == 0) {
                const selection = {
                    anchor: posToOffset(editor, {
                        line: pos,
                        ch: cursorOffset || 0,
                    }),
                };
                editor.dispatch({ selection });
            }
        });
    });
};

export const insertAround = (
    editor: EditorView,
    cursor: number,
    start: string,
    end = start,
) => {
    if (hasSelection(editor)) {
        const selection = editor.state.sliceDoc(
            editor.state.selection.main.from,
            editor.state.selection.main.to,
        );
        editor.dispatch(editor.state.replaceSelection(start + selection + end));
    } else {
        editor.dispatch({
            changes: {
                from: cursor,
                to: cursor,
                insert: start + end,
            },
        });
        editor.dispatch({
            selection: {
                anchor: editor.state.selection.main.head + start.length,
            },
        });
    }

    editor.focus();
};

export const insertWithNewline = (editor: EditorView, text: string) => {
    const { doc, cursor } = getDocAndCursor(editor);
    const pos = offsetToPos(editor, cursor!);
    pos.ch = doc.lineAt(cursor!).length;
    const newPos = posToOffset(editor, pos);
    editor.dispatch({
        changes: { from: newPos, to: newPos, insert: `\n${text}` },
    });
};

interface CmEditorOptions {
    placeholder: string;
    onAutosave: InkOptions["onAutosave"];
    fontFamily: string;
    parent: HTMLElement;
}

const theme = (fontFamily: string) =>
    EditorView.theme({
        "&": {
            fontSize: "1rem",
            color: "black",
            height: "100%",
            overflow: "auto",
            backgroundColor: "white",
        },
        ".cm-content": {
            fontFamily,
        },
    });

const headingStyles = HighlightStyle.define([
    {
        tag: tags.heading1,
        color: "black",
        fontSize: "1.75rem",
        fontWeight: "700",
    },
    {
        tag: tags.heading2,
        color: "black",
        fontSize: "1.6rem",
        fontWeight: "700",
    },
    {
        tag: tags.heading3,
        color: "black",
        fontSize: "1.5rem",
        fontWeight: "700",
    },
    {
        tag: tags.heading4,
        color: "black",
        fontSize: "1.4rem",
        fontWeight: "700",
    },
    {
        tag: tags.heading5,
        color: "black",
        fontSize: "1.2rem",
        fontWeight: "700",
    },
    {
        tag: tags.heading6,
        color: "black",
        fontSize: "1.1rem",
        fontWeight: "700",
    },
    {
        tag: tags.meta,
        color: "#aaa !important",
    },
].map((itm) => ({ ...itm, textDecoration: "none !important" })));

export const getExtensions = (
    ph: string,
    autosave: InkOptions["onAutosave"],
    fontFamily: string,
) => [
    history(),
    keymap.of([
        ...defaultKeymap,
        ...historyKeymap,
        indentWithTab,
    ]),
    markdown({ base: markdownLanguage }),
    syntaxHighlighting(defaultHighlightStyle),
    syntaxHighlighting(headingStyles),
    placeholder(ph),
    EditorView.updateListener.of(async (u) =>
        await autosave(u.state.doc.toString())
    ),
    EditorView.lineWrapping,
    theme(fontFamily),
];

export const createCmEditor = (
    { placeholder, onAutosave, fontFamily, parent }: CmEditorOptions,
) => {
    const compartments = {
        readOnly: new Compartment(),
    };

    const setReadOnly = (state: boolean) => {
        view.dispatch({
            effects: compartments.readOnly.reconfigure(
                EditorState.readOnly.of(state),
            ),
        });
    };

    const view = new EditorView({
        extensions: [
            compartments.readOnly.of(EditorState.readOnly.of(false)),
            ...getExtensions(placeholder, onAutosave, fontFamily),
        ],
        parent,
    });

    return { view, setReadOnly };
};
