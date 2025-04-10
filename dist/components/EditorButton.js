import cf from 'campfire.js';
import { icon } from '../utils/misc';
export const EditorButton = ({ modal, toggle, editor, iconName, action, description, label, showLabel, idx, disabled }) => {
    let toggleState = false;
    const [elt] = cf.nu("button.ink-button")
        .attr("data-ink-action", action)
        .attr("title", description)
        .attr("data-btn-idx", idx.toString())
        .html(cf.html `${icon(iconName)}${showLabel ? `<span>${label}</span>` : ''}`)
        .on("click", (e) => {
        editor.action(action);
        if (!toggle)
            return;
        toggleState = !toggleState;
        elt.classList.toggle('toggled', toggleState);
        modal ? editor.disableButtonsExcept(idx) : editor.enableButtons();
    })
        .done();
    if (disabled)
        elt.setAttribute('disabled', '');
    return [elt];
};
