import { marked } from "marked";
const renderer = {
    image: (href, _, text) => `<div class='img-wrapper'>
            <a href="${href}">
                <span class="icon"></span>
                <span>${text}</span>
            </a>
        </div>`,
    html: () => '',
    table: () => '',
    checkbox: () => '',
    listitem: (text, task, checked) => {
        if (task)
            return `<li class=checkbox checked=${checked}>${text}</li>`;
        return `<li>${text}</li>`;
    },
    heading: (text, level, _) => {
        const lv = level == 1 ? 1 : 2;
        return `<div class='ink-heading-${lv}'>${text}</div>`;
    }
};
marked.use({ renderer, smartypants: true });
export const parse = (raw) => {
    return marked.parse(raw);
};
