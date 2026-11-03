// drop-preview.js
//
// Draws the ghost row shown while a palette is dragged over the canvas: a
// translucent square for each color, where the row would land. Lives in the
// world layer, so pan and zoom apply to it like everything else. Only draws;
// index.js decides when (showDropPreview / hideDropPreview).

import { store } from './store.js';
import { hexToOKLCH, toCss } from './palette.js';
import { rowSlots, clampCenter } from './geometry.js';
import { SQUARE_SIZE, SQUARE_CENTER, STYLE, DROP } from './constants.js';

let element = null;

/**
 * Shows the ghost row for `hexes`, centered on a world point.
 * @returns {{xs: number[], y: number}} Where the squares would land.
 */
export function show(hexes, { x, y }) {
    if (!element) {
        element = document.createElement('div');
        element.id = 'drop-preview';
        Object.assign(element.style, { position: 'absolute', left: '0', top: '0', pointerEvents: 'none', zIndex: `${STYLE.ZINDEX.TOP}` });
        store.container.appendChild(element);
    }
    const xs = rowSlots(hexes.length, x);
    const cy = clampCenter(x, y).y;
    element.replaceChildren(...hexes.map((hex, i) => {
        const box = document.createElement('div');
        Object.assign(box.style, {
            position: 'absolute',
            left: `${xs[i] - SQUARE_CENTER}px`,
            top: `${cy - SQUARE_CENTER}px`,
            width: `${SQUARE_SIZE}px`,
            height: `${SQUARE_SIZE}px`,
            backgroundColor: toCss(hexToOKLCH(hex)) || 'transparent',
            opacity: `${DROP.OPACITY}`
        });
        return box;
    }));
    element.style.display = 'block';
    return { xs, y: cy };
}

export function hide() {
    if (element) element.style.display = 'none';
}

export function isVisible() {
    return !!element && element.style.display !== 'none';
}

/** Removes the preview element (when the engine is destroyed). */
export function reset() {
    element?.remove();
    element = null;
}
