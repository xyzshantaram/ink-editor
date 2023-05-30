window.addEventListener('DOMContentLoaded', () => {
    const tabs = Array.from(document.querySelectorAll('.writr-ctrl-tab-button') as NodeListOf<HTMLElement>);
    const tabBodies = Array.from(document.querySelectorAll('.writr-ctrl-tab-content') as NodeListOf<HTMLElement>);

    tabs.forEach(tab => {
        tab.onclick = () => {
            tabs.forEach(t => t.classList.remove('selected'));
            tab.classList.add('selected');
            tabBodies.forEach(body => body.style.display = 'none');

            const name = tab.getAttribute('data-tabname');
            const content = document.querySelector(`div.writr-ctrl-tab-content[data-tabname="${name}"]`) as HTMLElement;
            if (content) {
                content.style.display = 'block';
            }
        }
    })

    tabs[0].click();
})

export const WRITR_DOM = `\
<div id="writr-ctrl-buttons">
    <button class='icon button writr-ctrl-tab-button' data-tabname='editor-ctrl-formatting'>󰬴</button>
    <button class='icon button writr-ctrl-tab-button' data-tabname='writr-ctrl-links'></button>
    <button class='icon button writr-ctrl-tab-button' data-tabname='headings'></button>
    <button class='icon button writr-ctrl-tab-button' data-tabname='editor-exit-menu'></button>
    <button class='icon button' id="writr-ctrl-prompt">󰍦</button>
</div>
<div class='writr-ctrl-tab-content-wrapper'>
    <div class='writr-ctrl-tab-content' data-tabname='editor-ctrl-formatting'>
        <button class="button" id="writr-ctrl-bold"><span class="icon"></span> Bold</button>
        <button class="button" id="writr-ctrl-italic"><span class="icon"></span> Italic</button>
        <button class="button" id="writr-ctrl-st"><span class="icon"></span> Strikethrough</button>
        <button class='button' id="writr-ctrl-quote"><span class="icon"></span> Quote</button>
    </div>
    <div class='writr-ctrl-tab-content' data-tabname='writr-ctrl-links'>
        <button class="button" id="writr-ctrl-a"><span class="icon"></span> Link</button>
        <button class="button" id="writr-ctrl-img"><span class="icon"></span> Image</button>
    </div>
    <div class='writr-ctrl-tab-content' data-tabname='headings'>
        <button class="button" id="writr-ctrl-h1"><span class="icon">󰗴</span> Title</button>
        <button class="button" id="writr-ctrl-h2"><span class="icon">󰍦</span> Section</button>
    </div>
    <div class='writr-ctrl-tab-content' data-tabname='editor-exit-menu'>
        <button class="button" id="writr-ctrl-preview"><span class="icon">󰈈</span> Preview</button>
        <button class="button" id="writr-ctrl-reset"><span class="icon">󰑓</span> Load default</button>
        <button class="button" id="writr-ctrl-exit"><span class="icon"></span> Exit</button>
        <button class="button" id="writr-ctrl-done"><span class="icon"></span> Save</button>
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
`