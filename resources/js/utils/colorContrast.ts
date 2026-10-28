export function getContrastColor(color: string): 'black' | 'white' {
    let hexcolor = color.trim().replace('#', '');

    // Unset: the default highlight is dark.
    if (hexcolor === '') {
        return 'white';
    }

    // Only hex colors are parsed: with other formats the selected tab keeps the default text color.
    if (!/^([0-9a-f]{3}){1,2}$/i.test(hexcolor)) {
        return 'black';
    }

    // If a three-character hexcode, make six-character
    if (hexcolor.length === 3) {
        hexcolor = hexcolor
            .split('')
            .map((hex) => hex + hex)
            .join('');
    }

    const [r, g, b] = [0, 2, 4].map((i) => {
        const channel = parseInt(hexcolor.substring(i, i + 2), 16) / 255;

        return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });

    // WCAG luminance, same threshold as `--color-on-highlight`: below it the color reaches 4.5:1 on white.
    return 0.2126 * r + 0.7152 * g + 0.0722 * b < 0.18 ? 'white' : 'black';
}
