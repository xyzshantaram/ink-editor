export const WRITR_DOM = `\
<div id="writr-editor-root">
    <div id="writr-ctrl-buttons">
        <div class="writr-ctrl-dropdown">
            <span class='icon button'>󰬴</span>
            <div class="writr-ctrl-dropdown-menu">
                <span class="writr-dropdown-label">Formatting</span>
                <ul>
                    <li>
                        <button class="button" id="writr-ctrl-bold"><span class="icon"></span> Bold</button>
                    </li>
                    <li>
                        <button class="button" id="writr-ctrl-italic"><span class="icon"></span> Italic</button>
                    </li>
                    <li>
                        <button class="button" id="writr-ctrl-st"><span class="icon"></span> Strikethrough</button>
                    </li>
                    <li>
                        <button class='button' id="writr-ctrl-quote"><span class="icon"></span> Quote</button>
                    </li>
                </ul>
            </div>
        </div>

        <div class="writr-ctrl-dropdown">
            <span class='icon button'></span>
            <div class="writr-ctrl-dropdown-menu">
                <span class="writr-dropdown-label">Insert link</span>
                <ul>
                    <li>
                        <button class="button" id="writr-ctrl-a"><span class="icon"></span> Link</button>
                    </li>
                    <li>
                        <button class="button" id="writr-ctrl-img"><span class="icon"></span> Image</button>
                    </li>
                </ul>
            </div>
        </div>

        <div class="writr-ctrl-dropdown">
            <span class='icon button'></span>
            <div class="writr-ctrl-dropdown-menu">
                <span class="writr-dropdown-label">Insert heading</span>
                <ul>
                    <li>
                        <button class="button" id="writr-ctrl-h1"><span class="icon">󰗴</span> Title</button>
                    </li>
                    <li>
                        <button class="button" id="writr-ctrl-h2"><span class="icon">󰍦</span> Section</button>
                    </li>
                    </li>
                </ul>
            </div>
        </div>

        <button class='icon button' id="writr-ctrl-prompt">󰍦</button>

        <div class="writr-ctrl-dropdown" id="writr-exit-menu">
            <span class='icon button'></span>
            <div class="writr-ctrl-dropdown-menu">
                <span class="writr-dropdown-label">Options</span>
                <ul>
                    <li>
                        <button class="button" id="writr-ctrl-preview"><span class="icon">󰈈</span> Preview</button>
                    </li>
                    <li>
                        <button class="button" id="writr-ctrl-reset"><span class="icon">󰑓</span> Load default</button>
                    </li>
                    <li>
                        <button class="button" id="writr-ctrl-exit"><span class="icon"></span> Exit</button>
                    </li>

                    <li>
                        <button class="button" id="writr-ctrl-done"><span class="icon"></span> Save</button>
                    </li>
                </ul>
            </div>
        </div>
        
    </div>
    <div id="writr-preview"></div>
    <div id="writr-prompts">          
        <div id="writr-prompt-heading">
            <h3>Select a prompt</h3>
            <button class="icon button" id="writr-ctrl-cancel-prompt"></button>
        </div>
        <div id="writr-prompts-list">
            <ul></ul>
        </div>
    </div>
    <div id="writr-editor"></div>
</div>
`