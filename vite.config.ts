import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
    plugins: [
        dts({
            insertTypesEntry: true,
            clearPureImport: false,
            exclude: [
                'resources/js/style.ts'
            ]
        }),
    ],
    build: {
        lib: {
            entry: 'resources/js/laravel-cookie-solution.ts',
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
