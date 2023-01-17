import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        lib: {
            entry: 'resources/js/index.ts',
            formats: ['iife', 'es'],
            name: 'cookieSolution',
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
