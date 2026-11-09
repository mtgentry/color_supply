// selection.js
//
// Which squares are selected (Figma-style). The selected ids live in
// store.selection; this module changes them and draws the selection: a
// rectangle around the outer edges of the selected squares. Around several,
// it's always drawn, a little out from them; around one square, only while
// that square is pressed, right on its edge (and not while it's dragged far
// enough over another to join: then the outline is on the overlap instead,
// overlap-view.js).
// view.js draws the drag-to-select rectangle;
// interactions.js drags the selected squares together.

import { store } from './store.js';
import { toHex } from './palette.js';
import { SQUARE_SIZE, ROW, SELECTION, STYLE } from './constants.js';

let bounds = null; // The rectangle around a multi-square selection
let lastReport = ''; // What store.onSelectionChange was last told, to report only changes
let pressed = false; // The pointer is down on a square (interactions.js)

/** Removes the selection rectangle (when the engine is destroyed). */
export function reset() {
    bounds?.remove();
    bounds = null;
    lastReport = '';
    pressed = false;
}

/**
 * The selection as plain data, for the host (store.onSelectionChange): the
 * selected squares left to right, their colors, whether they form one row
 * (so their order is a palette's order), and the rectangle around them in
 * world coordinates (null when nothing is selected).
 */
export function describeSelection() {
    const squares = selectedSquares().sort((a, b) => a.targetX - b.targetX || a.targetY - b.targetY);
    const rowY = squares[0]?.targetY;
    return {
        ids: squares.map(sq => sq.id),
        hexes: squares.map(sq => toHex(sq.oklch)),
        isRow: squares.length > 0 && squares.every(sq => Math.abs(sq.targetY - rowY) < ROW.THRESHOLD),
        bounds: squares.length ? boundsOf(squares) : null
    };
}

/** The rectangle around some squares, with the selection box's padding (offset: the gap before the line). */
function boundsOf(squares, offset = SELECTION.BOUNDS_OFFSET) {
    const pad = offset + SELECTION.BOUNDS_WIDTH;
    const half = sq => (sq.size ?? SQUARE_SIZE) / 2;
    return {
        left: Math.min(...squares.map(sq => sq.centerX - half(sq))) - pad,
        top: Math.min(...squares.map(sq => sq.centerY - half(sq))) - pad,
        right: Math.max(...squares.map(sq => sq.centerX + half(sq))) + pad,
        bottom: Math.max(...squares.map(sq => sq.centerY + half(sq))) + pad
    };
}

/** Selects `ids`, replacing the selection (or adding to it with add: true). */
export function select(ids, { add = false } = {}) {
    if (!add) store.selection.clear();
    for (const id of ids) store.selection.add(id);
    render();
}

/** Adds a square to the selection, or removes it if it's already selected. */
export function toggle(id) {
    if (store.selection.has(id)) store.selection.delete(id);
    else store.selection.add(id);
    render();
}

export function clearSelection() {
    if (!store.selection.size) return;
    store.selection.clear();
    render();
}

/** True if `id` is part of a selection of more than one square (a group). */
export function inGroup(id) {
    return store.selection.size > 1 && store.selection.has(id);
}

/** The selected squares. */
export function selectedSquares() {
    return store.all().filter(sq => store.selection.has(sq.id));
}

function render() {
    refreshBounds();
}

/** The pointer went down on a square, or came back up (interactions.js). */
export function setPressed(down) {
    pressed = down;
    refreshBounds();
}

/**
 * Redraws the rectangle around the selection, to follow squares as they move
 * (called by interactions.js whenever squares move).
 */
export function refreshBounds() {
    report();
    const squares = selectedSquares();
    const single = squares.length === 1;
    if (!squares.length || (single && (!pressed || store.interaction.thresholdActive))) {
        if (bounds) bounds.style.display = 'none';
        return;
    }
    if (!bounds) {
        bounds = document.createElement('div');
        bounds.id = 'selection-bounds';
        Object.assign(bounds.style, {
            position: 'absolute',
            pointerEvents: 'none',
            boxSizing: 'border-box',
            border: `${SELECTION.BOUNDS_WIDTH}px solid ${SELECTION.COLOR}`,
            zIndex: `${STYLE.ZINDEX.OVERLAP}`
        });
        store.container.appendChild(bounds);
    }
    // One square: the line sits right on its edge, with no gap
    const { left, top, right, bottom } = boundsOf(squares, single ? 0 : SELECTION.BOUNDS_OFFSET);
    Object.assign(bounds.style, {
        display: 'block',
        left: `${left}px`,
        top: `${top}px`,
        width: `${right - left}px`,
        height: `${bottom - top}px`
    });
}

/** Tells the host about the selection when it (or where it is) has changed. */
function report() {
    if (!store.onSelectionChange) return;
    const description = describeSelection();
    const key = JSON.stringify(description);
    if (key === lastReport) return;
    lastReport = key;
    store.onSelectionChange(description);
}
