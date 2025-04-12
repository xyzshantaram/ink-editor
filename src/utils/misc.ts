import { Icons } from "./icons.ts";

/**
 * Gets a DOM element from a string selector or returns the passed element
 * @param root - A CSS selector or element reference
 * @returns The found HTMLElement
 */
export const getRootElt = (root: string | HTMLElement): HTMLElement => {
    if (typeof root === 'string') {
        const tmp = document.querySelector(root) as HTMLElement;
        if (tmp === null) throw new Error('root div not found while initialising editor');
        return tmp;
    }
    return root;
}

/**
 * Returns the HTML for an icon
 * @param name - Name of the icon to return
 * @returns RawHTML object for use with html`` templating
 */
export const icon = (name: keyof typeof Icons) => {
    return { raw: true, contents: Icons[name] } as const;
}

/**
 * Creates a debounced version of a function
 * @param func - The function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export function debounce(func: Function, delay: number | undefined) {
    let timer: number;
    return function (...args: any[]) {
        clearTimeout(timer);
        timer = window.setTimeout(() => {
            func.apply(this, args);
        }, delay || 0);
    };
}