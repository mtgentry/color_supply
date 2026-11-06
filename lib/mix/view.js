// view.js
//
// The view onto the world: the squares, grid, and overlap preview live in a
// "world" layer inside the canvas. Square positions are in world coordinates,
// so moving the view doesn't change any layout rules. The world can be bigger
// than the canvas (the part of it on screen). Figma-style:
//   - Drag on the background: a selection rectangle; squares it touches are
//     selected (Shift adds to the selection). A click on the background
//     clears the selection, as does Escape.
//   - Delete or Backspace removes the selected squares.
//   - Hold Space and drag, or scroll / use the trackpad: pan.
//   - Pinch on the trackpad, or Ctrl/Cmd + scroll: zoom around the pointer.

import gsap from 'gsap';
import { store } from './store.js';
import { squaresInRect } from './geometry.js';
import { select, clearSelection } from './selection.js';
import { removeSquares } from './interactions.js';
import { CONTAINER, VIEW, SELECTION, STYLE, setWorldSize } from './constants.js';

let canvasEl = null;
let worldEl = null;

/** True when a key event comes from a text field (so Space and Escape are the field's). */
function isTyping(event) {
    const t = event.target;
    return t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName));
}

/**
 * Creates the world layer inside the canvas and sets up selecting and panning.
 * @param {HTMLElement} canvas - The visible canvas (position: relative, overflow: hidden).
 * @param {object} [p]
 * @param {AbortSignal} [p.signal] - Aborting it removes every listener (see index.js destroy()).
 * @returns {HTMLElement} The world layer, for squares and the grid to live in.
 */
export function createView(canvas, { signal } = {}) {
    canvasEl = canvas;
    const world = document.createElement('div');
    world.id = 'world';
    Object.assign(world.style, {
        position: 'absolute',
        left: '0',
        top: '0',
        width: `${CONTAINER.WIDTH}px`,
        height: `${CONTAINER.HEIGHT}px`
    });
    canvas.appendChild(world);
    worldEl = world;
    // No browser text selection (the grid labels) or touch scrolling while dragging
    Object.assign(canvas.style, { touchAction: 'none', userSelect: 'none', webkitUserSelect: 'none' });

    const on = (target, type, handler, options = {}) => target.addEventListener(type, handler, { ...options, signal });

    // A press on the background: a pan (Space held) or a selection rectangle
    let gesture = null;
    let marquee = null;

    // Space held: the background pans instead of selecting (grab hand)
    let spaceHeld = false;
    const updateCursor = () => {
        canvas.style.cursor = gesture?.panning ? 'grabbing' : spaceHeld ? 'grab' : 'default';
    };
    on(window, 'keydown', event => {
        if (isTyping(event)) return;
        if (event.code === 'Space') {
            event.preventDefault(); // Don't scroll the page
            if (!spaceHeld) {
                spaceHeld = true;
                updateCursor();
            }
        }
        if (event.key === 'Escape') clearSelection();
        if ((event.key === 'Delete' || event.key === 'Backspace') && store.selection.size) {
            event.preventDefault(); // Backspace would navigate back in some browsers
            removeSquares([...store.selection]);
        }
    });
    on(window, 'keyup', event => {
        if (event.code === 'Space') {
            spaceHeld = false;
            updateCursor();
        }
    });
    // Losing focus (switching tabs) with Space held would leave the grab hand on
    on(window, 'blur', () => {
        spaceHeld = false;
        updateCursor();
    });

    // Scroll / trackpad pans. A trackpad pinch arrives as a wheel event with
    // ctrlKey set (as does Ctrl/Cmd + scroll), and zooms.
    on(canvas, 'wheel', event => {
        event.preventDefault();
        fitTween?.kill(); // The user's scroll wins over a glide in progress
        if (event.ctrlKey || event.metaKey) {
            zoomAt(event.clientX, event.clientY, store.view.scale * Math.exp(-event.deltaY * VIEW.ZOOM_SPEED));
        } else {
            panTo(store.view.panX - event.deltaX, store.view.panY - event.deltaY);
        }
    }, { passive: false });

    // Safari sends trackpad pinches as gesture events instead
    let gestureStartScale = 1;
    on(canvas, 'gesturestart', event => {
        event.preventDefault();
        fitTween?.kill();
        gestureStartScale = store.view.scale;
    });
    on(canvas, 'gesturechange', event => {
        event.preventDefault();
        zoomAt(event.clientX, event.clientY, gestureStartScale * event.scale);
    });

    on(canvas, 'pointerdown', event => {
        // Squares handle their own pressing and dragging
        if (event.button !== 0 || event.target.closest('.square')) return;
        fitTween?.kill();
        gesture = {
            panning: spaceHeld,
            started: false,
            client: { x: event.clientX, y: event.clientY },
            pan: { x: store.view.panX, y: store.view.panY },
            from: worldPoint(event.clientX, event.clientY),
            keep: event.shiftKey ? [...store.selection] : [] // Shift adds to the selection
        };
        updateCursor();
    });

    on(canvas, 'pointermove', event => {
        if (!gesture) return;
        const dx = event.clientX - gesture.client.x;
        const dy = event.clientY - gesture.client.y;
        if (!gesture.started) {
            if (Math.hypot(dx, dy) < VIEW.DRAG_THRESHOLD) return; // Still a click
            gesture.started = true;
            canvas.setPointerCapture(event.pointerId); // Keep getting moves outside the canvas
        }
        if (gesture.panning) {
            panTo(gesture.pan.x + dx, gesture.pan.y + dy);
            return;
        }
        const to = worldPoint(event.clientX, event.clientY);
        const rect = {
            left: Math.min(gesture.from.x, to.x),
            top: Math.min(gesture.from.y, to.y),
            right: Math.max(gesture.from.x, to.x),
            bottom: Math.max(gesture.from.y, to.y)
        };
        drawMarquee(rect);
        select([...gesture.keep, ...squaresInRect(store.all(), rect).map(sq => sq.id)]);
    });

    const end = event => {
        if (!gesture) return;
        // A plain click on the background clears the selection
        if (!gesture.started && !gesture.panning && !event.shiftKey) clearSelection();
        if (gesture.started) canvas.releasePointerCapture?.(event.pointerId);
        gesture = null;
        marquee?.remove();
        marquee = null;
        updateCursor();
    };
    on(canvas, 'pointerup', end);
    on(canvas, 'pointercancel', end);

    /** The selection rectangle, in world coordinates. */
    function drawMarquee(rect) {
        if (!marquee) {
            marquee = document.createElement('div');
            marquee.id = 'selection-rect';
            Object.assign(marquee.style, {
                position: 'absolute',
                pointerEvents: 'none',
                boxSizing: 'border-box',
                border: `1px solid ${SELECTION.COLOR}`,
                backgroundColor: SELECTION.FILL,
                zIndex: `${STYLE.ZINDEX.TOP}`
            });
            world.appendChild(marquee);
        }
        Object.assign(marquee.style, {
            left: `${rect.left}px`,
            top: `${rect.top}px`,
            width: `${rect.right - rect.left}px`,
            height: `${rect.bottom - rect.top}px`
        });
    }

    updateCursor();
    return world;
}

/** Removes the world layer (when the engine is destroyed). The listeners go with the signal. */
export function destroyView() {
    fitTween?.kill();
    worldEl?.remove();
    worldEl = null;
    if (canvasEl) canvasEl.style.cursor = '';
    canvasEl = null;
}

/** The visible canvas size, in screen pixels. */
function canvasSize() {
    return { width: canvasEl?.clientWidth || CONTAINER.WIDTH, height: canvasEl?.clientHeight || CONTAINER.HEIGHT };
}

/** A screen position in world coordinates (allowing for pan and zoom). */
export function worldPoint(clientX, clientY) {
    const r = worldEl.getBoundingClientRect();
    return { x: (clientX - r.left) / store.view.scale, y: (clientY - r.top) / store.view.scale };
}

/** The part of the world that's on screen, in world coordinates. */
export function visibleRect() {
    const { panX, panY, scale } = store.view;
    const canvas = canvasSize();
    return {
        left: -panX / scale,
        top: -panY / scale,
        right: (canvas.width - panX) / scale,
        bottom: (canvas.height - panY) / scale
    };
}

/**
 * Moves the world so its top-left corner is at (x, y) in the canvas, keeping
 * at least VIEW.KEEP_VISIBLE pixels of it on screen.
 */
export function panTo(x, y) {
    const keep = VIEW.KEEP_VISIBLE;
    const { scale } = store.view;
    const canvas = canvasSize();
    store.view.panX = Math.min(Math.max(x, keep - CONTAINER.WIDTH * scale), canvas.width - keep);
    store.view.panY = Math.min(Math.max(y, keep - CONTAINER.HEIGHT * scale), canvas.height - keep);
    gsap.set(store.container, { x: store.view.panX, y: store.view.panY, scale, transformOrigin: '0 0' });
}

/**
 * Zooms to `scale` (within VIEW.MIN_ZOOM..MAX_ZOOM), keeping the world point
 * under (clientX, clientY) where it is on screen.
 */
export function zoomAt(clientX, clientY, scale) {
    const next = Math.min(Math.max(scale, VIEW.MIN_ZOOM), VIEW.MAX_ZOOM);
    const canvas = canvasEl.getBoundingClientRect();
    const px = clientX - canvas.left;
    const py = clientY - canvas.top;
    const { panX, panY, scale: current } = store.view;
    // The world point under the pointer, before and after
    const wx = (px - panX) / current;
    const wy = (py - panY) / current;
    store.view.scale = next;
    panTo(px - wx * next, py - wy * next);
}

/** The rectangle around every square plus VIEW.FIT_MARGIN, in world coordinates (null if none). */
function squaresBounds() {
    const squares = store.all();
    if (!squares.length) return null;
    const m = VIEW.FIT_MARGIN;
    return {
        left: Math.min(...squares.map(sq => sq.targetX - sq.size / 2)) - m,
        right: Math.max(...squares.map(sq => sq.targetX + sq.size / 2)) + m,
        top: Math.min(...squares.map(sq => sq.targetY - sq.size / 2)) - m,
        bottom: Math.max(...squares.map(sq => sq.targetY + sq.size / 2)) + m
    };
}

function contains(view, b) {
    return b.left >= view.left && b.right <= view.right && b.top >= view.top && b.bottom <= view.bottom;
}

/** The view that centers rectangle b in the canvas, at the largest zoom (up to maxScale) that fits it. */
function framing(b, maxScale) {
    const canvas = canvasSize();
    const fit = Math.min(canvas.width / (b.right - b.left), canvas.height / (b.bottom - b.top));
    const scale = Math.max(VIEW.MIN_ZOOM, Math.min(maxScale, fit));
    return {
        scale,
        panX: canvas.width / 2 - ((b.left + b.right) / 2) * scale,
        panY: canvas.height / 2 - ((b.top + b.bottom) / 2) * scale
    };
}

/**
 * Centers the world in the canvas at 100%. With a world the size of the
 * canvas (the prototype) that's no pan at all; with a bigger world (the site)
 * it shows the middle, where load() puts the starting row.
 * If the squares don't all fit at 100% (a canvas as narrow as a phone), it
 * zooms out until they do, centered on them.
 */
export function fitView() {
    fitTween?.kill();
    const canvas = canvasSize();
    store.view.scale = 1;
    panTo((canvas.width - CONTAINER.WIDTH) / 2, (canvas.height - CONTAINER.HEIGHT) / 2);
    const b = squaresBounds();
    if (!b || contains(visibleRect(), b)) return;
    const to = framing(b, 1);
    store.view.scale = to.scale;
    panTo(to.panX, to.panY);
}

let fitTween = null; // The view's current glide (fitSquares, revealBelow, glideTo); input stops it

/** Jumps a running glide to its end, so the view is where it's headed. */
export function settleView() {
    fitTween?.progress(1);
}

/**
 * Makes the world at least `height` tall (it only grows), so rows added below
 * the rest always have room instead of being clamped onto the bottom row.
 */
export function growWorld(height) {
    if (height <= CONTAINER.HEIGHT) return;
    setWorldSize(CONTAINER.WIDTH, Math.ceil(height));
    if (worldEl) worldEl.style.height = `${CONTAINER.HEIGHT}px`;
}

/**
 * Brings world y `bottom` (a row just added below the rest) into view,
 * gliding. The rows on screen slide up; once the top ones would slide off,
 * it zooms out instead, so everything that was on screen stays on screen.
 * At the smallest zoom it goes back to sliding.
 */
export function revealBelow(bottom) {
    settleView(); // Adding rows quickly: start from where the last glide was going
    const view = visibleRect();
    if (bottom <= view.bottom) return;
    const { scale, panX, panY } = store.view;
    const shift = bottom - view.bottom; // World px the view must move down
    // The squares on screen now (not the new row, which is below): they're what should stay in view
    const shown = store.all().filter(sq => {
        const h = sq.size / 2;
        return sq.targetX + h > view.left && sq.targetX - h < view.right &&
            sq.targetY + h > view.top && sq.targetY - h < view.bottom;
    });
    const top = shown.length ? Math.min(...shown.map(sq => sq.targetY - sq.size / 2)) - VIEW.FIT_MARGIN : Infinity;
    if (top >= view.top + shift) {
        glideTo(panX, panY - shift * scale);
        return;
    }
    // Zoom out to fit them and the new row, horizontally where the view is now
    const canvas = canvasSize();
    const to = framing({ left: view.left, right: view.right, top, bottom }, scale);
    // Too tall even at the smallest zoom: keep the new row at the bottom of the screen
    if (canvas.height / to.scale < bottom - top) to.panY = canvas.height - bottom * to.scale;
    animateView(to);
}

/** Eases the view (pan and zoom) to `to`, as one glide that input can stop. */
function animateView(to, { duration = VIEW.GLIDE_DURATION, ease = 'power3.out' } = {}) {
    const v = { scale: store.view.scale, panX: store.view.panX, panY: store.view.panY };
    fitTween?.kill();
    fitTween = gsap.to(v, {
        ...to,
        duration,
        ease,
        onUpdate: () => {
            store.view.scale = v.scale;
            panTo(v.panX, v.panY);
        }
    });
}

/** Pans (no zoom) to (x, y) like panTo, but eases there over `duration` seconds. */
export function glideTo(x, y, { duration = VIEW.GLIDE_DURATION } = {}) {
    animateView({ panX: x, panY: y }, { duration });
}

/**
 * If any square is off screen, eases the view out (never in) until they're
 * all on screen, centered on them. Does nothing when they already are.
 */
export function fitSquares({ duration = VIEW.FIT_DURATION } = {}) {
    const b = squaresBounds();
    if (!b || contains(visibleRect(), b)) return;
    animateView(framing(b, store.view.scale), { duration, ease: 'power2.inOut' });
}
