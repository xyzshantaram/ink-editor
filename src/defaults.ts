import type { EditorAction, InkOptions } from "./InkEditor.ts";
import type { ButtonArgs, ButtonSpec } from "./components/EditorButton.ts";

export const DEFAULT_ARGS: InkOptions = {
    toolbar: true,
    enableDefaultActions: true,
    defaultContents: '',
    enableSnippets: false,
    fontFamily: 'monospace',
    height: '100svh',
    width: '100svw',
    snippets: [],
    onAutosave: (contents) => {
        localStorage.setItem('ink-contents', contents);
        console.log('autosaving...');
    },
    onDone: _ => { },
    onExit: _ => { },
    retrieveSaved: () => localStorage.getItem('ink-contents') || '',
    makePreview: c => c,
    autosaveDelayMs: 1000,
    placeholder: 'Welcome to Ink!'
}

export const EDITOR_DEFAULT_ACTIONS: Record<string, EditorAction> = {
    "bold": ({ editor }) => editor.insert.around("**"),
    "italic": ({ editor }) => editor.insert.around("_"),
    "strikethrough": ({ editor }) => editor.insert.around("~~"),
    "quote": ({ editor }) => editor.insert.before("> "),
    "a": ({ editor }) => editor.insert.at("[Link text](Link url)"),
    "h1": ({ editor }) => editor.insert.before('# ', 2),
    "h2": ({ editor }) => editor.insert.before('## ', 3),
    "h3": ({ editor }) => editor.insert.before('### ', 4),
    "h4": ({ editor }) => editor.insert.before('#### ', 5),
    "h5": ({ editor }) => editor.insert.before('##### ', 6),
    "h6": ({ editor }) => editor.insert.before('###### ', 7),
    "snippetmenu": ({ editor }) => editor.snippetsOpen?.update(true),
    "done": ({ editor }) => editor.options.onDone(editor.getContents()),
    "exit": ({ editor }) => editor.options.onExit(editor.getContents()),
    "toggle_preview": ({ editor }) => {
        const visibility = editor.preview.visibility.value;
        editor.preview.visibility.update(!visibility);
        /* value is flipped now so we have to work with negating the old value */
        if (!visibility) editor.preview.contents.update(editor.getContents());
        editor.setEditorVisibility(visibility);
    },
    "reset": ({ editor }) => {
        editor.setContents(editor.options.defaultContents);
    }
}

export const EDITOR_DEFAULT_BUTTONS: Array<ButtonSpec> = [
    {
        action: 'bold',
        iconName: 'Bold',
        label: 'Bold',
        description: 'Make text bold'
    },
    {
        action: 'italic',
        iconName: 'Italic',
        label: 'Italic',
        description: 'Make text italic'
    },
    {
        action: 'strikethrough',
        iconName: 'Strikethrough',
        label: 'Strikethrough',
        description: 'Add strikethrough to text'
    },
    {
        action: 'quote',
        iconName: 'Quote',
        label: 'Quote',
        description: 'Insert a blockquote'
    },
    {
        action: 'a',
        iconName: 'Link',
        label: 'Link',
        description: 'Insert a hyperlink'
    },
    {
        action: 'h1',
        iconName: 'Heading',
        label: 'Heading 1',
        description: 'Insert a level 1 heading'
    },
    {
        action: 'h2',
        iconName: 'Heading2',
        label: 'Heading 2',
        description: 'Insert a level 2 heading'
    },
    {
        action: 'snippetmenu',
        iconName: 'Scissors',
        label: 'Snippets',
        description: 'Open snippets menu'
    },
    {
        action: "reset",
        iconName: "RotateCcw",
        description: "Reset to default contents",
        label: "Default"
    },
    {
        'action': 'toggle_preview',
        iconName: 'Eye',
        label: 'Preview',
        description: 'Toggle preview mode',
        toggle: true,
        modal: true
    },
    {
        'action': 'done',
        iconName: 'Check',
        label: 'Done',
        description: 'Finish editing and apply changes'
    },
    {
        'action': 'exit',
        iconName: 'X',
        label: 'Exit',
        description: 'Exit editor without applying changes'
    },
];