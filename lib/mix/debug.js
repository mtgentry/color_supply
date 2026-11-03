// debug.js
//
// Invariant checker. Only active when the URL has ?debug, e.g.
// http://localhost:8000/?debug (or the engine is created with debug: true).
//
// After every drag, click, and animation settles, it checks the rules
// square.js and interactions.js are supposed to guarantee. Violations are
// shown in an on-screen panel (with the likely cause) and logged to the
// console. The test suite runs the same checks via window.__debug.

import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { store } from './store.js';
import { overlap, paletteRow } from './geometry.js';
import * as overlapView from './overlap-view.js';
import { SQUARE_SIZE, CONTAINER, LOOSE_SCALE } from './constants.js';

const POSITION_TOLERANCE = 1.5; // px

/** True when the page URL asks for the checker (?debug). */
export function isDebugRequested() {
    return typeof location !== 'undefined' && new URLSearchParams(location.search).has('debug');
}

// Likely cause for each violation type, pointing at the code responsible.
const HINTS = {
    missingElement: 'Square is in the store but its element is not in the container. Squares should only be removed with square.remove().',
    orphanElement: 'A .square element exists with no square in the store. Squares should only be created with createSquare() in square.js.',
    nanPosition: 'centerX/centerY is not a number. Something set it without square.moveTo().',
    positionDrift: 'The square is drawn somewhere other than its centerX/centerY. Something moved the element without square.moveTo().',
    transformOffset: 'Square element has a GSAP x/y transform. Squares are positioned with left/top only; move them with square.moveTo().',
    outOfBounds: 'Square is outside the container. square.moveTo() clamps to bounds, so something moved it directly.',
    bareDraggable: 'Draggable has no onDrag/bounds, so dragging does nothing useful. A Draggable was created outside Square.enableDragging().',
    noDraggable: 'Square has no Draggable, so it cannot be dragged.',
    stuckLocked: 'Square is locked with nothing animating, so it can never be dragged again. Something called lock() without unlock().',
    staleSelection: 'The selection has an id with no square. See selection.js.',
    wrongSize: 'Square is the wrong size for where it is: full size in the main palette (the row with the most squares), LOOSE_SCALE elsewhere. See interactions.js updateSizes().',
    staleOverlapRegion: 'Overlap preview is visible but no squares overlap. interactions.js updatePreview() should have hidden it.',
    staleThreshold: 'thresholdActive is true with no overlap, so the next release could join. See interactions.js updatePreview().',
    stuckJoining: 'interaction.isJoining is true with nothing animating, so no more joins or previews will happen. See join.js onComplete.',
    stuckSettling: 'interaction.isSettling is true with nothing animating, so no more previews will happen. See interactions.js settle().',
    staleInsertion: 'interaction.insertion is set with no drag in progress, so previews are suppressed. See interactions.js onDragEnd.',
    uncaught: 'Uncaught JavaScript error.'
};

const violations = [];
const uncaughtErrors = []; // kept across reports so a later clean check can't hide them
let lastReportKey = '';

/** Where an element is drawn, in world coordinates (allowing for pan and zoom). */
function renderedCenter(el) {
    const c = store.container.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    const s = store.view.scale;
    return {
        x: (r.left - c.left + r.width / 2) / s,
        y: (r.top - c.top + r.height / 2) / s
    };
}

/** True while any GSAP tween is running (positions are mid-flight). */
export function isAnimating() {
    return gsap.globalTimeline.getChildren(true, true, false).some(t => t.isActive());
}

/** Runs every check and returns a list of { type, message, hint }. */
export function checkInvariants() {
    const found = [];
    if (!store.container) return found; // No engine
    const add = (type, message) => found.push({ type, message, hint: HINTS[type] });
    const squares = store.all();
    const animating = isAnimating();

    // Store <-> DOM
    const elements = new Set(squares.map(sq => sq.element));
    squares.forEach(sq => {
        if (!store.container.contains(sq.element)) add('missingElement', `Square ${sq.id} has no element in the container`);
    });
    store.container.querySelectorAll('.square').forEach(el => {
        if (!elements.has(el)) add('orphanElement', `Element #${el.id} has no square in the store`);
    });

    squares.forEach(sq => {
        const { centerX, centerY } = sq;
        if (!Number.isFinite(centerX) || !Number.isFinite(centerY)) {
            add('nanPosition', `Square ${sq.id} center is (${centerX}, ${centerY})`);
            return;
        }

        const drawn = renderedCenter(sq.element);
        if (Math.hypot(drawn.x - centerX, drawn.y - centerY) > POSITION_TOLERANCE) {
            add('positionDrift', `Square ${sq.id}: center (${centerX.toFixed(1)}, ${centerY.toFixed(1)}) vs drawn (${drawn.x.toFixed(1)}, ${drawn.y.toFixed(1)})`);
        }

        const half = SQUARE_SIZE / 2;
        if (drawn.x < half - 1 || drawn.x > CONTAINER.WIDTH - half + 1 ||
            drawn.y < half - 1 || drawn.y > CONTAINER.HEIGHT - half + 1) {
            add('outOfBounds', `Square ${sq.id} drawn at (${drawn.x.toFixed(1)}, ${drawn.y.toFixed(1)})`);
        }

        const tx = gsap.getProperty(sq.element, 'x'), ty = gsap.getProperty(sq.element, 'y');
        if (Math.abs(tx) > 0.5 || Math.abs(ty) > 0.5) {
            add('transformOffset', `Square ${sq.id} has transform x=${tx.toFixed(1)}, y=${ty.toFixed(1)}`);
        }

        const d = Draggable.get(sq.element);
        if (!d) add('noDraggable', `Square ${sq.id} has no Draggable`);
        else if (typeof d.vars.onDrag !== 'function' || !d.vars.bounds) {
            add('bareDraggable', `Square ${sq.id} Draggable type "${d.vars.type}" with no onDrag/bounds`);
        }
        if (sq.locked && !animating) add('stuckLocked', `Square ${sq.id} is locked`);
    });

    // Sizes: full in the main palette, LOOSE_SCALE elsewhere
    if (!animating && store.interaction.draggingId === null) {
        const members = paletteRow(squares);
        squares.forEach(sq => {
            const expected = members.has(sq.id) ? 1 : LOOSE_SCALE;
            if (Math.abs(sq.scale - expected) > 1e-6) add('wrongSize', `Square ${sq.id} has scale ${sq.scale}, expected ${expected}`);
            const drawn = sq.element.getBoundingClientRect().width / store.view.scale;
            if (Math.abs(drawn - SQUARE_SIZE * expected) > 1) add('wrongSize', `Square ${sq.id} is drawn ${drawn.toFixed(1)}px wide, expected ${SQUARE_SIZE * expected}`);
        });
    }

    store.selection.forEach(id => { if (!store.get(id)) add('staleSelection', `Selected id ${id} has no square`); });

    // Overlap preview and join state
    const anyOverlap = squares.some((a, i) => squares.slice(i + 1).some(b => overlap(a, b)));
    const { interaction } = store;
    if (overlapView.isVisible() && !anyOverlap && !interaction.isJoining) add('staleOverlapRegion', 'Overlap preview visible with no overlapping squares');
    if (interaction.isSettling && !animating) add('stuckSettling', 'isSettling=true but nothing is animating');
    if (interaction.insertion && interaction.draggingId === null) add('staleInsertion', 'insertion set but nothing is being dragged');
    if (interaction.thresholdActive && !anyOverlap) add('staleThreshold', 'thresholdActive=true with no overlapping squares');
    if (interaction.isJoining && !animating) add('stuckJoining', 'isJoining=true but nothing is animating');

    return found;
}

/** Waits until no tweens are running (plus a short grace period), then checks. */
function checkWhenSettled(reason) {
    const start = performance.now();
    const poll = () => {
        if (!store.container) return; // Engine destroyed meanwhile
        if (isAnimating() && performance.now() - start < 5000) return setTimeout(poll, 50);
        setTimeout(() => { if (store.container) report(checkInvariants(), reason); }, 50);
    };
    setTimeout(poll, 100);
}

function report(found, reason) {
    found = [...uncaughtErrors, ...found];
    violations.length = 0;
    violations.push(...found);
    renderPanel(found, reason);

    const key = found.map(v => v.message).join('|');
    if (key === lastReportKey) return;
    lastReportKey = key;
    if (found.length) {
        console.groupCollapsed(`%c[debug] ${found.length} problem(s) after ${reason}`, 'color:#c00');
        found.forEach(v => console.warn(`${v.type}: ${v.message}\n  likely cause: ${v.hint}`));
        console.groupEnd();
    }
}

let panel;
function renderPanel(found, reason) {
    if (!panel) {
        panel = document.createElement('div');
        panel.id = 'debug-panel';
        Object.assign(panel.style, {
            position: 'fixed', left: '12px', bottom: '12px', width: '420px', maxHeight: '45vh',
            overflow: 'auto', font: '12px/1.4 ui-monospace, Menlo, monospace', background: '#111',
            color: '#eee', padding: '10px 12px', borderRadius: '8px', zIndex: 10000, opacity: 0.92
        });
        document.body.appendChild(panel);
    }
    const esc = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
    panel.innerHTML = found.length
        ? `<div style="color:#f77;margin-bottom:6px">${found.length} problem(s) after ${esc(reason)}</div>` +
          found.map(v => `<div style="margin-bottom:8px"><b style="color:#fc6">${v.type}</b> ${esc(v.message)}` +
              `<div style="color:#9ab">↳ ${esc(v.hint)}</div></div>`).join('')
        : `<span style="color:#7d7">✓ all checks pass</span> <span style="color:#888">(after ${esc(reason)})</span>`;
}

/**
 * Turns the checker on: checks after every pointer release and reports
 * uncaught errors, in the panel. Called by index.js when debugging is on.
 * @param {{signal?: AbortSignal}} [p] - Aborting it removes the listeners and the panel.
 */
export function installChecker({ signal } = {}) {
    window.__debug.enabled = true;
    const recordError = message => {
        uncaughtErrors.push({ type: 'uncaught', message, hint: HINTS.uncaught });
        report(violations.filter(v => v.type !== 'uncaught'), 'error');
    };
    // Capture phase so failed <script>/module loads (which don't bubble) are caught too
    window.addEventListener('error', e => {
        if (e.target && e.target !== window) {
            recordError(`failed to load ${e.target.src || e.target.href || e.target.tagName}`);
        } else {
            recordError(`${e.message} (${e.filename?.split('/').pop()}:${e.lineno})`);
        }
    }, { capture: true, signal });
    window.addEventListener('unhandledrejection', e => recordError(String(e.reason)), { signal });
    document.addEventListener('pointerup', () => checkWhenSettled('drag/click'), { capture: true, signal });
    signal?.addEventListener('abort', () => {
        panel?.remove();
        panel = null;
        window.__debug.enabled = false;
    });
    checkWhenSettled('init');
}

// Exposed for Playwright and for poking at in the console (enabled is set by installChecker).
if (typeof window !== 'undefined') {
    window.__debug = { enabled: false, store, checkInvariants, isAnimating, violations };
}
