import cf from 'campfire.js';
import { InkEditor } from '../mod.ts';
import { icon } from '../utils/misc.ts';
import { Icons } from '../utils/icons.ts';

export interface ButtonArgs {
    editor: InkEditor,
    iconName: keyof typeof Icons,
    action: string,
    label: string,
    showLabel?: boolean,
    idx: number,
    description: string,
    toggle?: boolean,
    modal?: boolean,
    disabled?: boolean
}

export type ButtonSpec = Omit<ButtonArgs, 'editor' | 'showLabel' | 'idx'>;

export const EditorButton = ({ modal, toggle, editor, iconName, action, description, label, showLabel, idx, disabled }: ButtonArgs) => {
    let toggleState = false;

    const [elt] = cf.nu("button.ink-button")
        .attr("data-ink-action", action)
        .attr("title", description)
        .attr("data-btn-idx", idx.toString())
        .html(cf.html`${icon(iconName)}<span>${showLabel ? `${label}` : ''}</span>`)
        .on("click", (e) => {
            editor.action(action);
            if (!toggle) return;
            toggleState = !toggleState;
            elt.classList.toggle('toggled', toggleState);
            modal ? editor.disableButtonsExcept(idx) : editor.enableButtons();
        })
        .done();

    if (disabled) elt.setAttribute('disabled', '');

    return [elt];
}