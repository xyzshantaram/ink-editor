import { EditorView } from "@codemirror/view"

export const posToOffset = (e: EditorView, pos: { line: number, ch: number }) => {
    const doc = e.state.doc;
    return doc.line(pos.line + 1).from + pos.ch;
}

export const offsetToPos = (e: EditorView, offset: number) => {
    const doc = e.state.doc;
    let line = doc.lineAt(offset);
    return { line: line.number - 1, ch: offset - line.from }
}


export const queryUnsafe = (selector: string, elt: Document | Element = document) => {
    const val = elt.querySelector(selector)!;
    if (val instanceof Element) {
        return val as HTMLElement;
    }
    return val;
}

export const download = (filename: string, text: string) => {
    const elt = document.createElement('a');
    elt.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    elt.setAttribute('download', filename);

    elt.style.display = 'none';
    document.body.appendChild(elt);

    elt.click();

    document.body.removeChild(elt);
}

function debounce(func, delay: number | undefined) {
    let timerId: number;
    return function (...args: any[]) {
        clearTimeout(timerId);
        timerId = window.setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}

export const autosave = debounce((text: string) => {
    localStorage.setItem('bio-contents', text);
}, 1000);