/**
 * Collection of icon components used in the editor
 */
declare const usedIcons: {
    Quote: import("lucide").IconNode;
    Bold: import("lucide").IconNode;
    Italic: import("lucide").IconNode;
    Strikethrough: import("lucide").IconNode;
    Link: import("lucide").IconNode;
    Heading: import("lucide").IconNode;
    Heading2: import("lucide").IconNode;
    Check: import("lucide").IconNode;
    Scissors: import("lucide").IconNode;
    X: import("lucide").IconNode;
    Eye: import("lucide").IconNode;
    RotateCcw: import("lucide").IconNode;
};
/**
 * Converts Lucide icon components to HTML strings
 */
export declare const Icons: Record<keyof typeof usedIcons, string>;
export {};
