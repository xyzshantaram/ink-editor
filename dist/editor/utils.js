import { EditorView, keymap, placeholder } from "@codemirror/view";
import { offsetToPos, posToOffset } from "../utils";
import { defaultKeymap, history, historyKeymap } from "@codemirror/commands";
import { syntaxHighlighting, defaultHighlightStyle } from "@codemirror/language";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { headingStyles, theme } from "../theme";
export const getDocAndCursor = (editor) => ({
    doc: editor.state.doc,
    cursor: editor.state.selection.main.head
});
export const getLineOffset = (editor, offset) => {
    const p = offsetToPos(editor, offset);
    p.ch = 0;
    const newOffset = posToOffset(editor, p);
    return newOffset;
};
export const getExtensions = (ph, autosave, fontFamily) => [
    history(),
    keymap.of([...defaultKeymap, ...historyKeymap]),
    markdown({ base: markdownLanguage }),
    syntaxHighlighting(defaultHighlightStyle),
    syntaxHighlighting(headingStyles),
    placeholder(ph),
    EditorView.updateListener.of(async (e) => {
        await autosave(e.state.doc.toString());
    }),
    EditorView.lineWrapping,
    theme(fontFamily)
];
