import { Store } from "campfire.js";
export declare const PreviewController: (root: HTMLElement, parse: (contents: string) => string | Promise<string>) => {
    contents: Store<string>;
    visibility: Store<boolean>;
};
