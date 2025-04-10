import esbuild from "esbuild"

await esbuild.build({
    entryPoints: ['ts-output/mod.js'],
    bundle: true,
    outfile: './dist/ink-editor.min.js',
    platform: 'browser',
    minify: true,
    format: 'esm',
    treeShaking: true,
    sourcemap: true
}).then(result => {
    console.log('Build result:', result)
}).catch(error => {
    console.log('Build error:', error)
})