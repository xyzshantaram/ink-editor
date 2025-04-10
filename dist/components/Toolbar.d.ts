import { InkOptions } from "../InkEditor";
import { InkEditor } from "../mod";
import { ButtonSpec } from "./EditorButton";
export declare const ToolbarButtons: (container: HTMLElement, editor: InkEditor, settings: InkOptions["toolbar"]) => import("campfire.js").ListStore<ButtonSpec>;
