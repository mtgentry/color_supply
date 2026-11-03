// square.js
//
// The square owner. This is the only module that creates squares, touches
// their elements, or sets up their Draggable. Other modules ask a square to
// act (moveTo, lock, remove), so the same rules always apply:
//   - squares stay inside the container
//   - a square's centerX/centerY always match where it is drawn
//   - a square can't be dragged while locked or moving
//   - every square gets the same Draggable setup
//
// Positioning model: elements are placed with left/top only. Nothing should
// put an x/y transform on a square element.
//
// What a drag *does* (overlap previews, joins, gap closing) is decided in
// interactions.js, which registers hooks here via setSquareHooks().

import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { store } from './store.js';
import { toCss } from './palette.js';
import { clampCenter } from './geometry.js';
import { SQUARE_SIZE, SQUARE_CENTER, STYLE, ANIMATION, FEATURES } from './constants.js';

gsap.registerPlugin(Draggable);

const log = (...args) => FEATURES.ENABLE_LOGGING && console.log(...args);

/**
 * Hooks for interactions.js. Drag hooks receive (square, origin), where origin
 * is the square's center when the drag started. onPress(square, event) and
 * onRelease(square) run when the pointer goes down on a square and comes back
 * up (dragged or not). onMoved(square)
 * runs when a square is moved by anything other than a user drag (animations,
 * row shifts).
 */
const hooks = {
    onPress() {},
    onRelease() {},
    onDragStart() {},
    onDrag() {},
    onDragEnd() {},
    onMoved() {}
};

export function setSquareHooks(newHooks) {
    Object.assign(hooks, newHooks);
}

export class Square {
    constructor({ id, oklch }) {
        this.id = id;
        this.oklch = oklch;
        this.centerX = null;
        this.centerY = null;
        this.locked = false;
        this.draggable = null;
        this.moveTween = null;
        this.moveTarget = null;
        this.scale = 1;       // 1 in the main palette, LOOSE_SCALE outside it
        this.pressed = false;
        this.hasGroupBounds = false; // Drag limited to keep a selected group inside (setDragBounds)

        this.element = document.createElement('div');
        this.element.className = 'square';
        this.element.id = `square${id}`;
        Object.assign(this.element.style, {
            position: 'absolute',
            width: `${SQUARE_SIZE}px`,
            height: `${SQUARE_SIZE}px`,
            backgroundColor: toCss(oklch),
            zIndex: `${STYLE.ZINDEX.BASE}`,
            boxShadow: STYLE.SHADOW.DEFAULT,
            boxSizing: 'border-box'
        });
    }

    /** Draws the square at a (clamped) center and records it. */
    place(x, y) {
        const c = clampCenter(x, y);
        this.element.style.left = `${c.x - SQUARE_CENTER}px`;
        this.element.style.top = `${c.y - SQUARE_CENTER}px`;
        this.centerX = c.x;
        this.centerY = c.y;
        hooks.onMoved(this);
    }

    /**
     * Records where the element is actually drawn (its left/top) during a user
     * drag. Draggable's own x/y can differ by a pixel or two at a limit.
     */
    syncFromElement() {
        this.centerX = parseFloat(this.element.style.left) + SQUARE_CENTER;
        this.centerY = parseFloat(this.element.style.top) + SQUARE_CENTER;
    }

    /**
     * Moves the square's center to (x, y), clamped to the container.
     *
     * With animate: true:
     *   - centerX/centerY update on every frame
     *   - the square can't be dragged until the move ends
     *   - a new move replaces one already in flight
     *   - asking for the target it's already heading to is a no-op (except
     *     on a timeline, where each move is a scheduled step)
     * Pass `timeline` (and optionally `position`) to add the move to a GSAP
     * timeline; the start point is read when the move actually begins.
     *
     * @returns {gsap.core.Tween|null} The tween, or null for an instant move.
     */
    moveTo(x, y, {
        animate = false,
        duration = ANIMATION.DURATION.DEFAULT,
        ease = ANIMATION.EASE.SMOOTH,
        timeline = null,
        position = 0,
        onComplete = null
    } = {}) {
        const target = clampCenter(x, y);

        if (!animate) {
            this.stopMoving();
            this.place(target.x, target.y);
            onComplete?.();
            return null;
        }

        // Already heading there: nothing to do. (Not for timeline moves, which
        // are scheduled steps, e.g. "out to here, then back".)
        if (!timeline && this.moveTween && this.moveTarget &&
            Math.abs(this.moveTarget.x - target.x) < 0.5 && Math.abs(this.moveTarget.y - target.y) < 0.5) {
            return this.moveTween;
        }

        const progress = { t: 0 };
        let start;
        const tween = gsap.to(progress, {
            t: 1,
            duration,
            ease,
            onStart: () => {
                if (this.moveTween !== tween) this.stopMoving();
                this.moveTween = tween;
                this.moveTarget = target;
                this.updateDraggable();
                start = { x: this.centerX, y: this.centerY };
            },
            onUpdate: () => {
                // GSAP renders tweens added to a timeline once at progress 0
                // before onStart; ignore that until the move really begins
                if (!start) return;
                this.place(
                    start.x + (target.x - start.x) * progress.t,
                    start.y + (target.y - start.y) * progress.t
                );
            },
            onComplete: () => {
                if (this.moveTween === tween) {
                    this.moveTween = null;
                    this.moveTarget = null;
                    this.updateDraggable();
                }
                onComplete?.();
            }
        });
        if (timeline) {
            // Starts when the timeline reaches it; onStart takes over then
            timeline.add(tween, position);
        } else {
            // Starts next frame, but it replaces any current move now, so
            // targetX/targetY are right immediately
            this.stopMoving();
            this.moveTween = tween;
            this.moveTarget = target;
            this.updateDraggable();
        }
        return tween;
    }

    /** Where the square is headed (or where it is, if it isn't moving). */
    get targetX() {
        return this.moveTarget?.x ?? this.centerX;
    }

    get targetY() {
        return this.moveTarget?.y ?? this.centerY;
    }

    get isMoving() {
        return !!this.moveTween;
    }

    /** Stops any move in flight, leaving the square where it is. */
    stopMoving() {
        this.moveTween?.kill();
        this.moveTween = null;
        this.moveTarget = null;
        this.updateDraggable();
    }

    /** Prevents the user from dragging this square until unlock(). */
    lock() {
        this.locked = true;
        this.updateDraggable();
    }

    unlock() {
        this.locked = false;
        this.updateDraggable();
    }

    /** Draggable is enabled only when the square is neither locked nor moving. */
    updateDraggable() {
        if (!this.draggable) return;
        if (this.locked || this.isMoving) this.draggable.disable();
        else this.draggable.enable();
    }

    /** Its size on screen (and for overlaps): SQUARE_SIZE times its scale. */
    get size() {
        return SQUARE_SIZE * this.scale;
    }

    /**
     * Sets the square's scale (1, or LOOSE_SCALE outside the main palette).
     * Scales around the center, so centerX/centerY don't change.
     */
    setScale(scale, { animate = true } = {}) {
        if (Math.abs(scale - this.scale) < 1e-6) return;
        this.scale = scale;
        const vars = { scale: this.drawnScale(), overwrite: 'auto' };
        if (animate) gsap.to(this.element, { ...vars, duration: ANIMATION.DURATION.FAST, ease: ANIMATION.EASE.DEFAULT });
        else gsap.set(this.element, vars);
    }

    /** Scale including the slight lift while pressed. */
    drawnScale() {
        return this.scale * (this.pressed ? STYLE.PRESS_SCALE : 1);
    }

    /** Lifts the square (shadow + slight scale), as when it's grabbed. */
    showPressed(pressed) {
        this.pressed = pressed;
        gsap.to(this.element, {
            duration: ANIMATION.DURATION.FAST,
            boxShadow: pressed ? STYLE.SHADOW.ACTIVE : STYLE.SHADOW.DEFAULT,
            scale: this.drawnScale(),
            ease: ANIMATION.EASE.DEFAULT,
            overwrite: 'auto'
        });
    }

    /**
     * Limits how far this square can be dragged, as a range for its center
     * (e.g. so a group it leads stays inside the container). null restores the
     * usual limit: the container.
     * @param {{minX, maxX, minY, maxY}|null} centerBounds
     */
    setDragBounds(centerBounds) {
        if (!this.draggable) return;
        if (!centerBounds && !this.hasGroupBounds) return; // Already the usual limit
        this.hasGroupBounds = !!centerBounds;
        this.draggable.applyBounds(centerBounds ? {
            minX: centerBounds.minX - SQUARE_CENTER,
            maxX: centerBounds.maxX - SQUARE_CENTER,
            minY: centerBounds.minY - SQUARE_CENTER,
            maxY: centerBounds.maxY - SQUARE_CENTER
        } : store.container);
    }

    /** Changes the square's color (e.g. from the sliders); overlaps and blends use the new one from now on. */
    setColor(oklch) {
        if (!oklch) return;
        this.oklch = oklch;
        this.element.style.backgroundColor = toCss(oklch);
    }

    /** Draws the square above the others (while it's being dragged), or back at the base level. */
    raise(raised) {
        this.element.style.zIndex = `${raised ? STYLE.ZINDEX.DRAGGING : STYLE.ZINDEX.BASE}`;
    }

    /** Fades the square in (used for squares created by a join). */
    fadeIn(duration = ANIMATION.DURATION.FADE) {
        gsap.fromTo(this.element, { opacity: 0 }, {
            opacity: 1,
            duration,
            ease: ANIMATION.EASE.DEFAULT
        });
    }

    /** Creates this square's Draggable. The only place a Draggable is created. */
    enableDragging() {
        Draggable.get(this.element)?.kill();

        const square = this;
        const el = this.element;
        let origin = null;

        [this.draggable] = Draggable.create(el, {
            type: 'left,top',
            bounds: store.container,
            inertia: false,
            cursor: 'grab',
            activeCursor: 'grabbing',

            onPress() {
                square.showPressed(true);
                hooks.onPress(square, this.pointerEvent);
            },
            onRelease() {
                square.showPressed(false);
                hooks.onRelease(square);
            },

            onDragStart() {
                origin = { x: square.centerX, y: square.centerY };
                square.raise(true);
                store.interaction.draggingId = square.id;
                hooks.onDragStart(square, origin);
            },

            onDrag() {
                // Draggable has already moved the element; record where it's drawn
                square.syncFromElement();
                hooks.onDrag(square, origin);
            },

            onDragEnd() {
                square.syncFromElement();
                square.raise(false);
                store.interaction.draggingId = null;
                hooks.onDragEnd(square, origin);
            }
        });

        this.updateDraggable();
    }

    /** Removes the square from the DOM and the store. */
    remove() {
        this.draggable?.kill();
        this.draggable = null;
        this.stopMoving();
        gsap.killTweensOf(this.element);
        this.element.remove();
        store.remove(this.id);
    }
}

/**
 * Creates a draggable square on the canvas. The only way squares are created.
 *
 * @param {object} p
 * @param {object} p.oklch - Color in OKLCH (from palette.js).
 * @param {number} p.centerX
 * @param {number} p.centerY
 * @param {number} [p.id] - Defaults to the next unused id.
 * @returns {Square}
 */
export function createSquare({ oklch, centerX, centerY, id = store.nextId() }) {
    if (!store.container) throw new Error('[square.js] store.container is not set');
    if (!oklch) throw new Error(`[square.js] Square ${id} needs a color`);

    const square = new Square({ id, oklch });
    store.add(square);
    store.container.appendChild(square.element);
    square.moveTo(centerX, centerY);
    square.enableDragging();

    log(`[square.js] Created square ${id} at (${square.centerX}, ${square.centerY})`);
    return square;
}
