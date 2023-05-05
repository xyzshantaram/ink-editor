import esbuild from "esbuild"

const context = await esbuild.context({
    entryPoints: ['src/main.ts'],
    bundle: true,
    outfile: './bundle.js',
    platform: 'browser',
    minify: true,
    treeShaking: true
})

// Manually do an incremental build
const result = await context.rebuild()

// Enable watch mode
await context.watch()