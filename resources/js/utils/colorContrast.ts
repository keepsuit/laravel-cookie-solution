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

    // Convert to RGB value
    let r = parseInt(hexcolor.substring(0, 2), 16);
    let g = parseInt(hexcolor.substring(2, 4), 16);
    let b = parseInt(hexcolor.substring(4, 6), 16);

    // Get YIQ ratio
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;

    return yiq >= 128 ? 'black' : 'white';
}
