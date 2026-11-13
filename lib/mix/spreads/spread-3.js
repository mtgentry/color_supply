// Spread 3: triad.
import { huedByAngle, withHues, placeWithLeastMovement } from './shared.js';

/**
 * "Spread 3: triad", for three colors: they end up 120 degrees apart, in their
 * order around the hue circle (OKLCH), turned to wherever they move least.
 * Only the hue changes; grays are left out.
 * @param {Array<{id: any, oklch: object}>} colors
 * @returns {Array<{id: any, oklch: object}>|null} The same colors, in the same
 *   order, with new hues; or null unless there are exactly three hues.
 */
export function triad(colors) {
    const hued = huedByAngle(colors);
    if (hued.length !== 3) return null;
    return withHues(colors, placeWithLeastMovement(hued, [0, 120, 240]));
}
