# ink-editor

The editor component for one of my upcoming projects.

## Usage

```ts
import { debounce, init } from "./dist/ink-editor.js";

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

You'll need the `NerdFont-stripped.ttf` file from `fonts/` along with
`dist/writr-editor.css`.

Also, you'll need `alert.css` from the [cf-alert](https://npmjs.com/cf-alert)
library.

## Building

```bash
npm install # install deps
npm run build-all # minifies css (will need deno installed) and runs npm build
```

## LICENSE

```md
The MIT License (MIT)

Copyright © 2023 Siddharth Singh

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the “Software”), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

- The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```

A patched Nerd Font is used for icons required for the editor. The license for
that font can be found [here](./fonts/LICENSE).
