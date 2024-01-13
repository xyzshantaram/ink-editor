import { EditorView } from "@codemirror/view";
import { autosaveFn } from "../utils";
export declare const getDocAndCursor: (editor: EditorView) => {
    doc: import("@codemirror/state").Text;
    cursor: number;
};
export declare const getLineOffset: (editor: EditorView, offset: number) => number;
export declare const getExtensions: (ph: string, autosave: autosaveFn, fontFamily: string) => import("@codemirror/state").Extension[];
