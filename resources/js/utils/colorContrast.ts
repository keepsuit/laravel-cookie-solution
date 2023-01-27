export function getContrastColor(hexcolor: string): 'black' | 'white' {
    hexcolor = hexcolor.trim().replace('#', '');

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
