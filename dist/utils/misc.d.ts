import { Icons } from "./icons";
export declare const getRootElt: (root: string | HTMLElement) => HTMLElement;
export declare const icon: (name: keyof typeof Icons) => import("campfire.js").RawHtml;
export declare function debounce(func: any, delay: number | undefined): (...args: any[]) => void;
