import { InkOptions } from "../InkEditor.ts";
import { InkEditor } from "../mod.ts";
import { ButtonSpec } from "./EditorButton.ts";
export declare const ToolbarButtons: (container: HTMLElement, editor: InkEditor, settings: InkOptions["toolbar"]) => import("campfire.js", { with: { "resolution-mode": "import" } }).ListStore<ButtonSpec>;
