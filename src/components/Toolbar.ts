import cf from "campfire.js";
import { EDITOR_DEFAULT_BUTTONS } from "../defaults";
import { InkOptions } from "../InkEditor";
import { InkEditor } from "../mod";
import { ButtonSpec, EditorButton } from "./EditorButton";

export const ToolbarButtons = (container: HTMLElement, editor: InkEditor, settings: InkOptions['toolbar']) => {
    const store = cf.store<ButtonSpec>({ type: "list" });

    store.on("append", ({ value, idx }) => {
        cf.insert(EditorButton({ ...value, idx, editor, showLabel: !editor.isCompact }),
            { into: container });
    });

    store.on("change", ({ value, idx }) => {
        const elt = container.querySelector(`button[data-btn-idx="${idx}"]`) as HTMLElement;
        if (elt) {
            elt.toggleAttribute('disabled', !!value.disabled);
        }
    });

    store.on("deletion", ({ idx }) => {
        const button = container.querySelector(`button[data-btn-idx="${idx}"]`);
        if (button) {
            cf.rm(button);
        }
    });

    if (typeof settings === 'object' && !settings.defaults) {
        return store;
    }

    EDITOR_DEFAULT_BUTTONS.forEach(btn => store.push(btn));

    return store;
}