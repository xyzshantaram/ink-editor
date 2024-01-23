import { ListStore } from "campfire.js";
import { EDITOR_DEFAULT_BUTTONS } from "../defaults";
import { InkOptions } from "../InkEditor";
import { InkEditor } from "../mod";
import { ButtonSpec, EditorButton } from "./EditorButton";

export const ToolbarButtons = (container: HTMLElement, editor: InkEditor, settings: InkOptions['toolbar']) => {
    const store = new ListStore<ButtonSpec>([]);

    store.on('push', ({ value, idx }) => container.append(...EditorButton({
        ...value, idx, editor, showLabel: !editor.isCompact
    })));

    store.on('mutation', ({ idx, value }: { idx: number, value: ButtonSpec }) => {
        const elt = container.querySelector(`button[data-btn-idx="${idx}"]`)!;
        elt.toggleAttribute('disabled', value.disabled);
    })

    store.on('remove', ({ idx }) => container
        .querySelector(`button[data-btn-idx="${idx}"]`)?.remove());

    if (typeof settings === 'object' && !settings.defaults) return store;
    EDITOR_DEFAULT_BUTTONS.forEach(btn => store.push(btn));

    return store;
}