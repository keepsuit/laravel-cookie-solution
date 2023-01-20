import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        manifest: true,
        minify: 'esbuild',
        target: 'modules',
        assetsDir: '',
        rollupOptions: {
            input: 'resources/js/laravel-cookie-solution.ts',
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
