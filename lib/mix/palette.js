// palette.js
//
// Everything about color. The palette is a placeholder for colors that will
// come from the API. Colors are stored and blended in OKLCH (a perceptual
// color space, so the midpoint of two colors looks like the midpoint) and
// drawn as Display P3 CSS colors. Uses Culori (https://culorijs.org).

import * as culori from 'culori';

/** Placeholder for colors from the API, in palette order. */
export const PALETTE = [
    { hex: '#FFBAED', name: 'N/A' },
    { hex: '#2F0934', name: 'N/A' },
    { hex: '#FFFF00', name: 'N/A' },
    { hex: '#00f900', name: 'N/A' },
    { hex: '#FF0000', name: 'N/A' },
    { hex: '#000000', name: 'N/A' },
    { hex: '#CCCCCC', name: 'N/A' }
];

const toOklch = culori.converter('oklch');
const toP3 = culori.converter('p3');
const oklchCache = new Map();

/**
 * Converts a hex color to OKLCH.
 * @param {string} hex - e.g. '#FF5733'
 * @returns {object|null} Culori OKLCH color, or null if the hex is invalid.
 */
export function hexToOKLCH(hex) {
    if (oklchCache.has(hex)) return oklchCache.get(hex);
    const parsed = culori.parse(hex);
    const oklch = parsed ? toOklch(parsed) : null;
    if (oklch) oklchCache.set(hex, oklch);
    return oklch;
}

/**
 * Formats an OKLCH color as a Display P3 CSS color. Colors outside P3 are
 * left for the browser to gamut-map.
 * @returns {string|null}
 */
export function toCss(oklch) {
    if (oklch?.mode !== 'oklch') return null;
    return culori.formatCss(toP3(oklch));
}

/**
 * The nth palette color (1-based), cycling so any n works.
 * @returns {object} OKLCH color.
 */
export function paletteColor(n) {
    const i = (((n - 1) % PALETTE.length) + PALETTE.length) % PALETTE.length;
    return hexToOKLCH(PALETTE[i].hex);
}

/**
 * The perceptual midpoint of two OKLCH colors, taking the shorter way around
 * the hue circle.
 * @returns {object|null} OKLCH color, or null for invalid input.
 */
export function blend(a, b) {
    if (a?.mode !== 'oklch' || b?.mode !== 'oklch') return null;
    const mid = culori.interpolate([a, b], 'oklch', {
        h: { use: culori.interpolatorLinear, fixup: culori.fixupHueShorter }
    })(0.5);
    return mid?.mode === 'oklch' ? mid : null;
}

const toRgb = culori.converter('rgb');

/**
 * Formats an OKLCH color as an sRGB hex string, for export (the site's
 * palettes are hex). A color outside sRGB (some blends of vivid colors) has
 * its chroma reduced until it fits, so the hue and lightness are kept. Keep
 * the OKLCH for anything that comes back to the canvas.
 * @returns {string|null} e.g. '#FF5733'
 */
export function toHex(oklch) {
    if (oklch?.mode !== 'oklch') return null;
    const rgb = toRgb(oklch);
    // Converting back and forth leaves channels a hair outside 0..1; that's
    // rounding, not an out-of-gamut color (clampChroma would desaturate it)
    const inGamut = ['r', 'g', 'b'].every(k => rgb[k] > -0.002 && rgb[k] < 1.002);
    return culori.formatHex(inGamut ? rgb : toRgb(culori.clampChroma(oklch, 'oklch'))).toUpperCase();
}

/**
 * Shifts a color by a hue rotation, a saturation change, and a lightness
 * change, all in OKLCH, so the same slider move looks the same on every color:
 *   - hue: degrees around the hue circle (-180..180)
 *   - saturation: -100..100; -100 removes all chroma (grey), +100 doubles it
 *     (what can't be shown is gamut-mapped when drawn)
 *   - lightness: -100..100, moving the color proportionally toward black
 *     (-100) or white (+100), so -50 is halfway to black whatever the color
 *     started at, and the whole slider is useful for every color. Chroma
 *     fades on the way (the gamut narrows to a point at black and white), so
 *     the ends really are black and white, and hues don't shift from clipping.
 * @returns {object|null} A new OKLCH color (the input isn't changed).
 */
export function adjust(oklch, { hue = 0, saturation = 0, lightness = 0 } = {}) {
    if (oklch?.mode !== 'oklch') return null;
    const h = hue ? (((oklch.h ?? 0) + hue) % 360 + 360) % 360 : (oklch.h ?? 0); // No rotation: untouched (no float noise)
    const t = Math.min(1, Math.max(-1, lightness / 100));
    const l = t < 0 ? oklch.l * (1 + t) : oklch.l + (1 - oklch.l) * t;
    const c = Math.max(0, oklch.c * (1 + saturation / 100)) * (1 - Math.abs(t));
    return { ...oklch, l, c, h };
}
