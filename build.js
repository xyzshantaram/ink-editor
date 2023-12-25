import * as flags from "https://deno.land/std@0.185.0/flags/mod.ts";
import * as fs from "https://deno.land/std@0.185.0/fs/mod.ts";
import * as path from "https://deno.land/std@0.185.0/path/mod.ts";
import { minify } from 'npm:csso@5.0.5';

const die = (message, code = 1) => {
    const log = code == 0 ? console.log : console.error;
    log(message);
    Deno.exit(code);
}

const args = flags.parse(Deno.args);

if (args._.length < 2) {
    console.error("Error: No input css dir supplied");
    Deno.exit(1);
}
const input = args._[0];
const outfile = args._[1];

const info = await Deno.stat(input);

if (info.isFile) {
    die('Error: Input css argument was not a dir.');
}

console.log("Minifying css...");
const builtCss = [];
if (info.isDirectory) {
    for await (const entry of fs.walk(input)) {
        if (entry.isFile && path.extname(entry.path) === '.css') {
            const minified = minify(await Deno.readTextFile(entry.path)).css;
            builtCss.push(minified);
        }
    }
}
else if (info.isFile) {
    builtCss.push(minify(await Deno.readTextFile(input)).css);
}
await Deno.writeTextFile(outfile, builtCss.join('\n'));

if (args.npm) {
    console.log("Running npm build step...");
    const cmd = new Deno.Command('npm', {
        args: ['run', 'build']
    });
    const op = await cmd.output();
    if (op.code === 0) console.log('npm build complete.');
    else {
        die(`npm build failed with code ${op.code}: ${op.stderr}`);
    }
}