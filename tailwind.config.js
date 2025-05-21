/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './resources/views/**/*.blade.php',
        './resources/js/**/*.ts',
    ],
    theme: {
        extend: {
            colors: {
                highlight: 'var(--cs--color-highlight, #ea580c)',
            },
            inset: {
                'toggle-bottom': 'var(--cs--toggle-position-bottom, 1rem)',
                'toggle-x': 'var(--cs--toggle-position-x, 1rem)',
            },
            zIndex: {
                toggle: 'var(--cs--toggle-z-index, 9999)',
                max: '999999',
            },
            typography: ({ theme }) => ({
                DEFAULT: {
                    css: {
                        maxWidth: '100%',

                        h2: {
                            fontSize: '1.25em',
                        },
                        h3: {
                            fontSize: '1.1em',
                        }
                    },
                },
            }),
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
};
