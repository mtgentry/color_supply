// Spread 1: even out similar gaps, keeping the palette's structure.
import { huedByAngle, gapsAround, withHues, placeWithLeastMovement } from './shared.js';

/**
 * "Spread 1": evens out the gaps between neighboring hues (OKLCH) while
 * keeping the palette's structure. Going around the hue circle, the gaps
 * between neighbors are grouped by size (a jump of more than half again
 * starts a new group), and each group's gaps become their average. So a
 * tight cluster stays a tight cluster, with its colors spaced equally, and
 * the colors across from it are spaced equally from it: red, orange and
 * yellow 32 and 34 degrees apart become 33 and 33, and a blue across from
 * them ends up opposite the orange. When the gaps are all about the same
 * size, the colors end up 360/n degrees apart.
 *
 * Colors keep their order around the circle, and the result is turned to
 * wherever the colors move least. Only the hue changes; grays stay as they are.
 * @param {Array<{id: any, oklch: object}>} colors
 * @returns {Array<{id: any, oklch: object}>} The same colors, in the same order, with new hues.
 */
export function spreadGaps(colors) {
    const hued = huedByAngle(colors);
    const n = hued.length;
    if (n < 2) return withHues(colors, new Map());

    // The gap after each color, to the next one around the circle
    const gaps = gapsAround(hued.map(({ oklch }) => oklch.h));
    if (n === 2) gaps.fill(180); // Two colors: opposite each other

    // Group similar gaps: sorted by size, a new group starts at a jump of more than half again (and 10 degrees)
    const bySize = gaps.map((g, i) => i).sort((a, b) => gaps[a] - gaps[b]);
    const group = new Array(n);
    let g = 0;
    bySize.forEach((gi, k) => {
        const prev = k ? gaps[bySize[k - 1]] : null;
        if (prev !== null && gaps[gi] > prev * 1.5 && gaps[gi] - prev > 10) g++;
        group[gi] = g;
    });
    const average = new Map();
    for (let k = 0; k <= g; k++) {
        const members = gaps.filter((_, i) => group[i] === k);
        average.set(k, members.reduce((a, b) => a + b, 0) / members.length);
    }
    const even = gaps.map((_, i) => average.get(group[i]));

    // Each color's place with the first at 0, turned to where they move least
    const place = [0];
    for (let i = 1; i < n; i++) place.push(place[i - 1] + even[i - 1]);
    return withHues(colors, placeWithLeastMovement(hued, place));
}
