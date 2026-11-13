// Helpers the hue spreads share (each spread is its own file in this folder;
// index.js lists them).

/** Below this chroma a color reads as gray: it has no hue to move. */
export const GRAY_CHROMA = 0.02;

/** A hue in 0..360. */
export const wrap = (deg) => ((deg % 360) + 360) % 360;

/** Degrees between two hues, the short way round: 0..180. */
export const distance = (a, b) => Math.abs(((a - b + 540) % 360) - 180);

/** The colors that have a hue (not grays), sorted by hue: the order around the circle. */
export const huedByAngle = (colors) => colors
    .filter(({ oklch }) => oklch?.mode === 'oklch' && oklch.c >= GRAY_CHROMA && oklch.h !== undefined)
    .sort((a, b) => (a.oklch.h - b.oklch.h) || 0);

/** The gap from each of `hues` (sorted) to the next one around the circle. */
export const gapsAround = (hues) => hues.map((h, i) => wrap(hues[(i + 1) % hues.length] - h));

/**
 * The colors with new hues from `target` (id -> hue); colors not in it are
 * copied unchanged. Keeps the input order.
 */
export const withHues = (colors, target) => colors.map(({ id, oklch }) => ({
    id,
    oklch: target.has(id) ? { ...oklch, h: target.get(id) } : { ...oklch }
}));

/**
 * Places colors (sorted by hue) at fixed positions relative to each other,
 * `place[i]` degrees from the first, turned as a whole to where the colors
 * move least (the least sum of squared degrees).
 * @returns {Map} id -> new hue
 */
export function placeWithLeastMovement(hued, place) {
    // The circular mean of each color's offset from its place, to start from
    let x = 0, y = 0;
    hued.forEach(({ oklch }, i) => {
        const a = (oklch.h - place[i]) * Math.PI / 180;
        x += Math.cos(a);
        y += Math.sin(a);
    });
    const mean = Math.hypot(x, y) < 1e-9 ? hued[0].oklch.h : Math.atan2(y, x) * 180 / Math.PI;
    // Then the plain average of the offsets measured from it: the least movement in degrees
    const around = (d) => ((d - mean + 540) % 360) - 180;
    const turn = mean + hued.reduce((sum, { oklch }, i) => sum + around(oklch.h - place[i]), 0) / hued.length;
    return new Map(hued.map(({ id }, i) => [id, wrap(turn + place[i])]));
}
