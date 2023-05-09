import { defineConfig, Plugin } from 'vite';
import { createHash } from 'crypto';
import minifyHTML from 'rollup-plugin-minify-html-literals';

function libManifest(): Plugin {
    const manifest: Record<string, string> = {};

    return {
        name: 'lib-manifest',
        enforce: 'post',
        apply: 'build',
        generateBundle({ format }, bundle) {
            function getHash(text: Buffer | string): string {
                return createHash('sha256').update(text).digest('hex').substring(0, 8);
            }

            for (const file in bundle) {
                const chunk = bundle[file];

                if (chunk.type === 'chunk') {
                    manifest[chunk.fileName] = `${chunk.fileName}?id=${getHash(chunk.code)}`;
                }
            }

            this.emitFile({
                fileName: 'manifest.json',
                type: 'asset',
                source: JSON.stringify(manifest, null, 2),
            });
        },
    };
}

export default defineConfig({
    plugins: [
        {
            enforce: 'post',
            apply: 'build',
            ...minifyHTML(),
        },
        libManifest(),
    ],
    build: {
        outDir: 'resources/dist',
        lib: {
            entry: 'resources/js/laravel-cookie-solution.ts',
            formats: ['iife'],
            name: 'laravelCookieSolution',
            fileName: (format) => `laravel-cookie-solution.js`,
        },
    },
    css: {
        postcss: {
            plugins: [
                require('tailwindcss/nesting'),
                require('tailwindcss'),
            ],
        },
    },
});
