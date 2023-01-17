/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './resources/views/**/*.blade.php',
        './resources/js/**/*.ts',
    ],
    theme: {
        extend: {
            colors: {
                highlight: 'var(--highlight, #ea580c)',
            },
            zIndex: {
                max: '999999',
            },
        },
    },
    plugins: [],
};
