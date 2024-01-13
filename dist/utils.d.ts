import { EditorView } from "@codemirror/view";
export declare const posToOffset: (e: EditorView, pos: {
    line: number;
    ch: number;
}) => number;
export declare const offsetToPos: (e: EditorView, offset: number) => {
    line: number;
    ch: number;
};
export declare const queryUnsafe: (selector: string, elt?: Document | Element) => HTMLElement;
export declare function debounce(func: any, delay: number | undefined): (...args: any[]) => void;
export type autosaveFn = (content: any) => void | Promise<void>;
