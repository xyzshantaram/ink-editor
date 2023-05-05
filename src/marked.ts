import { marked } from "marked";

const renderer = {
    image: (href: string, _, text: string) =>
        `<div class='img-wrapper'>
            <a href="${href}">
                <span class="icon"></span>
                <span>${text}</span>
            </a>
        </div>`,
    html: () => '',
    table: () => '',
    checkbox: () => '',
    listitem: (text: string, task: boolean, checked: boolean) => {
        if (task) return `<li class=checkbox checked=${checked}>${text}</li>`;
        return `<li>${text}</li>`
    },
    heading: (text: string, level: number, _) => {
        const lv = `h${level == 1 ? 1 : 2}`
        return `<${lv}>${text}</${lv}>`
    }
};

marked.use({ renderer, smartypants: true });

export const parse = (raw: string) => {
    return marked.parse(raw);
}