import esbuild from "esbuild"

await esbuild.build({
    entryPoints: ['src/main.ts'],
    bundle: true,
    outfile: './dist/writr-editor.js',
    platform: 'browser',
    minify: false,
    format: 'esm',
    treeShaking: true
}).then(result => {
    console.log('Build result:', result)
}).catch(error => {
    console.log('Build error:', error)
})