// Spread 4: each gap double the last.
import { huedByAngle, gapsAround, withHues, placeWithLeastMovement } from './shared.js';

/** The chain of doubling gaps may span at most this much of the circle. */
const MAX_SPAN = 330;

/**
 * "Spread 4: doubling", for three or more colors: going around the hue circle
 * (OKLCH), each gap between neighbors is twice the one before it: X, 2X, 4X...
 * (pink to purple X, purple to dark purple 2X, and so on). The chain starts on
 * one side of the largest gap, which closes the circle and stays the biggest
 * opening; it runs from the end whose gap is smaller, so the palette's tight
 * end stays tight. X is fitted to where the colors are now (least squares),
 * and the result is turned to wherever the colors move least. Only the hue
 * changes; grays are left out.
 * @param {Array<{id: any, oklch: object}>} colors
 * @returns {Array<{id: any, oklch: object}>|null} The same colors, in the same
 *   order, with new hues; or null with fewer than three hues.
 */
export function doubling(colors) {
    const hued = huedByAngle(colors);
    const n = hued.length;
    if (n < 3) return null;
    const gaps = gapsAround(hued.map(({ oklch }) => oklch.h)); // From color i to the next

    // The largest gap closes the circle: the chain runs from the color after it to the one before it
    const largest = gaps.indexOf(Math.max(...gaps));
    let chain = Array.from({ length: n }, (_, k) => hued[(largest + 1 + k) % n]);
    let steps = Array.from({ length: n - 1 }, (_, k) => gaps[(largest + 1 + k) % n]);
    // Start from the tight end
    let dir = 1;
    if (steps[0] > steps[n - 2]) {
        chain = chain.reverse();
        steps = steps.reverse();
        dir = -1;
    }

    // Where each color sits now along the chain, and its place in units of X: 0, 1, 3, 7...
    const now = [0];
    steps.forEach((s, k) => now.push(now[k] + s));
    const unit = chain.map((_, k) => 2 ** k - 1);
    // Least squares (with a free turn): X = cov(unit, now) / var(unit)
    const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;
    const mu = mean(unit), mn = mean(now);
    const cov = unit.reduce((s, u, k) => s + (u - mu) * (now[k] - mn), 0);
    const varU = unit.reduce((s, u) => s + (u - mu) ** 2, 0);
    const maxX = MAX_SPAN / unit[n - 1];
    const x = Math.min(Math.max(cov / varU, 1), maxX);

    return withHues(colors, placeWithLeastMovement(chain, unit.map((u) => dir * u * x)));
}
