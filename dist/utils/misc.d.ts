import { Icons } from "./icons.ts";
/**
 * Gets a DOM element from a string selector or returns the passed element
 * @param root - A CSS selector or element reference
 * @returns The found HTMLElement
 */
export declare const getRootElt: (root: string | HTMLElement) => HTMLElement;
/**
 * Returns the HTML for an icon
 * @param name - Name of the icon to return
 * @returns RawHTML object for use with html`` templating
 */
export declare const icon: (name: keyof typeof Icons) => {
    readonly raw: true;
    readonly contents: string;
};
/**
 * Creates a debounced version of a function
 * @param func - The function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 */
export declare function debounce(func: Function, delay: number | undefined): (...args: any[]) => void;
