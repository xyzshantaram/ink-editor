import { EditorView } from "@codemirror/view";
import { InkOptions } from "../InkEditor";
export declare const getDocAndCursor: (editor: EditorView) => {
    doc: import("@codemirror/state").Text;
    cursor: number;
};
export declare const posToOffset: (e: EditorView, pos: {
    line: number;
    ch: number;
}) => number;
export declare const offsetToPos: (e: EditorView, offset: number) => {
    line: number;
    ch: number;
};
export declare const getLineOffset: (editor: EditorView, offset: number) => number;
export declare const hasSelection: (editor: EditorView) => boolean;
export declare const insertBefore: (editor: EditorView, cursor: number, insertion: string, cursorOffset?: number) => void;
export declare const insertAround: (editor: EditorView, cursor: number, start: string, end?: string) => void;
export declare const insertWithNewline: (editor: EditorView, text: string) => void;
interface CmEditorOptions {
    placeholder: string;
    onAutosave: InkOptions['onAutosave'];
    fontFamily: string;
    parent: HTMLElement;
}
export declare const getExtensions: (ph: string, autosave: InkOptions["onAutosave"], fontFamily: string) => import("@codemirror/state").Extension[];
export declare const createCmEditor: ({ placeholder, onAutosave, fontFamily, parent }: CmEditorOptions) => {
    view: EditorView;
    setReadOnly: (state: boolean) => void;
};
export {};
