// Spread 5: square.
import { huedByAngle, withHues, placeWithLeastMovement } from './shared.js';

/**
 * "Spread 5: square", for four colors: they end up 90 degrees apart, in their
 * order around the hue circle (OKLCH), turned to wherever they move least.
 * Only the hue changes; grays are left out.
 * @param {Array<{id: any, oklch: object}>} colors
 * @returns {Array<{id: any, oklch: object}>|null} The same colors, in the same
 *   order, with new hues; or null unless there are exactly four hues.
 */
export function square(colors) {
    const hued = huedByAngle(colors);
    if (hued.length !== 4) return null;
    return withHues(colors, placeWithLeastMovement(hued, [0, 90, 180, 270]));
}
