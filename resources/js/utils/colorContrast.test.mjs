import { test } from 'node:test';
import assert from 'node:assert/strict';
import { getContrastColor } from './colorContrast.ts';

test('getContrastColor', () => {
    assert.equal(getContrastColor(''), 'white');
    assert.equal(getContrastColor(' #3522dd'), 'white');
    assert.equal(getContrastColor('#ff0'), 'black');
    assert.equal(getContrastColor('#fde68a'), 'black');
    // Unparsed formats keep the default tab text color.
    assert.equal(getContrastColor('oklch(0.95 0.05 90)'), 'black');
    assert.equal(getContrastColor('rgb(10, 10, 10)'), 'black');
});
