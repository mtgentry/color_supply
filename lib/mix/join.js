// join.js
//
// Runs the join animation: the overlap preview grows into the new square's
// slot, the row moves apart to make room, and a square with the blended color
// appears. Positions come from geometry.joinLayout(); all movement goes
// through square.moveTo().

import gsap from 'gsap';
import { store } from './store.js';
import { blend } from './palette.js';
import { inRow, rowCenter, joinLayout } from './geometry.js';
import { createSquare } from './square.js';
import * as overlapView from './overlap-view.js';
import { ANIMATION } from './constants.js';

/**
 * Joins the dragged square with the square it was dropped on.
 * @param {Square} active - The dragged square.
 * @param {Square} inactive - The square it was dropped on.
 * @param {{left, width}} rect - Their overlap (from geometry.overlap()).
 * @param {'left'|'right'} activeSide - Side of the new square the dragged
 *   square lands on (from geometry.joinSide()).
 * @param {number} [centerX] - Where to center the row afterwards. Default:
 *   where the row (without the dragged square) is centered now.
 */
let current = null; // The join timeline in progress, if any
let moving = [];    // The squares it locked

/**
 * Stops a join in progress, leaving no new square (when the engine is
 * destroyed, or the canvas reloaded, mid-join).
 */
export function reset() {
    if (!current) return;
    current.kill();
    current = null;
    moving.forEach(sq => sq.unlock());
    moving = [];
    overlapView.hide();
    Object.assign(store.interaction, { isJoining: false, thresholdActive: false, joinTarget: null });
}

export function join(active, inactive, rect, activeSide, centerX) {
    const { interaction } = store;
    interaction.isJoining = true;

    const rowY = inactive.targetY; // Where it's headed, not mid-nudge
    const others = inRow(store.all(), rowY, [active.id, inactive.id])
        .map(sq => ({ id: sq.id, x: sq.targetX }));
    const { slotX, targets } = joinLayout({
        others,
        inactiveId: inactive.id,
        activeId: active.id,
        slotX: rect.left + rect.width / 2,
        activeSide,
        // The row grows by two but stays centered where it was (the world can
        // be bigger than the screen, so the canvas center isn't a landmark)
        centerX: centerX ?? rowCenter([...others, { x: inactive.targetX }])
    });
    moving = targets.map(t => store.get(t.id));
    const blended = blend(active.oklch, inactive.oklch);

    moving.forEach(sq => sq.lock());

    const timeline = gsap.timeline({
        onComplete: () => {
            current = null;
            moving.forEach(sq => sq.unlock());
            moving = [];
            overlapView.hide();
            createSquare({ oklch: blended, centerX: slotX, centerY: rowY }).fadeIn(ANIMATION.JOIN.FADE_IN);
            interaction.isJoining = false;
            interaction.thresholdActive = false;
            interaction.joinTarget = null;
            store.changed();
        }
    });

    current = timeline;
    overlapView.animateIntoSlot(timeline, { x: slotX, y: rowY });
    targets.forEach(t => {
        store.get(t.id).moveTo(t.x, rowY, { animate: true, duration: ANIMATION.JOIN.MOVE, timeline, position: 0 });
    });
}
