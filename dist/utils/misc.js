import { r } from "campfire.js";
import { Icons } from "./icons";
export const getRootElt = (root) => {
    if (typeof root === 'string') {
        const tmp = document.querySelector(root);
        if (tmp === null)
            throw new Error('root div not found while initialising editor');
        return tmp;
    }
    return root;
};
export const icon = (name) => {
    return r(Icons[name]);
};
export function debounce(func, delay) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = window.setTimeout(() => {
            func.apply(this, args);
        }, delay || 0);
    };
}
