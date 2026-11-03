// Unit tests for palette.js (runs in Node).
//   npm run test:unit

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PALETTE, hexToOKLCH, toCss, toHex, blend, adjust, paletteColor } from '../palette.js';

const hexes = PALETTE.map(c => c.hex);

test('every palette color converts to OKLCH and CSS', () => {
    for (const hex of hexes) {
        const oklch = hexToOKLCH(hex);
        assert.ok(oklch, `${hex} -> OKLCH`);
        const css = toCss(oklch);
        assert.ok(css && !css.includes('NaN'), `${hex} -> ${css}`);
    }
});

test('invalid hex returns null instead of throwing', () => {
    assert.equal(hexToOKLCH('not-a-color'), null);
    assert.equal(hexToOKLCH(''), null);
});

test('paletteColor cycles through the palette for any n', () => {
    assert.equal(paletteColor(1), hexToOKLCH(PALETTE[0].hex));
    assert.equal(paletteColor(PALETTE.length), hexToOKLCH(PALETTE[PALETTE.length - 1].hex));
    assert.equal(paletteColor(PALETTE.length + 1), hexToOKLCH(PALETTE[0].hex));
    assert.equal(paletteColor(100), hexToOKLCH(PALETTE[(100 - 1) % PALETTE.length].hex));
});

test('every pair of palette colors blends to a valid color', () => {
    for (const a of hexes) {
        for (const b of hexes) {
            const mid = blend(hexToOKLCH(a), hexToOKLCH(b));
            assert.ok(mid && Number.isFinite(mid.l), `blend ${a} + ${b}`);
            const css = toCss(mid);
            assert.ok(css && !css.includes('NaN'), `blend ${a} + ${b} -> ${css}`);
        }
    }
});

test('blending is symmetric', () => {
    for (const a of hexes) {
        for (const b of hexes) {
            const ab = blend(hexToOKLCH(a), hexToOKLCH(b));
            const ba = blend(hexToOKLCH(b), hexToOKLCH(a));
            for (const ch of ['l', 'c', 'h']) {
                if (ab[ch] === undefined && ba[ch] === undefined) continue;
                // Hue can come back unnormalized (e.g. 402.99 vs 42.99), so compare mod 360
                const diff = ch === 'h'
                    ? Math.abs((((ab.h - ba.h) % 360) + 540) % 360 - 180)
                    : Math.abs(ab[ch] - ba[ch]);
                assert.ok(diff < 1e-9, `${a} + ${b}: ${ch} ${ab[ch]} vs ${ba[ch]}`);
            }
        }
    }
});

test('blending a color with itself returns the same color', () => {
    for (const hex of hexes) {
        const c = hexToOKLCH(hex);
        assert.equal(toCss(blend(c, c)), toCss(c), hex);
    }
});

test('black + white lands at mid lightness', () => {
    const mid = blend(hexToOKLCH('#000000'), hexToOKLCH('#FFFFFF'));
    assert.ok(Math.abs(mid.l - 0.5) < 0.01, `l = ${mid.l}`);
});

test('gray + a saturated color keeps the saturated hue', () => {
    const red = hexToOKLCH('#FF0000');
    const mid = blend(hexToOKLCH('#CCCCCC'), red);
    assert.ok(Number.isFinite(mid.h), `h = ${mid.h}`);
    assert.ok(Math.abs(mid.h - red.h) < 1, `h = ${mid.h}, red h = ${red.h}`);
});

test('blend rejects non-OKLCH input', () => {
    assert.equal(blend(null, hexToOKLCH('#000')), null);
    assert.equal(blend({ mode: 'rgb', r: 1, g: 0, b: 0 }, hexToOKLCH('#000')), null);
});

test('toHex round-trips every sRGB color exactly, including the pure primaries', () => {
    for (const hex of [...hexes, '#0000FF', '#00FFFF', '#FF00FF', '#00FF00', '#FFFFFF', '#000000', '#808080']) {
        assert.equal(toHex(hexToOKLCH(hex)), hex.toUpperCase());
    }
});

test('toHex keeps the hue of a blend outside sRGB by reducing its chroma', () => {
    const vivid = blend(hexToOKLCH('#FF0000'), hexToOKLCH('#00F900'));
    const hex = toHex(vivid);
    assert.match(hex, /^#[0-9A-F]{6}$/);
    const back = hexToOKLCH(hex);
    assert.ok(Math.abs(back.h - vivid.h) < 2, `hue ${back.h} vs ${vivid.h}`);
    assert.ok(back.c < vivid.c);
    assert.equal(toHex(null), null);
});

test('adjust rotates hue around the circle, scales chroma, and shifts lightness, within range', () => {
    const red = hexToOKLCH('#FF0000');
    const same = adjust(red);
    assert.deepEqual([same.l, same.c, same.h], [red.l, red.c, red.h]);
    assert.notEqual(same, red); // A copy

    const spun = adjust(red, { hue: 350 });
    assert.ok(Math.abs(spun.h - ((red.h + 350) % 360)) < 1e-9, `${spun.h}`);
    assert.ok(Math.abs(adjust(red, { hue: -400 }).h - ((red.h - 40 + 360) % 360)) < 1e-9);

    assert.equal(adjust(red, { saturation: -100 }).c, 0);                 // Grey
    assert.ok(Math.abs(adjust(red, { saturation: 100 }).c - red.c * 2) < 1e-12);
    assert.ok(Math.abs(adjust(red, { saturation: -50 }).c - red.c / 2) < 1e-12);

    assert.deepEqual([adjust(red, { lightness: 100 }).l, adjust(red, { lightness: 100 }).c], [1, 0]); // White, exactly
    assert.deepEqual([adjust(red, { lightness: -100 }).l, adjust(red, { lightness: -100 }).c], [0, 0]); // Black
    assert.equal(toHex(adjust(red, { lightness: 100 })), '#FFFFFF');
    assert.equal(toHex(adjust(hexToOKLCH('#00F900'), { lightness: 100 })), '#FFFFFF');
    assert.equal(toHex(adjust(red, { lightness: -100 })), '#000000');
    assert.ok(Math.abs(adjust(red, { lightness: -50 }).l - red.l / 2) < 1e-12);            // Halfway to black
    assert.ok(Math.abs(adjust(red, { lightness: 50 }).l - (red.l + (1 - red.l) / 2)) < 1e-12); // Halfway to white
    assert.ok(Math.abs(adjust(red, { lightness: 50 }).c - red.c / 2) < 1e-12);             // Chroma fades with it
    assert.equal(adjust(red, { lightness: 50 }).h, red.h);                                   // Hue never shifts
    const dark = hexToOKLCH('#2F0934');
    assert.ok(adjust(dark, { lightness: -50 }).l > 0, 'a dark color is not black until the end of the slider');
    assert.equal(adjust(dark, { lightness: -100 }).l, 0);

    assert.equal(adjust(null, { hue: 10 }), null);
    assert.ok(toCss(adjust(hexToOKLCH('#CCCCCC'), { hue: 90 }))); // Grey has no hue; still a color
});
