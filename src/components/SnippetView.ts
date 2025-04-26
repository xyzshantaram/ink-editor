import cf from "campfire.js";
import { icon } from "../utils/misc.ts";
import { InkEditor } from "../InkEditor.ts";

export const SnippetView = (
    parent: HTMLElement,
    editor: InkEditor,
    snippets: string[],
) => {
    const visibility = cf.store({ value: false });

    visibility.on("update", (event) => {
        parent.classList.toggle("hidden", !event.value);
    });

    const handleInteraction = (target: HTMLElement) => {
        if (target.classList.contains("snippet-item")) {
            editor.insert.withNewline(target.innerHTML);
        } else if (target.closest(".snippets-close")) {
            visibility.update(false);
        }
    };

    const snippetList = snippets.map((snippet) =>
        cf.html`<div class="snippet-item" tabindex="0">${snippet}</div>`
    ).join("");

    cf.nu(parent)
        .html`<div class='snippets-content'>
            <div class='snippets-header'>
                <div class='snippets-title'><strong>Snippets</strong></div>
                <div class='snippets-close' tabindex="0">${icon("X")}</div>
            </div>
            <div class='snippets-body'>
                <div class='snippets-list'>
                    ${cf.r(snippetList)}
                </div>
            </div>
        </div>`
        .on("click", (e) => handleInteraction(e.target as HTMLElement))
        .on("keyup", (e) => {
            if (e.key === "Enter") {
                handleInteraction(e.target as HTMLElement);
            }
        })
        .done();

    return visibility;
};
