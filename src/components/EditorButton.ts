import { nu, html, r, Store } from 'campfire.js';
import { InkEditor } from '../mod';
import { icon } from '../utils/misc';
import { Icons } from '../utils/icons';

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

export const EditorButton = ({ modal, toggle, editor, iconName, action, description, label, showLabel, idx }: ButtonArgs) => {
    let toggleState = false;

    const [elt] = nu('button.ink-button', {
        raw: true,
        attrs: { 'data-ink-action': action, title: description, 'data-btn-idx': idx.toString() },
        c: html`${icon(iconName)}${r(showLabel ? `<span>${label}</span>` : '')}`,
        on: {
            click: (e) => {
                editor.action(action);
                if (toggle) {
                    toggleState = !toggleState;
                    elt.classList.toggle('toggled', toggleState);
                    if (modal) {
                        if (toggleState) editor.disableButtonsExcept(idx);
                        else editor.enableButtons();
                    }
                }
            }
        }
    })

    return [elt];
}