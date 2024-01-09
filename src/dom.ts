import cf from "campfire.js";

const btns: Record<string, {
    icon: string,
    label: string
}> = {
    "writr-ctrl-prompt": {
        icon: "󰍦",
        label: "Insert a prompt",
    },
    "writr-ctrl-bold": {
        icon: "",
        label: "Bold"
    },
    "writr-ctrl-italic": {
        icon: "",
        label: "Italic"
    },
    "writr-ctrl-st": {
        icon: "",
        label: "Strikethrough"
    },
    "writr-ctrl-quote": {
        icon: "",
        label: "Quote"
    },
    "writr-ctrl-a": {
        icon: "",
        label: "Link"
    },
    "writr-ctrl-h1": {
        icon: "󰗴",
        label: "Title"
    },
    "writr-ctrl-h2": {
        icon: "󰍦",
        label: "Section"
    },
    "writr-ctrl-reset": {
        icon: "󰑓",
        label: "Default"
    },
    "writr-ctrl-preview": {
        icon: "󰈈",
        label: "Preview"
    },
    "writr-ctrl-exit": {
        icon: "",
        label: "Exit"
    },
    "writr-ctrl-done": {
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
                class="button"
            >
                <span class=icon>${v.icon}</span> 
                ${labels ? v.label : ''}
            </button>`
        ).join('\n');

export const WRITR_DOM = ({
    buttonLabels,
    verticalMode
}) => {
    return cf.html`\
<div id="writr-ctrl-buttons" class='mobile-hidden${verticalMode ? ' vertical' : ''}'>
    ${cf.r(genBtns(buttonLabels))}
    <button class="controls-toggle-button button"><span class=icon></span> Hide controls</button>
</div>

<div id="writr-bio"></div>

<div id="writr-prompts">          
    <div id="writr-prompt-heading">
        <h3>Select a prompt</h3>
        <button class="icon button" id="writr-ctrl-cancel-prompt"></button>
    </div>
    <div id="writr-prompts-list">
        <ul></ul>
    </div>
</div>
<div id=writr-editor-wrapper>
    <div id="writr-editor"></div>
    ${verticalMode ? '' : cf.r(cf.html`
    <div id='controls-button-wrapper'>
        <button class='controls-toggle-button button icon'></button>
    </div>
    `)}
</div>
`
}