import { Store, extend, html, r } from "campfire.js";
import { icon } from "../utils/misc";
import { InkEditor } from "../InkEditor";

export const SnippetView = (parent: HTMLElement, editor: InkEditor, snippets: string[]) => {
    const visibility = new Store<boolean>(false);
    visibility.on('update', (val) => parent.classList.toggle('hidden', !val), true);

    const handleInteraction = (target: HTMLElement) => {
        console.log(target.closest('snippets-close'));
        if (target.classList.contains('snippet-item'))
            editor.insert.withNewline(target.innerHTML);
        else if (target.closest('.snippets-close')) {
            visibility.update(false);
        }
    }

    extend(parent, {
        raw: true,
        c: html`
        <div class='snippets-content'>
            <div class='snippets-header'>
                <div class='snippets-title'><strong>Snippets</strong></div>
                <div class='snippets-close' tabindex="0">${icon('X')}</div>
            </div>
            <div class='snippets-body'>
                <div class='snippets-list'>
                ${r(snippets.map(snippet => html`<div class=snippet-item tabindex="0">${snippet}</div>`).join(''))}
                </div>
            </div>
        </div>`,
        on: {
            click: (e: MouseEvent) => handleInteraction(e.target as HTMLElement),
            keyup: (e: KeyboardEvent) => {
                if (e.key !== 'Enter') return;
                handleInteraction(e.target as HTMLElement);
            }
        }
    });

    return visibility;
}