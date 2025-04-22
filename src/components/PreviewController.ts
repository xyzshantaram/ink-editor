import cf from "campfire.js";
import { message } from "cf-alert";

export const PreviewController = (
    root: HTMLElement,
    parse: (contents: string) => string | Promise<string>,
) => {
    const contents = cf.store({ value: "" });
    const visibility = cf.store({ value: false });

    visibility.on("change", (event) => {
        root.classList.toggle("hidden", !event.value);
    });

    const onEditorChange = (str: string) =>
        cf.callbackify(() => {
            const parsed = parse(str);
            return typeof parsed === "string"
                ? Promise.resolve(parsed)
                : parsed;
        });

    contents.on("change", (event) => {
        onEditorChange(event.value)((err, res) => {
            if (err) return message(`Error loading preview: ${err}`);
            return cf.nu(root)
                .html`<div class='ink-preview-wrapper'>${cf.r(res)}</div>`
                .done();
        });
    });

    return { contents, visibility };
};
