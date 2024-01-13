export const posToOffset = (e, pos) => {
    const doc = e.state.doc;
    return doc.line(pos.line + 1).from + pos.ch;
};
export const offsetToPos = (e, offset) => {
    const doc = e.state.doc;
    let line = doc.lineAt(offset);
    return { line: line.number - 1, ch: offset - line.from };
};
export const queryUnsafe = (selector, elt = document) => {
    const val = elt.querySelector(selector);
    if (val instanceof Element) {
        return val;
    }
    return val;
};
export function debounce(func, delay) {
    let timerId;
    return function (...args) {
        clearTimeout(timerId);
        timerId = window.setTimeout(() => {
            func.apply(this, args);
        }, delay);
    };
}
