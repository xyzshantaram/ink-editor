import cf from "campfire.js";
import { icon } from "../utils/misc.ts";
import { InkEditor } from "../InkEditor.ts";

export const SnippetView = (parent: HTMLElement, editor: InkEditor, snippets: string[]) => {
    const visibility = cf.store({ value: false });

    visibility.on('update', (event) => {
        console.log(event);
        parent.classList.toggle('hidden', !event.value);
    });

    const handleInteraction = (target: HTMLElement) => {
        console.log(target.closest('.snippets-close'));
        if (target.classList.contains('snippet-item'))
            editor.insert.withNewline(target.innerHTML);
        else if (target.closest('.snippets-close')) {
            visibility.update(false);
        }
    };

    const snippetList = snippets.map(snippet =>
        cf.html`<div class="snippet-item" tabindex="0">${snippet}</div>`
    ).join('');

    cf.extend(parent, {
        raw: true,
        contents: cf.html`
        <div class='snippets-content'>
            <div class='snippets-header'>
                <div class='snippets-title'><strong>Snippets</strong></div>
                <div class='snippets-close' tabindex="0">${icon('X')}</div>
            </div>
            <div class='snippets-body'>
                <div class='snippets-list'>
                    ${cf.r(snippetList)}
                </div>
            </div>
        </div>`,
        on: {
            click: (e: MouseEvent) => handleInteraction(e.target as HTMLElement),
            keyup: (e: KeyboardEvent) => {
                if (e.key === 'Enter') handleInteraction(e.target as HTMLElement);
            }
        }
    });

    return visibility;
}