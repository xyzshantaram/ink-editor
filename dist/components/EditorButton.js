import { nu, html, r } from 'campfire.js';
import { icon } from '../utils/misc';
export const EditorButton = ({ modal, toggle, editor, iconName, action, description, label, showLabel, idx }) => {
    let toggleState = false;
    const [elt] = nu('button.ink-button', {
        raw: true,
        attrs: { 'data-ink-action': action, title: description, 'data-btn-idx': idx.toString() },
        c: html `${icon(iconName)}${r(showLabel ? `<span>${label}</span>` : '')}`,
        on: {
            click: (e) => {
                editor.action(action);
                if (toggle) {
                    toggleState = !toggleState;
                    elt.classList.toggle('toggled', toggleState);
                    if (modal) {
                        if (toggleState)
                            editor.disableButtonsExcept(idx);
                        else
                            editor.enableButtons();
                    }
                }
            }
        }
    });
    return [elt];
};
