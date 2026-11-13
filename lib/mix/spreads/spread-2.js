// Spread 2: two pairs get the same gap.
import { huedByAngle, gapsAround, withHues, wrap } from './shared.js';

/**
 * "Spread 2", for palettes of two pairs: four colors where, going around the
 * hue circle (OKLCH), the two smallest gaps aren't next to each other (e.g.
 * blue and purple, then orange and yellow). Both pairs get the same gap, the
 * average of the two. The two colors on either side of the largest gap stay
 * where they are; their partners move, so the gap between the pairs on the
 * other side doesn't change. Only the hue changes; grays are left out.
 * @param {Array<{id: any, oklch: object}>} colors
 * @returns {Array<{id: any, oklch: object}>|null} The same colors, in the same
 *   order, with new hues; or null if the palette isn't two pairs.
 */
export function matchPairs(colors) {
    const hued = huedByAngle(colors);
    if (hued.length !== 4) return null;
    const h = hued.map(({ oklch }) => oklch.h);
    const gaps = gapsAround(h); // From color i to the next

    // The pairs: the two smallest gaps, on opposite sides (gaps a and a + 2)
    const [first, second] = [0, 1, 2, 3].sort((x, y) => gaps[x] - gaps[y]);
    if ((first + 2) % 4 !== second) return null;
    const a = Math.min(first, second); // Pairs: colors a, a+1 and a+2, a+3
    const pair = (gaps[a] + gaps[a + 2]) / 2;

    const next = [...h];
    if (gaps[a + 1] >= gaps[(a + 3) % 4]) {
        // The largest gap is between the pairs at a+1 -> a+2: those two stay
        next[a] = wrap(h[a + 1] - pair);
        next[(a + 3) % 4] = wrap(h[a + 2] + pair);
    } else {
        // The largest gap is at a+3 -> a: those two stay
        next[a + 1] = wrap(h[a] + pair);
        next[a + 2] = wrap(h[(a + 3) % 4] - pair);
    }
    return withHues(colors, new Map(hued.map(({ id }, i) => [id, next[i]])));
}
