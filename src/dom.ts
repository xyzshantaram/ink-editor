export const WRITR_DOM = `\
<div id="writr-ctrl-buttons" class='mobile-hidden'>
    <button class='button' id="writr-ctrl-prompt"><span class=icon>󰍦</span> Insert prompt</button>
    <button class="button" id="writr-ctrl-bold"><span class="icon"></span> Bold</button>
    <button class="button" id="writr-ctrl-italic"><span class="icon"></span> Italic</button>
    <button class="button" id="writr-ctrl-st"><span class="icon"></span> Strikethrough</button>
    <button class='button' id="writr-ctrl-quote"><span class="icon"></span> Quote</button>
    <button class="button" id="writr-ctrl-a"><span class="icon"></span> Link</button>
    <button class="button" id="writr-ctrl-h1"><span class="icon">󰗴</span> Title</button>
    <button class="button" id="writr-ctrl-h2"><span class="icon">󰍦</span> Section</button>
    <button class="button" id="writr-ctrl-reset"><span class="icon">󰑓</span> Load default</button>
    <button class="button" id="writr-ctrl-preview"><span class="icon">󰈈</span> Preview</button>
    <button class="button" id="writr-ctrl-exit"><span class="icon"></span> Exit</button>
    <button class="button" id="writr-ctrl-done"><span class="icon"></span> Save</button>
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
    <div id='controls-button-wrapper'>
        <button id=controls-toggle-button class='button icon'></button>
    </div>
</div>
`