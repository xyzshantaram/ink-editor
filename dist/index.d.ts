import { debounce } from './utils';
declare const DEFAULT_OPTIONS: {
    autosave: () => void;
    retrieve: () => string;
    doneFn: {
        (...data: any[]): void;
        (message?: any, ...optionalParams: any[]): void;
    };
    exit: () => void;
    width: string;
    height: string;
    fontFamily: string;
    disablePrompts: boolean;
    verticalMode: boolean;
    parse: (str: string) => string;
};
declare const init: (root: string | HTMLElement, defaultContent: string | undefined, prompts: string[] | undefined, placeholder: string | undefined, userOptions: Partial<Record<keyof typeof DEFAULT_OPTIONS, any>>) => Promise<{
    editor: import("@codemirror/view").EditorView;
    getVal: () => string;
    setVal: (text: string) => void;
}>;
export { debounce, init };
