// The hue spreads, in the order their switches appear on the Mix canvas.
// Each takes [{ id, oklch }] and returns the same colors with new hues, or
// null when it doesn't apply to the palette. To add one: a new file here,
// and a line below.
import { spreadGaps } from './spread-1.js';
import { matchPairs } from './spread-2.js';
import { triad } from './spread-3.js';
import { doubling } from './spread-4.js';
import { square } from './spread-5.js';

export { GRAY_CHROMA } from './shared.js';
export { spreadGaps, matchPairs, triad, doubling, square };

export const SPREADS = [
    { id: 'spread-1', label: 'Spread 1', description: 'Evens out similar gaps, keeping clusters together', move: spreadGaps },
    { id: 'spread-2', label: 'Spread 2', description: 'Two pairs of colors get the same gap', move: matchPairs },
    { id: 'spread-3', label: 'Spread 3: triad', description: 'Three colors, 120° apart', move: triad },
    { id: 'spread-4', label: 'Spread 4: doubling', description: 'Each gap is twice the one before', move: doubling },
    { id: 'spread-5', label: 'Spread 5: square', description: 'Four colors, 90° apart', move: square }
];
