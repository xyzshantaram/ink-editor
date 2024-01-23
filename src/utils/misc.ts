import { r } from "campfire.js";
import { Icons } from "./icons";

export const getRootElt = (root: string | HTMLElement): HTMLElement => {
    if (typeof root === 'string') {
        const tmp = document.querySelector(root) as HTMLElement;
        if (tmp === null) throw new Error('root div not found while initialising editor');
        return tmp;
    }
    return root;
}

export const icon = (name: keyof typeof Icons) => {
    return r(Icons[name]);
}

export function debounce(func: any, delay: number | undefined) {
    let timer: number;
    return function (...args: any[]) {
        clearTimeout(timer);
        timer = window.setTimeout(() => {
            func.apply(this, args);
        }, delay || 0);
    };
}
