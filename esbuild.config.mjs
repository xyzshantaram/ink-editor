import esbuild from "esbuild"
import { nodeExternalsPlugin } from 'esbuild-node-externals'

await esbuild.build({
    entryPoints: ['src/mod.ts'],
    bundle: true,
    outfile: './dist/ink-editor.min.js',
    platform: 'browser',
    minify: true,
    format: 'esm',
    treeShaking: true,
    sourcemap: true
}).then(result => {
    console.info('Build result:', result)
}).catch(error => {
    console.info('Build error:', error)
})

await esbuild.build({
    entryPoints: ['src/mod.ts'],
    outdir: './dist/',
    bundle: true,
    minify: false,
    platform: 'node',
    sourcemap: true,
    target: ['es2020'],
    format: 'esm',
    plugins: [nodeExternalsPlugin()],
    outExtension: { '.js': '.js' }
}).then(result => {
    console.info('Build result:', result)
}).catch(error => {
    console.info('Build error:', error)
})