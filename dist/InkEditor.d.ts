import { EditorView } from '@codemirror/view';
import { Store } from 'campfire.js';
import { ButtonArgs } from './components/EditorButton';
export interface InkOptions {
    toolbar: boolean | {
        enable: boolean;
        defaults: boolean;
    };
    enableDefaultActions: boolean;
    defaultContents: string;
    enableSnippets: boolean;
    fontFamily: string;
    height: string;
    placeholder: string;
    snippets: string[];
    width: string;
    onAutosave: (contents: string) => void | Promise<void>;
    onDone: (contents: string) => void | Promise<void>;
    onExit: (contents: string) => void | Promise<void>;
    makePreview: (contents: string) => string | Promise<string>;
    retrieveSaved: () => string | Promise<string>;
    autosaveDelayMs: number;
}
export interface EditorActionArgs {
    editor: InkEditor;
}
export type EditorAction = (args: EditorActionArgs) => void | Promise<void>;
export declare class InkEditor {
    #private;
    parent: HTMLElement;
    editor: EditorView;
    isCompact: boolean;
    snippetsOpen: Store<boolean> | undefined;
    options: InkOptions;
    preview: {
        contents: Store<string>;
        visibility: Store<boolean>;
    };
    setReadOnly: (state: boolean) => void;
    constructor(root: HTMLElement | string, userOptions?: Partial<InkOptions>);
    initialize(): Promise<void>;
    action(name: string): void;
    registerButton(btn: ButtonArgs): void;
    registerAction(name: string, action: EditorAction): void;
    deregisterAction(name: string): void;
    get insert(): {
        before: (insertion: string, cursorOffset?: number) => void;
        around: (start: string, end?: string) => void;
        at: (str: string) => void;
        withNewline: (text: string) => void;
    };
    getContents(): string;
    setContents(contents: string): void;
    setEditorVisibility(state: boolean): void;
    disableButtonsExcept(target: number): void;
    enableButtons(): void;
}
