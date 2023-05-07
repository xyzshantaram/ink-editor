import * as flags from "https://deno.land/std@0.185.0/flags/mod.ts";
import * as fs from "https://deno.land/std@0.185.0/fs/mod.ts";
import * as path from "https://deno.land/std@0.185.0/path/mod.ts";
import { Language, minify } from "https://deno.land/x/minifier@v1.1.1/mod.ts";

const die = (message, code = 1) => {
    const log = code == 0 ? console.log : console.error;
    log(message);
    Deno.exit(code);
}

const args = flags.parse(Deno.args);

if (!args._.length) {
    console.error("Error: No input css dir supplied");
    Deno.exit(1);
}

const indir = args._[0];
const outdir = 'dist';

const info = await Deno.stat(indir);

if (info.isFile) {
    die('Error: Input css argument was not a dir.');
}

console.log("Minifying css...");
for await (const entry of fs.walk(indir)) {
    const newPath = path.resolve(outdir, entry.path);
    console.log(newPath);
    if (entry.isDirectory) {
        await Deno.mkdir(newPath, { recursive: true });
    }
    else {
        const minified = minify(Language.CSS, await Deno.readTextFile(entry.path));
        await Deno.writeTextFile(newPath, minified);
    }
}

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