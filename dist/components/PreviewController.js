import { Store, html, r } from "campfire.js";
export const PreviewController = (root, parse) => {
    const contents = new Store('');
    const visibility = new Store(false);
    visibility.on('update', val => root.classList.toggle('hidden', !val), true);
    contents.on('update', async (val) => root.innerHTML = html `
    <div class='ink-preview-wrapper'>${r(await parse(val))}</div>
    `);
    return { contents, visibility };
};
