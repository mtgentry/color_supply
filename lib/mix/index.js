// index.js
//
// The engine's public face. createMixEngine(canvas, options) builds the
// canvas inside an element and returns a handle for whatever hosts it: the
// demo page (main.js) or the site's Mix page (a Vue component). Everything
// behind this file is plain JS that knows nothing about the host; the host
// only ever calls what's returned here.
//
//   const engine = createMixEngine(el, { colors: ['#FF0000', ...], onChange });
//   engine.load(hexes | savedState);   // Replace every square
//   engine.addColor(hex, x, y);        // Add one square
//   engine.addRow(hexes, point?);      // Add a row of squares, at a world point or below the rest
//   engine.worldPoint(clientX, clientY)                 // Screen -> world, for drops
//   engine.showDropPreview(hexes, point) / hideDropPreview()  // Ghost row while dragging a palette in
//   engine.setColors([{ id, oklch }], { settled })  // Recolor squares (sliders); settled: false while dragging
//   engine.showLightness([ids])                      // Draw squares as grays of their lightness ([] = off)
//   engine.removeSquares(ids)          // Remove squares (Delete does this for the selection)
//   engine.playIntro();                // The onboarding demo (also an option, for the first visit)
//   engine.isIntroPlaying()            // Whether it's playing (it joins two squares, which reports a change)
//   engine.getState();                 // Plain data: every square, the main palette, the view
//   engine.worldElement                // The layer squares live in (host UI can be placed inside it)
//   engine.mainPalette();              // Hexes of the main palette row, left to right
//   engine.destroy();                  // Remove everything (listeners, elements, animations)
//
// The intro, grid, and checker are the same as on the demo page; the options
// turn them on or off.

import { store } from './store.js';
import { createSquare } from './square.js';
import { hexToOKLCH, toHex } from './palette.js';
import { createGrid } from './grid.js';
import { createView, panTo, growWorld, revealBelow, fitView, fitSquares, destroyView, worldPoint, visibleRect } from './view.js';
import { startIntro } from './intro.js';
import { paletteRow, rowSlots, clampCenter } from './geometry.js';
import * as interactions from './interactions.js'; // Importing it registers what dragging does
import * as join from './join.js';
import * as overlapView from './overlap-view.js';
import * as dropPreview from './drop-preview.js';
import * as selection from './selection.js';
import { updatePreview } from './interactions.js';
import { installChecker, isDebugRequested } from './debug.js';
import { CONTAINER, ROW, SQUARE_SIZE, SQUARE_CENTER, DROP, FEATURES, INTRO, setWorldSize } from './constants.js';

/**
 * @param {HTMLElement} canvas - The visible element. Needs position: relative
 *   (or absolute) and overflow: hidden; the engine fills it.
 * @param {object} [options]
 * @param {string[]|object} [options.colors] - Hex colors for a starting row,
 *   or a state from getState() to restore.
 * @param {number} [options.rowY] - Where the starting row goes (world y).
 *   Default: the middle of the world, which the view opens centered on.
 * @param {{width: number, height: number}} [options.world] - Size of the
 *   pannable world squares live in. Defaults to CONTAINER (800x800).
 * @param {boolean} [options.grid] - Pixel grid overlay. Default FEATURES.SHOW_GRID.
 * @param {boolean} [options.intro] - Play the onboarding demo. Default FEATURES.SHOW_INTRO.
 * @param {string} [options.introImages] - Path to the cursor images. Default INTRO.IMAGE_PATH.
 * @param {boolean} [options.debug] - Invariant checker and panel. Default: the URL has ?debug.
 * @param {(state: object) => void} [options.onChange] - Called with getState()
 *   once the squares come to rest after a drop, join, or insert.
 * @param {(selection: object) => void} [options.onSelectionChange] - Called
 *   whenever the selection changes or moves, with { ids, hexes, isRow, bounds }:
 *   the selected squares left to right, whether they form one row, and the
 *   rectangle around them (world coordinates; null unless two or more).
 * @param {() => void} [options.onRecolor] - Called on every setColors, including
 *   while a slider is still moving (onChange waits for it to settle).
 */
export function createMixEngine(canvas, options = {}) {
    if (store.container) throw new Error('[index.js] An engine already exists; destroy() it first');
    const {
        world = null,
        grid = FEATURES.SHOW_GRID,
        intro = FEATURES.SHOW_INTRO,
        introImages = INTRO.IMAGE_PATH,
        debug = isDebugRequested(),
        onChange = null,
        onSelectionChange = null,
        onRecolor = null
    } = options;

    if (world) setWorldSize(world.width, world.height);

    const controller = new AbortController();
    const { signal } = controller;
    store.reset();
    store.container = createView(canvas, { signal });
    if (grid) createGrid(store.container);
    if (debug) installChecker({ signal });

    let introHandle = null;
    let destroyed = false;

    /** A square from a hex or OKLCH color; null (with a warning) for a bad color. */
    function place({ hex, oklch, x, y, id }) {
        const color = oklch ? { mode: 'oklch', ...oklch } : hexToOKLCH(hex);
        if (!color) {
            console.warn(`[index.js] Skipping invalid color ${JSON.stringify(hex ?? oklch)}`);
            return null;
        }
        return createSquare({ id, oklch: color, centerX: x, centerY: y });
    }

    const engine = {
        /**
         * Replaces every square. A list of hex colors becomes a row across the
         * middle of the world (at `y`, default the vertical middle); a state
         * from getState() puts every square (and the view) back where it was.
         */
        load(input, { y = CONTAINER.HEIGHT / 2 } = {}) {
            // Nothing from the old canvas carries over: the intro would be dragging
            // a removed square, and a join mid-animation (the intro's, say) would
            // add its square to the new canvas
            introHandle?.cancel();
            join.reset();
            for (const sq of store.all()) sq.remove();
            selection.clearSelection();
            const wasReady = store.ready;
            store.ready = false; // No change reports or size animations while placing
            if (Array.isArray(input)) {
                const xs = rowSlots(input.length, CONTAINER.WIDTH / 2);
                input.forEach((hex, i) => place({ hex, x: xs[i], y }));
            } else if (input?.squares) {
                // A saved canvas can be taller than the starting world (rows added below)
                growWorld(Math.max(0, ...input.squares.map(sq => sq.y + SQUARE_CENTER)));
                for (const s of input.squares) place(s);
                if (input.view) {
                    store.view.scale = input.view.scale;
                    panTo(input.view.panX, input.view.panY);
                }
            }
            interactions.updateSizes();
            store.ready = wasReady;
        },

        /**
         * Adds a square. Without a position it goes below the lowest square,
         * centered on the view (like addRow), ready to drag in.
         * @returns {number|null} The new square's id, or null for a bad color.
         */
        addColor(hex, x, y) {
            if (x === undefined || y === undefined) {
                ({ x, y } = rowBelow());
                growWorld(y + SQUARE_CENTER);
            }
            const square = place({ hex, x, y });
            if (square) interactions.updateSizes();
            return square ? square.id : null;
        },

        /**
         * Adds a row of squares (a palette). Centered on `point` (world
         * coordinates, e.g. from worldPoint() on a drop); without one, below
         * the lowest square, centered on the view, and the view pans down if
         * that's off screen.
         * @returns {number[]} The new squares' ids.
         */
        addRow(hexes, point = null) {
            dropPreview.hide();
            if (!hexes.length) return [];
            const { x, y } = point || rowBelow();
            if (!point) growWorld(y + SQUARE_CENTER); // Room below the rest, so it never lands on the bottom row
            const xs = rowSlots(hexes.length, x);
            const cy = clampCenter(x, y).y;
            const ids = hexes.map((hex, i) => place({ hex, x: xs[i], y: cy })?.id).filter(id => id != null);
            interactions.updateSizes();
            if (!point) reveal(cy);
            store.changed();
            return ids;
        },

        /**
         * Recolors squares, e.g. from the sliders. Pass settled: false on every
         * move of a slider and settled: true (the default) when it's released,
         * so onChange reports once, with the final colors.
         * @param {Array<{id: number, oklch: object}>} changes
         */
        setColors(changes, { settled = true } = {}) {
            for (const { id, oklch } of changes) store.get(id)?.setColor(oklch);
            selection.refreshBounds(); // The selection's colors are part of what it reports
            const active = store.get(store.interaction.lastDraggedId);
            if (active && !store.interaction.draggingId) updatePreview(active); // A preview's blend may have changed
            onRecolor?.();
            if (settled) store.changed();
        },

        /**
         * Draws these squares as grays of their lightness (and every other
         * square in its color), to check contrast. Only the drawing changes.
         * Pass [] to show every square in its color again.
         * @param {number[]} ids
         */
        showLightness(ids) {
            const on = new Set(ids);
            for (const sq of store.all()) sq.showLightness(on.has(sq.id));
        },

        /**
         * Removes squares; the rows they leave close up. (Delete and Backspace
         * do this for the selection.)
         * @returns {number[]} The ids removed.
         */
        removeSquares: interactions.removeSquares,

        /** A screen position (e.g. a pointer event's clientX/clientY) in world coordinates. */
        worldPoint,

        /** Shows where a row of `hexes` would land if dropped at a world point (see addRow). */
        showDropPreview(hexes, point) {
            return dropPreview.show(hexes, point);
        },

        hideDropPreview() {
            dropPreview.hide();
        },

        /**
         * Everything about the canvas as plain data, for saving or for the
         * host's UI. Positions are where squares are headed if they're mid-move.
         * @returns {{squares: Array<{id, hex, oklch: {l, c, h}, x, y}>, mainPalette: string[], view: {panX, panY, scale}}}
         */
        getState() {
            return {
                squares: store.all().map(sq => ({
                    id: sq.id,
                    hex: toHex(sq.oklch),
                    oklch: { l: sq.oklch.l, c: sq.oklch.c, h: sq.oklch.h ?? 0 },
                    x: sq.targetX,
                    y: sq.targetY
                })),
                mainPalette: engine.mainPalette(),
                view: { ...store.view }
            };
        },

        /** Hexes of the main palette (the row with the most squares), left to right. */
        mainPalette() {
            const members = paletteRow(store.all());
            return store.all()
                .filter(sq => members.has(sq.id))
                .sort((a, b) => a.targetX - b.targetX)
                .map(sq => toHex(sq.oklch));
        },

        /** Centers the world in the canvas at 100% (zoomed out if the squares don't fit), e.g. after the canvas is resized. */
        fitView,

        /** Eases the view out until every square is on screen, if one isn't (e.g. on a phone, after a join). */
        fitSquares,

        /** The world layer. UI the host puts inside it pans and zooms with the squares. */
        get worldElement() {
            return store.container;
        },

        /** Plays the onboarding demo (replacing one in progress). Needs two squares in the main palette. */
        playIntro() {
            introHandle?.cancel();
            introHandle = startIntro({ canvas, imagePath: introImages });
        },

        /** Whether the onboarding demo is playing (its join, and the change it reports, included). */
        isIntroPlaying() {
            return !!introHandle?.isPlaying();
        },

        /** Removes everything the engine made: listeners, elements, and animations in flight. */
        destroy() {
            if (destroyed) return;
            destroyed = true;
            controller.abort(); // Every listener in view.js and debug.js
            introHandle?.cancel();
            join.reset();
            interactions.reset();
            for (const sq of store.all()) sq.remove();
            overlapView.reset();
            dropPreview.reset();
            selection.reset();
            destroyView();
            store.reset();
        }
    };

    /** Where a row added without a position goes: below the lowest square, centered on the view. */
    function rowBelow() {
        const view = visibleRect();
        const squares = store.all();
        const x = (view.left + view.right) / 2;
        if (!squares.length) return { x, y: (view.top + view.bottom) / 2 };
        const lowest = Math.max(...squares.map(sq => sq.targetY));
        return { x, y: lowest + SQUARE_SIZE + DROP.ROW_GAP };
    }

    /**
     * Shows a row just added at world y: the rows on screen slide up, and
     * once the top ones would go off screen the view zooms out instead.
     */
    function reveal(y) {
        revealBelow(y + SQUARE_CENTER + DROP.ROW_GAP);
    }

    engine.load(options.colors || [], { y: options.rowY });
    fitView();
    store.ready = true;
    store.onChange = onChange ? () => onChange(engine.getState()) : null;
    store.onSelectionChange = onSelectionChange;

    if (intro) setTimeout(() => { if (!destroyed) engine.playIntro(); }, 100);

    return engine;
}
