import { defineConfig, Plugin } from 'vite';
import { createHash } from 'crypto';
import minifyHTML from 'rollup-plugin-minify-html-literals';
import tailwindcss from '@tailwindcss/postcss';
import dts from 'vite-plugin-dts';
import type { Plugin as PostcssPlugin } from 'postcss';

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

// Shadow roots ignore `@property`, so Tailwind's `--tw-*` initial values (emitted
// as a fallback for browsers without `@property`) must always apply.
function shadowRootProperties(): PostcssPlugin {
    return {
        postcssPlugin: 'shadow-root-properties',
        OnceExit(root) {
            root.walkAtRules('property', (rule) => {
                rule.remove();
            });
            root.walkAtRules('supports', (rule) => {
                if (rule.parent?.type === 'atrule' && (rule.parent as any).params === 'properties') {
                    rule.replaceWith(rule.nodes ?? []);
                }
            });
        },
    };
}

export default defineConfig(({ mode }) => ({
    plugins: [
        {
            enforce: 'post',
            apply: 'build',
            ...minifyHTML.default(),
        },
        mode === 'iife' ? libManifest() : dts({ exclude: ['resources/js/laravel-cookie-solution.ts'] }),
    ],
    build:
        mode === 'iife'
            ? {
                  outDir: 'resources/dist',
                  lib: {
                      entry: 'resources/js/laravel-cookie-solution.ts',
                      formats: ['iife'],
                      name: 'CookieSolution',
                      fileName: () => 'laravel-cookie-solution.js',
                  },
              }
            : {
                  outDir: 'dist',
                  lib: {
                      entry: 'resources/js/index.ts',
                      formats: ['es'],
                      fileName: () => 'index.js',
                  },
                  rolldownOptions: {
                      external: [/^lit($|\/)/, 'clsx'],
                  },
              },
    css: {
        postcss: {
            plugins: [tailwindcss(), shadowRootProperties()],
        },
    },
}));
