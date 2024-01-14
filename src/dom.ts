import cf from "campfire.js";

const btns: Record<string, {
    icon: string,
    label: string
}> = {
    "ink-ctrl-prompt": {
        icon: "󰍦",
        label: "Insert a prompt",
    },
    "ink-ctrl-bold": {
        icon: "",
        label: "Bold"
    },
    "ink-ctrl-italic": {
        icon: "",
        label: "Italic"
    },
    "ink-ctrl-st": {
        icon: "",
        label: "Strikethrough"
    },
    "ink-ctrl-quote": {
        icon: "",
        label: "Quote"
    },
    "ink-ctrl-a": {
        icon: "",
        label: "Link"
    },
    "ink-ctrl-h1": {
        icon: "󰗴",
        label: "Title"
    },
    "ink-ctrl-h2": {
        icon: "󰍦",
        label: "Section"
    },
    "ink-ctrl-reset": {
        icon: "󰑓",
        label: "Default"
    },
    "ink-ctrl-preview": {
        icon: "󰈈",
        label: "Preview"
    },
    "ink-ctrl-exit": {
        icon: "",
        label: "Exit"
    },
    "ink-ctrl-done": {
        icon: "",
        label: "Save"
    }
}

const genBtns = (labels: boolean) =>
    Object.entries(btns)
        .map(([k, v]) =>
            cf.html`
            <button 
                id="${k}"
                title="${v.label}"
                aria-label="${v.label}"
                class="ink-button"
            >
                <span class=icon>${v.icon}</span> 
                ${labels ? v.label : ''}
            </button>`
        ).join('\n');

export const INK_DOM = ({
    buttonLabels,
    verticalMode
}) => {
    return cf.html`\
<div id="ink-ctrl-buttons" class='mobile-hidden${verticalMode ? ' vertical' : ''}'>
    ${cf.r(genBtns(buttonLabels))}
    <button class="controls-toggle-button ink-button"><span class=icon></span> Hide controls</button>
</div>

<div id="ink-preview"></div>

<div id="ink-prompts">          
    <div id="ink-prompt-heading">
        <h3>Select a prompt</h3>
        <button class="icon ink-button" id="ink-ctrl-cancel-prompt"></button>
    </div>
    <div id="ink-prompts-list">
        <ul></ul>
    </div>
</div>
<div id=ink-editor-wrapper>
    <div id="ink-editor"></div>
    ${verticalMode ? '' : cf.r(cf.html`
    <div id='controls-button-wrapper'>
        <button class='controls-toggle-button ink-button icon'></button>
    </div>
    `)}
</div>
`
}