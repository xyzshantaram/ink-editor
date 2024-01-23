import { InkEditor } from '../mod';
import { Icons } from '../utils/icons';
export interface ButtonArgs {
    editor: InkEditor;
    iconName: keyof typeof Icons;
    action: string;
    label: string;
    showLabel?: boolean;
    idx: number;
    description: string;
    toggle?: boolean;
    modal?: boolean;
    disabled?: boolean;
}
export type ButtonSpec = Omit<ButtonArgs, 'editor' | 'showLabel' | 'idx'>;
export declare const EditorButton: ({ modal, toggle, editor, iconName, action, description, label, showLabel, idx }: ButtonArgs) => HTMLElement[];
