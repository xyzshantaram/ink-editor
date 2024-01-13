import * as flags from "https://deno.land/std@0.185.0/flags/mod.ts";
import * as fs from "https://deno.land/std@0.185.0/fs/mod.ts";
import * as path from "https://deno.land/std@0.185.0/path/mod.ts";
import { minify } from 'npm:csso@5.0.5';

const die = (message, code = 1) => {
    const log = code === 0 ? console.log : console.error;
    log(message);
    Deno.exit(code);
};

const minifyCss = async (filePath) => {
    const content = await Deno.readTextFile(filePath);
    return minify(content).css;
};

const processCssFile = async (inputFile) => {
    const minified = await minifyCss(inputFile);
    return [minified];
};


const buildCss = async (inputDir) => {
    const builtCss = [];

    for await (const entry of fs.walk(inputDir)) {
        if (entry.isFile && path.extname(entry.path) === '.css') {
            const minified = await minifyCss(entry.path);
            builtCss.push(minified);
        }
    }

    return builtCss;
};

if (import.meta.main) {
    await Deno.mkdir('./dist', { recursive: true });

    const args = flags.parse(Deno.args);

    if (args._.length < 2) {
        die("Error: No input CSS directory supplied");
    }

    const input = args._[0];
    const outfile = args._[1];

    const info = await Deno.stat(input);

    if (!info.isDirectory) {
        die('Error: Input CSS argument should be a directory.');
    }

    console.log("Minifying CSS...");
    const builtCss = info.isDirectory ? await buildCss(input) : await processCssFile(input);
    await Deno.writeTextFile(outfile, builtCss.join('\n'));

    console.log("Copying font...");
    await Deno.copyFile('./fonts/NerdFont-stripped.ttf', 'dist/NerdFont-stripped.ttf');

    const run = async (exe, ...args) => {
        const cmd = new Deno.Command(exe, { args });
        const output = await cmd.output();
        const decoder = new TextDecoder();
        return {
            code: output.code,
            signal: output.signal,
            stderr: decoder.decode(output.stderr),
            stdout: decoder.decode(output.stdout)
        }
    }

    if (args.npm) {
        console.log("Running npm build step...");
        const { code, stderr } = await run('npm', 'run', 'build-js');

        if (code === 0) {
            console.log('npm build complete.');
        } else {
            die(`npm build failed with code ${code}: ${stderr}`);
        }

        for await (const entry of fs.expandGlob('./ts-output/**')) {
            if (entry.name === 'ts-output') continue;
            const replaced = entry.path.replace('ts-output', 'dist');
            if (entry.isDirectory) {
                await Deno.mkdir(replaced, { recursive: true });
            }
            else {
                await Deno.rename(entry.path, replaced);
            }
        }
    }
}