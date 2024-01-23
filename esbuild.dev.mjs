import esbuild from "esbuild"

const ctx = await esbuild.context({
    entryPoints: ['src/mod.ts'],
    bundle: true,
    outfile: './dist/ink-editor.min.js',
    platform: 'browser',
    format: 'esm',
    treeShaking: true,
    sourcemap: true,
    minify: false
});

await ctx.watch();