var __accessCheck = (obj, member, msg) => {
  if (!member.has(obj))
    throw TypeError("Cannot " + msg);
};
var __privateGet = (obj, member, getter) => {
  __accessCheck(obj, member, "read from private field");
  return getter ? getter.call(obj) : member.get(obj);
};
var __privateAdd = (obj, member, value) => {
  if (member.has(obj))
    throw TypeError("Cannot add the same private member more than once");
  member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
};
var __privateSet = (obj, member, value, setter) => {
  __accessCheck(obj, member, "write to private field");
  setter ? setter.call(obj, value) : member.set(obj, value);
  return value;
};

// src/utils/icons.ts
import {
  Quote,
  Bold,
  Italic,
  Strikethrough,
  Link,
  Heading,
  Heading2,
  Check,
  Scissors,
  X,
  Eye,
  createElement,
  RotateCcw
} from "lucide";
var usedIcons = {
  Quote,
  Bold,
  Italic,
  Strikethrough,
  Link,
  Heading,
  Heading2,
  Check,
  Scissors,
  X,
  Eye,
  RotateCcw
};
var Icons = Object.fromEntries(
  Object.entries(usedIcons).map(([k, v]) => {
    const elt = createElement(v);
    elt.classList.add("lucide-icon");
    return [k, elt.outerHTML];
  })
);

// src/utils/misc.ts
var getRootElt = (root) => {
  if (typeof root === "string") {
    const tmp = document.querySelector(root);
    if (tmp === null)
      throw new Error("root div not found while initialising editor");
    return tmp;
  }
  return root;
};
var icon = (name) => {
  return { raw: true, contents: Icons[name] };
};
function debounce(func, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = window.setTimeout(() => {
      func.apply(this, args);
    }, delay || 0);
  };
}

// src/InkEditor.ts
import cf5 from "campfire.js";

// src/KeybindString.ts
var KEYBOARD_EVENT_KEYS = [
  "Unidentified",
  "Alt",
  "AltGraph",
  "CapsLock",
  "Control",
  "Fn",
  "FnLock",
  "Hyper",
  "Meta",
  "NumLock",
  "ScrollLock",
  "Shift",
  "Super",
  "Symbol",
  "SymbolLock",
  "Enter",
  "Tab",
  " ",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowUp",
  "End",
  "Home",
  "PageDown",
  "PageUp",
  "Backspace",
  "Clear",
  "Copy",
  "CrSel",
  "Cut",
  "Delete",
  "EraseEof",
  "ExSel",
  "Insert",
  "Paste",
  "Redo",
  "Undo",
  "Accept",
  "Again",
  "Attn",
  "Cancel",
  "ContextMenu",
  "Escape",
  "Execute",
  "Find",
  "Finish",
  "Help",
  "Pause",
  "Play",
  "Props",
  "Select",
  "ZoomIn",
  "ZoomOut",
  "BrightnessDown",
  "BrightnessUp",
  "Eject",
  "LogOff",
  "Power",
  "PowerOff",
  "PrintScreen",
  "Hibernate",
  "Standby",
  "WakeUp",
  "AllCandidates",
  "Alphanumeric",
  "CodeInput",
  "Compose",
  "Convert",
  "Dead",
  "FinalMode",
  "GroupFirst",
  "GroupLast",
  "GroupNext",
  "GroupPrevious",
  "ModeChange",
  "NextCandidate",
  "NonConvert",
  "PreviousCandidate",
  "Process",
  "SingleCandidate",
  "HangulMode",
  "HanjaMode",
  "JunjaMode",
  "Eisu",
  "Hankaku",
  "Hiragana",
  "HiraganaKatakana",
  "KanaMode",
  "KanjiMode",
  "Katakana",
  "Romaji",
  "Zenkaku",
  "ZenkakuHankaku",
  "F1",
  "F2",
  "F3",
  "F4",
  "F5",
  "F6",
  "F7",
  "F8",
  "F9",
  "F10",
  "F11",
  "F12",
  "F13",
  "F14",
  "F15",
  "F16",
  "F17",
  "F18",
  "F19",
  "F20",
  "Soft1",
  "Soft2",
  "Soft3",
  "Soft4",
  "AppSwitch",
  "Call",
  "Camera",
  "CameraFocus",
  "EndCall",
  "GoBack",
  "GoHome",
  "HeadsetHook",
  "LastNumberRedial",
  "Notification",
  "MannerMode",
  "VoiceDial",
  "ChannelDown",
  "ChannelUp",
  "MediaFastForward",
  "MediaPause",
  "MediaPlay",
  "MediaPlayPause",
  "MediaRecord",
  "MediaRewind",
  "MediaStop",
  "MediaTrackNext",
  "MediaTrackPrevious",
  "AudioBalanceLeft",
  "AudioBalanceRight",
  "AudioBassDown",
  "AudioBassBoostDown",
  "AudioBassBoostToggle",
  "AudioBassBoostUp",
  "AudioBassUp",
  "AudioFaderFront",
  "AudioFaderRear",
  "AudioSurroundModeNext",
  "AudioTrebleDown",
  "AudioTrebleUp",
  "AudioVolumeDown [1]",
  "AudioVolumeMute [1]",
  "AudioVolumeUp [1]",
  "MicrophoneToggle",
  "MicrophoneVolumeDown",
  "MicrophoneVolumeMute",
  "MicrophoneVolumeUp",
  "TV",
  "TV3DMode",
  "TVAntennaCable",
  "TVAudioDescription",
  "TVAudioDescriptionMixDown",
  "TVAudioDescriptionMixUp",
  "TVContentsMenu",
  "TVDataService",
  "TVInput",
  "TVInputComponent1",
  "TVInputComponent2",
  "TVInputComposite1",
  "TVInputComposite2",
  "TVInputHDMI1",
  "TVInputHDMI2",
  "TVInputHDMI3",
  "TVInputHDMI4",
  "TVInputVGA1",
  "TVMediaContext",
  "TVNetwork",
  "TVNumberEntry",
  "TVPower",
  "TVRadioService",
  "TVSatellite",
  "TVSatelliteBS",
  "TVSatelliteCS",
  "TVSatelliteToggle",
  "TVTerrestrialAnalog",
  "TVTerrestrialDigital",
  "TVTimer",
  "AVRInput",
  "AVRPower",
  "ColorF0Red",
  "ColorF1Green",
  "ColorF2Yellow",
  "ColorF3Blue",
  "ColorF4Grey",
  "ColorF5Brown",
  "ClosedCaptionToggle",
  "Dimmer",
  "DisplaySwap",
  "DVR",
  "Exit",
  "FavoriteClear0",
  "FavoriteClear1",
  "FavoriteClear2",
  "FavoriteClear3",
  "FavoriteRecall0",
  "FavoriteRecall1",
  "FavoriteRecall2",
  "FavoriteRecall3",
  "FavoriteStore0",
  "FavoriteStore1",
  "FavoriteStore2",
  "FavoriteStore3",
  "Guide",
  "GuideNextDay",
  "GuidePreviousDay",
  "Info",
  "InstantReplay",
  "Link",
  "ListProgram",
  "LiveContent",
  "Lock",
  "MediaApps",
  "MediaAudioTrack",
  "MediaLast",
  "MediaSkipBackward",
  "MediaSkipForward",
  "MediaStepBackward",
  "MediaStepForward",
  "MediaTopMenu",
  "NavigateIn",
  "NavigateNext",
  "NavigateOut",
  "NavigatePrevious",
  "NextFavoriteChannel",
  "NextUserProfile",
  "OnDemand",
  "Pairing",
  "PinPDown",
  "PinPMove",
  "PinPToggle",
  "PinPUp",
  "PlaySpeedDown",
  "PlaySpeedReset",
  "PlaySpeedUp",
  "RandomToggle",
  "RcLowBattery",
  "RecordSpeedNext",
  "RfBypass",
  "ScanChannelsToggle",
  "ScreenModeNext",
  "Settings",
  "SplitScreenToggle",
  "STBInput",
  "STBPower",
  "Subtitle",
  "Teletext",
  "VideoModeNext",
  "Wink",
  "ZoomToggle",
  "SpeechCorrectionList",
  "SpeechInputToggle",
  "Close",
  "New",
  "Open",
  "Print",
  "Save",
  "SpellCheck",
  "MailForward",
  "MailReply",
  "MailSend",
  "LaunchCalculator",
  "LaunchCalendar",
  "LaunchContacts",
  "LaunchMail",
  "LaunchMediaPlayer",
  "LaunchMusicPlayer",
  "LaunchMyComputer",
  "LaunchPhone",
  "LaunchScreenSaver",
  "LaunchSpreadsheet",
  "LaunchWebBrowser",
  "LaunchWebCam",
  "LaunchWordProcessor",
  "LaunchApplication1",
  "LaunchApplication2",
  "LaunchApplication3",
  "LaunchApplication4",
  "LaunchApplication5",
  "LaunchApplication6",
  "LaunchApplication7",
  "LaunchApplication8",
  "LaunchApplication9",
  "LaunchApplication10",
  "LaunchApplication11",
  "LaunchApplication12",
  "LaunchApplication13",
  "LaunchApplication14",
  "LaunchApplication15",
  "LaunchApplication16",
  "BrowserBack",
  "BrowserFavorites",
  "BrowserForward",
  "BrowserHome",
  "BrowserRefresh",
  "BrowserSearch",
  "BrowserStop",
  "Decimal",
  "Key11",
  "Key12",
  "Multiply",
  "Add",
  "Clear",
  "Divide",
  "Subtract",
  "Separator",
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
  "h",
  "i",
  "j",
  "k",
  "l",
  "m",
  "n",
  "o",
  "p",
  "q",
  "r",
  "s",
  "t",
  "u",
  "v",
  "w",
  "x",
  "y",
  "z",
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z"
];
var VALID_KEYBIND_MODIFIERS = [
  "C",
  "S",
  "A",
  "AS",
  "CS",
  "CA",
  "CSA"
];

// src/utils/editor.ts
import { EditorView, keymap, placeholder } from "@codemirror/view";
import {
  defaultHighlightStyle,
  syntaxHighlighting
} from "@codemirror/language";
import { Compartment, EditorState } from "@codemirror/state";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import {
  defaultKeymap,
  history,
  historyKeymap,
  indentWithTab
} from "@codemirror/commands";
import { tags } from "@lezer/highlight";
import { HighlightStyle } from "@codemirror/language";
var getDocAndCursor = (editor) => ({
  doc: editor.state.doc,
  cursor: editor.state.selection.main.head
});
var posToOffset = (e, pos) => {
  const doc = e.state.doc;
  return doc.line(pos.line + 1).from + pos.ch;
};
var offsetToPos = (e, offset) => {
  const doc = e.state.doc;
  let line = doc.lineAt(offset);
  return { line: line.number - 1, ch: offset - line.from };
};
var getLineOffset = (editor, offset) => {
  const p = offsetToPos(editor, offset);
  p.ch = 0;
  const newOffset = posToOffset(editor, p);
  return newOffset;
};
var hasSelection = (editor) => editor.state.selection.ranges.some((r) => !r.empty);
var insertBefore = (editor, cursor, insertion, cursorOffset = insertion.length) => {
  if (!hasSelection(editor)) {
    const offset = getLineOffset(editor, cursor);
    editor.dispatch({
      changes: { from: offset, to: offset, insert: insertion }
    });
    editor.dispatch({
      selection: { anchor: offset + (cursorOffset || 0) }
    });
    return;
  }
  editor.state.selection.ranges.forEach((selection) => {
    [selection.head, selection.anchor].toSorted().forEach((pos, i) => {
      const offset = getLineOffset(editor, i);
      editor.dispatch({
        changes: { from: offset, to: offset, insert: insertion }
      });
      if (i == 0) {
        const selection2 = {
          anchor: posToOffset(editor, {
            line: pos,
            ch: cursorOffset || 0
          })
        };
        editor.dispatch({ selection: selection2 });
      }
    });
  });
};
var insertAround = (editor, cursor, start, end = start) => {
  if (hasSelection(editor)) {
    const selection = editor.state.sliceDoc(
      editor.state.selection.main.from,
      editor.state.selection.main.to
    );
    editor.dispatch(editor.state.replaceSelection(start + selection + end));
  } else {
    editor.dispatch({
      changes: {
        from: cursor,
        to: cursor,
        insert: start + end
      }
    });
    editor.dispatch({
      selection: {
        anchor: editor.state.selection.main.head + start.length
      }
    });
  }
  editor.focus();
};
var insertWithNewline = (editor, text) => {
  const { doc, cursor } = getDocAndCursor(editor);
  const pos = offsetToPos(editor, cursor);
  pos.ch = doc.lineAt(cursor).length;
  const newPos = posToOffset(editor, pos);
  editor.dispatch({
    changes: { from: newPos, to: newPos, insert: `
${text}` }
  });
};
var theme = (fontFamily) => EditorView.theme({
  "&": {
    fontSize: "1rem",
    color: "black",
    height: "100%",
    overflow: "auto",
    backgroundColor: "white"
  },
  ".cm-content": {
    fontFamily
  }
});
var headingStyles = HighlightStyle.define([
  {
    tag: tags.heading1,
    color: "black",
    fontSize: "1.75rem",
    fontWeight: "700"
  },
  {
    tag: tags.heading2,
    color: "black",
    fontSize: "1.6rem",
    fontWeight: "700"
  },
  {
    tag: tags.heading3,
    color: "black",
    fontSize: "1.5rem",
    fontWeight: "700"
  },
  {
    tag: tags.heading4,
    color: "black",
    fontSize: "1.4rem",
    fontWeight: "700"
  },
  {
    tag: tags.heading5,
    color: "black",
    fontSize: "1.2rem",
    fontWeight: "700"
  },
  {
    tag: tags.heading6,
    color: "black",
    fontSize: "1.1rem",
    fontWeight: "700"
  }
].map((itm) => ({ ...itm, textDecoration: "none !important" })));
var getExtensions = (ph, autosave, fontFamily) => [
  history(),
  keymap.of([
    ...defaultKeymap,
    ...historyKeymap,
    indentWithTab
  ]),
  markdown({ base: markdownLanguage }),
  syntaxHighlighting(defaultHighlightStyle),
  syntaxHighlighting(headingStyles),
  placeholder(ph),
  EditorView.updateListener.of(
    async (u) => await autosave(u.state.doc.toString())
  ),
  EditorView.lineWrapping,
  theme(fontFamily)
];
var createCmEditor = ({ placeholder: placeholder2, onAutosave, fontFamily, parent }) => {
  const compartments = {
    readOnly: new Compartment()
  };
  const setReadOnly = (state) => {
    view.dispatch({
      effects: compartments.readOnly.reconfigure(
        EditorState.readOnly.of(state)
      )
    });
  };
  const view = new EditorView({
    extensions: [
      compartments.readOnly.of(EditorState.readOnly.of(false)),
      ...getExtensions(placeholder2, onAutosave, fontFamily)
    ],
    parent
  });
  return { view, setReadOnly };
};

// src/defaults.ts
var DEFAULT_ARGS = {
  toolbar: true,
  enableDefaultActions: true,
  defaultContents: "",
  enableSnippets: false,
  fontFamily: "monospace",
  height: "100svh",
  width: "100svw",
  snippets: [],
  onAutosave: (contents) => {
    localStorage.setItem("ink-contents", contents);
    console.debug("autosaving...");
  },
  onDone: (_) => {
  },
  onExit: (_) => {
  },
  retrieveSaved: () => localStorage.getItem("ink-contents") || "",
  makePreview: (c) => c,
  autosaveDelayMs: 1e3,
  placeholder: "Welcome to Ink!"
};
var EDITOR_DEFAULT_ACTIONS = {
  "bold": ({ editor }) => editor.insert.around("**"),
  "italic": ({ editor }) => editor.insert.around("_"),
  "strikethrough": ({ editor }) => editor.insert.around("~~"),
  "quote": ({ editor }) => editor.insert.before("> "),
  "a": ({ editor }) => editor.insert.at("[Link text](Link url)"),
  "h1": ({ editor }) => editor.insert.before("# ", 2),
  "h2": ({ editor }) => editor.insert.before("## ", 3),
  "h3": ({ editor }) => editor.insert.before("### ", 4),
  "h4": ({ editor }) => editor.insert.before("#### ", 5),
  "h5": ({ editor }) => editor.insert.before("##### ", 6),
  "h6": ({ editor }) => editor.insert.before("###### ", 7),
  "snippetmenu": ({ editor }) => Promise.resolve(editor.snippetsOpen?.update(true)),
  "done": ({ editor }) => editor.options.onDone(editor.getContents()),
  "exit": ({ editor }) => editor.options.onExit(editor.getContents()),
  "toggle_preview": ({ editor }) => {
    const vis = editor.preview.visibility.update((n) => !n);
    if (!vis)
      editor.preview.contents.update(editor.getContents());
    editor.setEditorVisibility(!!vis);
  },
  "reset": ({ editor }) => {
    editor.setContents(editor.options.defaultContents);
  }
};
var EDITOR_DEFAULT_BUTTONS = [
  {
    action: "bold",
    iconName: "Bold",
    label: "Bold",
    description: "Make text bold"
  },
  {
    action: "italic",
    iconName: "Italic",
    label: "Italic",
    description: "Make text italic"
  },
  {
    action: "strikethrough",
    iconName: "Strikethrough",
    label: "Strikethrough",
    description: "Add strikethrough to text"
  },
  {
    action: "quote",
    iconName: "Quote",
    label: "Quote",
    description: "Insert a blockquote"
  },
  {
    action: "a",
    iconName: "Link",
    label: "Link",
    description: "Insert a hyperlink"
  },
  {
    action: "h1",
    iconName: "Heading",
    label: "Heading 1",
    description: "Insert a level 1 heading"
  },
  {
    action: "h2",
    iconName: "Heading2",
    label: "Heading 2",
    description: "Insert a level 2 heading"
  },
  {
    action: "snippetmenu",
    iconName: "Scissors",
    label: "Snippets",
    description: "Open snippets menu"
  },
  {
    action: "reset",
    iconName: "RotateCcw",
    description: "Reset to default contents",
    label: "Default"
  },
  {
    "action": "toggle_preview",
    iconName: "Eye",
    label: "Preview",
    description: "Toggle preview mode",
    toggle: true,
    modal: true
  },
  {
    "action": "done",
    iconName: "Check",
    label: "Done",
    description: "Finish editing and apply changes"
  },
  {
    "action": "exit",
    iconName: "X",
    label: "Exit",
    description: "Exit editor without applying changes"
  }
];

// src/components/SnippetView.ts
import cf from "campfire.js";
var SnippetView = (parent, editor, snippets) => {
  const visibility = cf.store({ value: false });
  visibility.on("update", (event) => {
    parent.classList.toggle("hidden", !event.value);
  });
  const handleInteraction = (target) => {
    if (target.classList.contains("snippet-item")) {
      editor.insert.withNewline(target.innerHTML);
    } else if (target.closest(".snippets-close")) {
      visibility.update(false);
    }
  };
  const snippetList = snippets.map(
    (snippet) => cf.html`<div class="snippet-item" tabindex="0">${snippet}</div>`
  ).join("");
  cf.nu(parent).html`<div class='snippets-content'>
            <div class='snippets-header'>
                <div class='snippets-title'><strong>Snippets</strong></div>
                <div class='snippets-close' tabindex="0">${icon("X")}</div>
            </div>
            <div class='snippets-body'>
                <div class='snippets-list'>
                    ${cf.r(snippetList)}
                </div>
            </div>
        </div>`.on("click", (e) => handleInteraction(e.target)).on("keyup", (e) => {
    if (e.key === "Enter") {
      handleInteraction(e.target);
    }
  }).done();
  return visibility;
};

// src/components/Toolbar.ts
import cf3 from "campfire.js";

// src/components/EditorButton.ts
import cf2 from "campfire.js";
var EditorButton = ({ modal, toggle, editor, iconName, action, description, label, showLabel, idx, disabled }) => {
  let toggleState = false;
  const [elt] = cf2.nu("button.ink-button").attr("data-ink-action", action).attr("title", description).attr("data-btn-idx", idx.toString()).html(cf2.html`${icon(iconName)}<span>${showLabel ? `${label}` : ""}</span>`).on("click", (e) => {
    editor.action(action);
    if (!toggle)
      return;
    toggleState = !toggleState;
    elt.classList.toggle("toggled", toggleState);
    modal ? editor.disableButtonsExcept(idx) : editor.enableButtons();
  }).done();
  if (disabled)
    elt.setAttribute("disabled", "");
  return [elt];
};

// src/components/Toolbar.ts
var ToolbarButtons = (container, editor, settings) => {
  const store = cf3.store({ type: "list" });
  store.on("append", ({ value, idx }) => {
    cf3.insert(
      EditorButton({ ...value, idx, editor, showLabel: !editor.isCompact }),
      { into: container }
    );
  });
  store.on("change", ({ value, idx }) => {
    const elt = container.querySelector(`button[data-btn-idx="${idx}"]`);
    if (elt) {
      elt.toggleAttribute("disabled", !!value.disabled);
    }
  });
  store.on("deletion", ({ idx }) => {
    const button = container.querySelector(`button[data-btn-idx="${idx}"]`);
    if (button) {
      cf3.rm(button);
    }
  });
  if (typeof settings === "object" && !settings.defaults) {
    return store;
  }
  EDITOR_DEFAULT_BUTTONS.forEach((btn) => store.push(btn));
  return store;
};

// src/components/PreviewController.ts
import cf4 from "campfire.js";
import { message } from "cf-alert";
var PreviewController = (root, parse) => {
  const contents = cf4.store({ value: "" });
  const visibility = cf4.store({ value: false });
  visibility.on("change", (event) => {
    root.classList.toggle("hidden", !event.value);
  });
  const onEditorChange = (str) => cf4.callbackify(() => {
    const parsed = parse(str);
    return typeof parsed === "string" ? Promise.resolve(parsed) : parsed;
  });
  contents.on("change", (event) => {
    onEditorChange(event.value)((err, res) => {
      if (err)
        return message(`Error loading preview: ${err}`);
      return cf4.nu(root).html`<div class='ink-preview-wrapper'>${cf4.r(res)}</div>`.done();
    });
  });
  return { contents, visibility };
};

// src/InkEditor.ts
var _toolbar, _actions, _cmRoot;
var _InkEditor = class {
  /**
   * Creates a new InkEditor instance
   * @param {HTMLElement | string} root - Container element or selector for the editor
   * @param {Partial<InkOptions>} [userOptions] - Custom editor options
   */
  constructor(root, userOptions) {
    /** Store for toolbar buttons */
    __privateAdd(this, _toolbar, void 0);
    /** Map of registered editor actions by name */
    __privateAdd(this, _actions, void 0);
    /** Root element for CodeMirror editor */
    __privateAdd(this, _cmRoot, void 0);
    this.keybinds = /* @__PURE__ */ new Map();
    this.options = Object.assign({}, DEFAULT_ARGS, userOptions);
    this.parent = getRootElt(root);
    this.parent.classList.add("ink-root");
    this.isCompact = this.parent.classList.contains("compact");
    const [_, snippets, ctrls, preview, cmRoot] = cf5.nu(this.parent).gimme(
      ".ink-snippets",
      ".ink-ctrl-btns",
      ".ink-preview",
      ".ink-editor"
    ).html`
            <div class=ink-editor-wrapper>
                <div class="ink-ctrl-btns"></div>
                <div class="ink-preview"></div>
                <div class="ink-snippets"></div>
                <div class="ink-editor"></div>
            </div>
            `.style("width", this.options.width).style("height", this.options.height).done();
    __privateSet(this, _cmRoot, cmRoot);
    this.preview = PreviewController(preview, this.options.makePreview);
    __privateSet(this, _actions, /* @__PURE__ */ new Map());
    if (!this.options.toolbar)
      ctrls.remove();
    else
      __privateSet(this, _toolbar, ToolbarButtons(ctrls, this, this.options.toolbar));
    if (!this.options.enableSnippets)
      snippets.remove();
    else {
      this.snippetsOpen = SnippetView(
        snippets,
        this,
        this.options.snippets
      );
    }
    if (this.options.enableDefaultActions) {
      Object.entries(EDITOR_DEFAULT_ACTIONS).forEach(
        ([k, v]) => this.registerAction(k, v)
      );
    }
    if (this.options.keybinds) {
      console.log(this.options.keybinds);
      Object.entries(this.options.keybinds || {}).forEach(([binding, action]) => {
        this.registerKeybind(binding, action);
      });
      this.setupKeybindListener();
    }
    const { view, setReadOnly } = createCmEditor({
      placeholder: this.options.placeholder,
      onAutosave: debounce(
        this.options.onAutosave,
        this.options.autosaveDelayMs
      ),
      parent: cmRoot,
      fontFamily: this.options.fontFamily
    });
    this.editor = view;
    this.setReadOnly = setReadOnly;
    this.initialize();
  }
  /**
   * Initializes the editor with saved or default content
   * @returns {Promise<void>}
   */
  async initialize() {
    const saved = await this.options.retrieveSaved();
    if (saved) {
      this.setContents(saved);
    } else {
      this.setContents(this.options.defaultContents);
    }
  }
  static isMacOS() {
    if (typeof navigator !== "undefined") {
      if (navigator.maxTouchPoints && navigator.maxTouchPoints > 1)
        return false;
      const uaPlatform = navigator.userAgentData && navigator.userAgentData.platform || navigator.platform || "";
      return uaPlatform.toLowerCase().includes("mac");
    }
    if (typeof process !== "undefined" && process.platform) {
      return process.platform === "darwin";
    }
    return false;
  }
  static isCtrlDown(e) {
    return _InkEditor.isMacOS() ? e.metaKey : e.ctrlKey;
  }
  setupKeybindListener() {
    globalThis.addEventListener("keydown", (e) => {
      const binding = [];
      if (_InkEditor.isCtrlDown(e))
        binding.push("C");
      if (e.altKey)
        binding.push("A");
      if (e.shiftKey)
        binding.push("S");
      binding.push("+");
      binding.push(e.key);
      const built = binding.join("");
      console.log(built);
      if (!_InkEditor.isKeybindString(built)) {
        return console.warn(
          `Built a bad keybind string ${built}. Please report this to https://github.com/xyzshantaram/ink-editor`
        );
      }
      e.preventDefault();
      const action = this.keybinds.get(built);
      console.log(action);
      if (action)
        return this.action(action);
    });
  }
  /**
   * Executes a registered editor action by name
   * @param {string} name - Name of the action to execute
   */
  action(name) {
    const action = __privateGet(this, _actions).get(name);
    if (!action) {
      console.warn("Action", name, "called, but no such action exists.");
      return;
    }
    action({ editor: this });
  }
  /**
   * Registers a new button in the toolbar
   * @param {ButtonArgs} btn - Button configuration
   */
  registerButton(btn) {
    __privateGet(this, _toolbar)?.push(btn);
  }
  /**
   * Registers a new editor action
   * @param {string} name - Unique name for the action
   * @param {EditorAction} action - Function to execute when action is triggered
   */
  registerAction(name, action) {
    __privateGet(this, _actions).set(name, action);
  }
  /**
   * Removes a registered action
   * @param {string} name - Name of the action to remove
   */
  deregisterAction(name) {
    __privateGet(this, _actions).delete(name);
  }
  /**
   * Provides methods for inserting content at various positions in the editor
   */
  get insert() {
    return {
      /**
       * Inserts text before the current cursor position
       * @param {string} insertion - Text to insert
       * @param {number} [cursorOffset=insertion.length] - Where to place cursor after insertion
       */
      before: (insertion, cursorOffset = insertion.length) => {
        const { cursor } = getDocAndCursor(this.editor);
        insertBefore(this.editor, cursor, insertion, cursorOffset);
      },
      /**
       * Wraps selected text with start and end strings
       * @param {string} start - Text to insert before selection
       * @param {string} [end=start] - Text to insert after selection (defaults to start)
       */
      around: (start, end = start) => {
        const { cursor } = getDocAndCursor(this.editor);
        insertAround(this.editor, cursor, start, end);
      },
      /**
       * Inserts text at the current cursor position
       * @param {string} str - Text to insert
       */
      at: (str) => {
        const { cursor } = getDocAndCursor(this.editor);
        this.editor.dispatch({
          changes: {
            from: cursor,
            to: cursor,
            insert: str
          }
        });
      },
      /**
       * Inserts text with proper newline handling
       * @param {string} text - Text to insert
       */
      withNewline: (text) => insertWithNewline(this.editor, text)
    };
  }
  /**
   * Gets the current editor contents as a string
   * @returns {string} Current editor contents
   */
  getContents() {
    return this.editor.state.doc.toString();
  }
  /**
   * Sets the editor content
   * @param {string} contents - New content to set
   */
  setContents(contents) {
    this.editor.dispatch({
      changes: {
        from: 0,
        to: this.editor.state.doc.length,
        insert: contents
      }
    });
  }
  /**
   * Shows or hides the editor
   * @param {boolean} state - Whether editor should be visible
   */
  setEditorVisibility(state) {
    __privateGet(this, _cmRoot).classList.toggle("hidden", !state);
  }
  static isKeybindString(binding) {
    const [mod, key] = binding.split("+");
    console.log(mod, key);
    if (!mod || !key)
      return false;
    console.log({
      mod,
      key,
      includesMod: VALID_KEYBIND_MODIFIERS.includes(mod),
      includesKey: KEYBOARD_EVENT_KEYS.includes(key)
    });
    return VALID_KEYBIND_MODIFIERS.includes(mod) && KEYBOARD_EVENT_KEYS.includes(key);
  }
  registerKeybind(binding, action) {
    const err = (s) => console.warn(s);
    if (!_InkEditor.isKeybindString(binding)) {
      return err(
        `Tried to register invalid keybind "${binding}", dropping...`
      );
    }
    if (!__privateGet(this, _actions).has(action)) {
      return err(
        `Tried to register invalid action "${action}", dropping...`
      );
    }
    this.keybinds.set(binding, action);
  }
  /**
   * Disables all toolbar buttons except one
   * @param {number} target - Index of button to keep enabled
   */
  disableButtonsExcept(target) {
    __privateGet(this, _toolbar)?.forEach((btn, idx) => {
      if (idx === target)
        return;
      __privateGet(this, _toolbar)?.set(idx, { ...btn, disabled: true });
    });
  }
  /**
   * Enables all toolbar buttons
   */
  enableButtons() {
    __privateGet(this, _toolbar)?.forEach((btn, idx) => {
      __privateGet(this, _toolbar)?.set(idx, { ...btn, disabled: false });
    });
  }
};
var InkEditor = _InkEditor;
_toolbar = new WeakMap();
_actions = new WeakMap();
_cmRoot = new WeakMap();
InkEditor.KEYBIND_RE = /(C)?(S)?(A)?\+(\w+)/;

// src/mod.ts
var mod_default = { InkEditor };
export {
  InkEditor,
  mod_default as default
};
//# sourceMappingURL=mod.js.map
