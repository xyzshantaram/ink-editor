import cf from "campfire.js";
export const PreviewController = (root, parse) => {
    const contents = cf.store({ value: '' });
    const visibility = cf.store({ value: false });
    visibility.on("change", (event) => {
        root.classList.toggle('hidden', !event.value);
    });
    contents.on("change", async (event) => {
        const parsed = await parse(event.value);
        cf.extend(root, {
            contents: cf.html `<div class='ink-preview-wrapper'>${cf.r(parsed)}</div>`,
            raw: true
        });
    });
    return { contents, visibility };
};
