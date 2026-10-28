import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getContrastColor } from './colorContrast.ts';

test('getContrastColor', () => {
    assert.equal(getContrastColor(''), 'white');
    assert.equal(getContrastColor(' #3522dd'), 'white');
    assert.equal(getContrastColor('#ff0'), 'black');
    assert.equal(getContrastColor('#fde68a'), 'black');
    // Mid tones: YIQ calls them dark, but they are below 4.5:1 on white.
    assert.equal(getContrastColor('#3b82f6'), 'black');
    assert.equal(getContrastColor('#ea580c'), 'black');
    assert.equal(getContrastColor('#2563eb'), 'white');
    assert.equal(getContrastColor('#c2410c'), 'white');
    // Unparsed formats keep the default tab text color.
    assert.equal(getContrastColor('oklch(0.95 0.05 90)'), 'black');
    assert.equal(getContrastColor('rgb(10, 10, 10)'), 'black');
});
