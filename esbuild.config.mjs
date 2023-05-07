import esbuild from "esbuild"

await esbuild.build({
    entryPoints: ['src/main.ts'],
    bundle: true,
    outfile: './dist/bundle.js',
    platform: 'browser',
    minify: true,
    treeShaking: true
}).then(result => {
    console.log('Build result:', result)
}).catch(error => {
    console.log('Build error:', error)
})