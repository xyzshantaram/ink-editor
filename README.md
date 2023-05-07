# writr-editor

The editor component for one of my upcoming projects.

## Usage

```ts
import { debounce, init } from "./bundle.js";

const parent = document.body;
const defaultContent = "# Editor Demo\n";
const prompts = ["Prompts are insertable snippets."];
const placeholder = "This string shows when the editor is empty.";
const autosave = debounce((text) => {
  localStorage.setItem("bio-contents", text);
}, 1000);
const { editor, setVal, getVal } = await init(
  parent,
  defaultContent,
  prompts,
  placeholder,
  autosave,
);
```

You'll need the css files from `/styles` and the `NerdFont-stripped.ttf` file
from `fonts/`.
