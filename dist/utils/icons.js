import { Quote, Bold, Italic, Strikethrough, Link, Heading, Heading2, Check, Scissors, X, Eye, createElement, RotateCcw } from 'lucide';
const usedIcons = {
    Quote,
    Bold,
    Italic,
    Strikethrough,
    Link,
    Heading,
    Heading2,
    Check,
    Scissors,
    X,
    Eye,
    RotateCcw
};
export const Icons = Object.fromEntries(Object
    .entries(usedIcons)
    .map(([k, v]) => {
    const elt = createElement(v);
    elt.classList.add('lucide-icon');
    return [k, elt.outerHTML];
}));
