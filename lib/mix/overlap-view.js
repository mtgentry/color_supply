// overlap-view.js
//
// Draws the overlap preview: the rectangle where two squares overlap, filled
// with their blended color. Once the join threshold is met it gets the
// selection's outline, which leaves the dragged square (selection.js): the
// outline moves to the color that would be made.
// Only draws; interactions.js decides what to show.

import gsap from 'gsap';
import { store } from './store.js';
import { toCss } from './palette.js';
import { SQUARE_SIZE, SQUARE_CENTER, STYLE, ANIMATION, SELECTION } from './constants.js';

let element = null;

/** Removes the preview element (when the engine is destroyed). */
export function reset() {
    if (element) gsap.killTweensOf(element);
    element?.remove();
    element = null;
}

function getElement() {
    if (!element) {
        element = document.createElement('div');
        element.id = 'overlap-region';
        Object.assign(element.style, {
            position: 'absolute',
            pointerEvents: 'none',
            zIndex: `${STYLE.ZINDEX.OVERLAP}`,
            boxSizing: 'border-box',
            borderStyle: 'solid',
            display: 'none'
        });
        store.container.appendChild(element);
    }
    return element;
}

/**
 * Shows the preview over an overlap rectangle.
 * @param {{left, top, width, height}} rect - From geometry.overlap().
 * @param {object} oklch - The blended color.
 * @param {boolean} thresholdMet - Whether releasing now would join.
 */
export function show(rect, oklch, thresholdMet) {
    gsap.set(getElement(), {
        display: 'block',
        opacity: 1,
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        backgroundColor: toCss(oklch),
        borderWidth: thresholdMet ? SELECTION.BOUNDS_WIDTH : 0,
        borderColor: SELECTION.COLOR
    });
}

export function hide() {
    if (element) gsap.set(element, { display: 'none' });
}

export function isVisible() {
    return !!element && element.style.display !== 'none';
}

/**
 * Adds the join animation for the preview to a timeline: it grows into a full
 * square at the new square's slot, then fades out.
 */
export function animateIntoSlot(timeline, slot) {
    const el = getElement();
    timeline.to(el, {
        left: slot.x - SQUARE_CENTER,
        top: slot.y - SQUARE_CENTER,
        width: SQUARE_SIZE,
        height: SQUARE_SIZE,
        duration: ANIMATION.JOIN.MOVE,
        ease: ANIMATION.EASE.SMOOTH
    }, 0);
    timeline.to(el, {
        opacity: 0,
        duration: ANIMATION.JOIN.FADE_OUT
    });
}
