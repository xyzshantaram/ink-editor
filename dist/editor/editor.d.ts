import { EditorView } from "@codemirror/view";
import { autosaveFn } from '../utils';
interface CmEditorOptions {
    placeholder: string;
    autosave: autosaveFn;
    fontFamily: string;
}
export declare const createCmEditor: ({ placeholder, autosave, fontFamily }: CmEditorOptions) => (EditorView | ((extension: any) => void))[];
export declare const hasSelection: (editor: EditorView) => boolean;
export declare const insertWithNewline: (editor: EditorView, text: string) => void;
export declare const generateInserters: (editor: EditorView) => {
    before: (insertion: string, cursorOffset?: number) => void;
    around: (start: string, end?: string) => void;
    at: (str: string) => void;
    withNewline: (text: string) => void;
};
export {};
