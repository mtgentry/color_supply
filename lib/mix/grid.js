// grid.js
//
// The pixel grid overlay: lines and coordinate labels every
// GRID.MARKER_INTERVAL pixels.

import { CONTAINER, GRID, STYLE } from './constants.js';

function line(styles) {
    const el = document.createElement('div');
    Object.assign(el.style, { position: 'absolute', backgroundColor: GRID.LINE_COLOR }, styles);
    return el;
}

function label(text, styles) {
    const el = document.createElement('div');
    Object.assign(el.style, {
        position: 'absolute',
        fontSize: GRID.LABEL_SIZE,
        color: GRID.LABEL_COLOR
    }, styles);
    el.textContent = text;
    return el;
}

/**
 * Draws the grid behind everything in the container.
 * @param {HTMLElement} container
 */
export function createGrid(container) {
    const overlay = document.createElement('div');
    overlay.id = 'pixel-grid';
    Object.assign(overlay.style, {
        position: 'absolute',
        inset: '0',
        zIndex: `${STYLE.ZINDEX.BASE}`
    });

    for (let x = 0; x <= CONTAINER.WIDTH; x += GRID.MARKER_INTERVAL) {
        overlay.appendChild(line({ left: `${x}px`, top: '0', width: '1px', height: '100%' }));
        overlay.appendChild(label(x, { left: `${x}px`, top: '0', transform: 'translateX(-50%)' }));
    }
    for (let y = 0; y <= CONTAINER.HEIGHT; y += GRID.MARKER_INTERVAL) {
        overlay.appendChild(line({ left: '0', top: `${y}px`, width: '100%', height: '1px' }));
        overlay.appendChild(label(y, { left: '0', top: `${y}px`, transform: 'translateY(-50%)' }));
    }

    container.insertBefore(overlay, container.firstChild);
}
