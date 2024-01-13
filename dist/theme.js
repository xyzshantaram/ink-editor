import { EditorView } from "@codemirror/view";
import { tags } from "@lezer/highlight";
import { HighlightStyle } from "@codemirror/language";
export const theme = (fontFamily) => EditorView.theme({
    "&": {
        fontSize: "1rem",
        color: "black",
    },
    ".cm-content": {
        fontFamily,
    }
});
export const headingStyles = HighlightStyle.define([
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
