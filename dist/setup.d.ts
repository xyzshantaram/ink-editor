import { EditorView } from "@codemirror/view";
import { autosaveFn } from "./utils";
interface SetupOptions {
    autosave: autosaveFn;
    retrieve: () => string | Promise<string>;
    doneFn: (text: string) => void | Promise<void>;
    exit: (text: string) => void | Promise<void>;
    fontFamily: string;
    verticalMode: boolean;
    parse: (src: string) => string;
}
export declare const setup: (cmRoot: HTMLElement, previewPane: HTMLElement, defaultContent: string, prompts: string[], placeholder: string, options: SetupOptions) => Promise<{
    editor: EditorView;
    injectExtension: (extn: any) => void;
}>;
export {};
