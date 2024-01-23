import { EditorView } from '@codemirror/view';
import { debounce, getRootElt } from './utils/misc';
import cf, { ListStore, Store } from 'campfire.js';
import { createCmEditor, getDocAndCursor, insertAround, insertBefore, insertWithNewline } from './utils/editor';
import { ButtonArgs, ButtonSpec } from './components/EditorButton';
import { DEFAULT_ARGS, EDITOR_DEFAULT_ACTIONS } from './defaults';
import { SnippetView } from './components/SnippetView';
import { ToolbarButtons } from './components/Toolbar';
import { PreviewController } from './components/PreviewController';

export interface InkOptions {
    toolbar: boolean | {
        enable: boolean,
        defaults: boolean
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
    editor: InkEditor
}

export type EditorAction = (args: EditorActionArgs) => void | Promise<void>;

export class InkEditor {
    #toolbar: ListStore<ButtonSpec> | undefined;
    #actions: Map<string, EditorAction>;
    #cmRoot: HTMLElement;
    parent: HTMLElement;
    editor: EditorView;
    isCompact: boolean;
    snippetsOpen: Store<boolean> | undefined;
    options: InkOptions;
    preview: {
        contents: Store<string>;
        visibility: Store<boolean>;
    }
    setReadOnly: (state: boolean) => void;

    constructor(root: HTMLElement | string, userOptions?: Partial<InkOptions>) {
        this.options = Object.assign({}, DEFAULT_ARGS, userOptions);
        const parent = getRootElt(root);

        parent.classList.add('ink-root');
        this.isCompact = parent.classList.contains('compact');
        const [_, snippets, ctrls, preview, cmRoot, editorWrapper] = cf.extend(parent, {
            raw: true,
            gimme: ['.ink-snippets', '.ink-ctrl-btns', '.ink-preview', '.ink-editor', '.ink-editor-wrapper'],
            contents: cf.html`
            <div class=ink-editor-wrapper>
                <div class="ink-ctrl-btns"></div>
                <div class="ink-preview"></div>
                <div class="ink-snippets"></div>
                <div class="ink-editor"></div>
            </div>`,
            style: {
                width: this.options.width,
                height: this.options.height
            }
        });
        this.#cmRoot = cmRoot;

        this.preview = PreviewController(preview, this.options.makePreview);
        this.#actions = new Map();

        if (!this.options.toolbar) ctrls.remove();
        else this.#toolbar = ToolbarButtons(ctrls, this, this.options.toolbar);

        if (!this.options.enableSnippets) snippets.remove();
        else this.snippetsOpen = SnippetView(snippets, this, this.options.snippets);

        if (this.options.enableDefaultActions) Object.entries(EDITOR_DEFAULT_ACTIONS).forEach(
            ([k, v]) => this.registerAction(k, v));

        const { view, setReadOnly } = createCmEditor({
            placeholder: this.options.placeholder,
            onAutosave: debounce(this.options.onAutosave, this.options.autosaveDelayMs),
            parent: cmRoot,
            fontFamily: this.options.fontFamily
        });

        this.editor = view;
        this.setReadOnly = setReadOnly;

        this.initialize();
    }

    async initialize() {
        const saved = await this.options.retrieveSaved();
        if (saved) {
            this.setContents(saved);
        }
        else {
            this.setContents(this.options.defaultContents);
        }
    }

    action(name: string) {
        const action = this.#actions.get(name);
        if (!action) {
            console.warn('Action', name, 'called, but no such action exists.');
            return;
        }

        action({ editor: this });
    }

    registerButton(btn: ButtonArgs) {
        this.#toolbar?.push(btn);
    }

    registerAction(name: string, action: EditorAction) {
        this.#actions.set(name, action);
    }

    deregisterAction(name: string) {
        this.#actions.delete(name);
    }

    get insert() {
        return {
            before: (insertion: string, cursorOffset = insertion.length) => {
                const { cursor } = getDocAndCursor(this.editor);
                insertBefore(this.editor, cursor!, insertion, cursorOffset);
            },
            around: (start: string, end = start) => {
                const { cursor } = getDocAndCursor(this.editor);
                insertAround(this.editor, cursor!, start, end);
            },
            at: (str: string) => {
                const { cursor } = getDocAndCursor(this.editor);
                this.editor.dispatch({
                    changes: {
                        from: cursor!,
                        to: cursor!,
                        insert: str
                    }
                })
            },
            withNewline: (text: string) => insertWithNewline(this.editor, text)
        }
    }

    getContents() {
        return this.editor.state.doc.toString();
    }

    setContents(contents: string) {
        this.editor.dispatch({
            changes: { from: 0, to: this.editor.state.doc.length, insert: contents }
        });
    }

    setEditorVisibility(state: boolean) {
        this.#cmRoot.classList.toggle('hidden', !state);
    }

    disableButtonsExcept(target: number) {
        this.#toolbar?.value.forEach((btn, idx) => {
            if (idx === target) return;
            this.#toolbar?.setAt(idx, {
                ...btn,
                disabled: true
            });
        })
    }

    enableButtons() {
        this.#toolbar?.value.forEach((btn, idx) => {
            this.#toolbar?.setAt(idx, {
                ...btn,
                disabled: false
            })
        })
    }
}