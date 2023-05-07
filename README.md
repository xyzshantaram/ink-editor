# writr-editor

The editor component for one of my upcoming projects.

## Usage

```ts
import { debounce, init } from "./dist/bundle.js";

const parent = document.body;
const defaultContent = "# Editor Demo\n";
const prompts = ["Prompts are insertable snippets."];
const placeholder = "This string shows when the editor is empty.";
const autosave = debounce((text) => {
  console.log("saving...");
  localStorage.setItem("contents", text);
}, 1000);
const retrieve = () => localStorage.getItem("contents");
const done = (text) => console.log(`done clicked with content ${text}`);
const exit = () => console.log("received exit request");
const { editor, setVal, getVal } = await init(
  parent,
  defaultContent,
  prompts,
  placeholder,
  {
    autosave,
    retrieve,
    done,
    exit,
  },
);
```

You'll need the css files from `/styles` and the `NerdFont-stripped.ttf` file
from `fonts/`.

Also, you'll need `alert.css` from the [cf-alert](https://npmjs.com/cf-alert)
library.
