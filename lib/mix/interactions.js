// interactions.js
//
// What dragging does. Decisions come from geometry.js; this module applies
// them by asking squares to move, updating the overlap preview, and starting
// joins and inserts. Registered with square.js via setSquareHooks().
//
// On every frame of a drag, the rest of the layout is recomputed from where
// squares were when the drag started (geometry.dragLayout), so gap closing,
// the insert magnet, and the nudge never fight each other or drift.

import gsap from 'gsap';
import { store } from './store.js';
import { blend } from './palette.js';
import { overlap, bestOverlap, inRow, rowCenter, gapCloseTargets, dragLayout, insertLayout, joinSide, paletteRow, groupDeltaBounds, attraction } from './geometry.js';
import { select, toggle, inGroup, selectedSquares, refreshBounds } from './selection.js';
import { setSquareHooks } from './square.js';
import { join } from './join.js';
import * as overlapView from './overlap-view.js';
import { JOIN, ROW, ANIMATION, LOOSE_SCALE, FEATURES } from './constants.js';

/**
 * Updates the overlap preview for `active` against whichever square it
 * overlaps most, and tracks whether releasing now would join. Near a seam
 * (store.interaction.insertion), inserting wins: no preview, no join.
 *
 * @param {Array} [against] - Positions to measure the join threshold against.
 *   During a drag these are where squares rest (before the nudge pushes them),
 *   so a square being pushed away doesn't make joining harder.
 */
export function updatePreview(active, against = store.all()) {
    const { interaction } = store;
    if (interaction.isJoining) return; // The join animation owns the preview

    const best = interaction.insertion || interaction.isSettling ? null : bestOverlap(active, against);
    if (!best) {
        overlapView.hide();
        interaction.thresholdActive = false;
        interaction.joinTarget = null;
        return;
    }

    const { percent } = best.overlap;
    if (percent >= JOIN.ACTIVATE) interaction.thresholdActive = true;
    else if (percent <= JOIN.DEACTIVATE) interaction.thresholdActive = false;
    interaction.joinTarget = best.square.id;

    // Draw the overlap you actually see (the target may be mid-push)
    const target = store.get(best.square.id);
    overlapView.show(overlap(active, target) || best.overlap, blend(active.oklch, target.oklch), interaction.thresholdActive);
}

// Snapshot taken when a drag starts: every other square's position, and the
// center of the row the dragged square started in
let dragStart = null;

// While the covered square plays its relent (push out to the peak, then ease
// back), nothing else moves it: { id, timeline }
let relent = null;

/**
 * At the moment the threshold is met: the covered square reaches the peak of
 * the push (quickly, if it wasn't there yet, e.g. after a fast drag), then
 * relents toward the dragged square, fast then slowing to a stop.
 */
function playRelent(sq, apex, x, y) {
    stopRelent();
    const timeline = gsap.timeline({ onComplete: () => { relent = null; } });
    if (Math.hypot(sq.centerX - apex.x, sq.centerY - apex.y) > 2) {
        sq.moveTo(apex.x, apex.y, { animate: true, duration: ANIMATION.DURATION.PUSH_OUT, ease: ANIMATION.EASE.DEFAULT, timeline, position: 0 });
    }
    sq.moveTo(x, y, { animate: true, duration: ANIMATION.DURATION.SNAP, ease: ANIMATION.EASE.SNAP, timeline, position: '>' });
    relent = { id: sq.id, timeline };
}

/** Cancels a relent in progress, leaving the square where it is. */
function stopRelent() {
    if (!relent) return;
    relent.timeline.kill();
    store.get(relent.id)?.stopMoving();
    relent = null;
}

// Where the other squares rest on this frame of the drag, before the magnet
// and nudge offsets (from geometry.dragLayout). The join threshold is measured
// against it: the push grows until exactly that moment, then becomes a pull.
let dragRest = null;

// The settle timeline in progress (an insert, a stick, or a return to start), if any
let settling = null;

// During a drag: the flush spot the dragged square is drawn to on this frame
// (geometry.attraction), or null. On release in that zone, it settles there.
let attracted = null;

/**
 * Draws the dragged square toward the flush spot beside a nearby square it
 * will connect to (a little, never far from the pointer; all the way when
 * close). Not near a seam: inserting wins there.
 */
function applyAttraction(square) {
    attracted = store.interaction.insertion ? null : attraction(square, dragRest || []);
    if (!attracted) return;
    const { dx, dy } = attracted.draw;
    square.place(square.centerX + dx, square.centerY + dy);
}

/** Settles the dragged square flush against the square it's drawn to. */
function stick(square, spot) {
    settle(square, [{ id: square.id, x: spot.x, y: spot.y }], {
        duration: ANIMATION.DURATION.STICK,
        ease: ANIMATION.EASE.STICK
    });
}

/**
 * Sizes every square: full size in the main palette (geometry.paletteRow),
 * LOOSE_SCALE outside it. A square being dragged counts as in the palette
 * only if it started there and hasn't left its row.
 */
export function updateSizes() {
    const dragged = store.get(store.interaction.draggingId);
    const others = store.all().filter(sq => sq !== dragged);
    // During a drag, judge rows by where squares rest, not where the nudge has
    // pushed them (a pushed row square hasn't left its row)
    const positions = dragRest || others.map(sq => ({ id: sq.id, centerX: sq.targetX, centerY: sq.targetY }));
    const members = paletteRow(positions);
    const animate = store.ready;
    for (const sq of others) sq.setScale(members.has(sq.id) ? 1 : LOOSE_SCALE, { animate });
    if (dragged && dragStart) {
        const inPalette = dragStart.startedInPalette && !dragStart.originClosed;
        dragged.setScale(inPalette ? 1 : LOOSE_SCALE, { animate });
    }
}

/**
 * Moves every other square to where it should be for this frame of the drag.
 * With nudge: false (on release), nudged squares spring back. With
 * thresholdJustMet, the covered square plays its relent.
 */
function layoutDuringDrag(square, origin, { nudge = true, thresholdJustMet = false } = {}) {
    const { targets, rest, insertion, originClosed, push } = dragLayout({
        others: dragStart.others,
        dragged: square,
        originY: origin.y,
        originRowCenter: dragStart.originRowCenter,
        keepOriginClosed: dragStart.originClosed,
        nudge: nudge && FEATURES.PUSH,
        snapped: store.interaction.thresholdActive,
        heldPush: dragStart.heldPush
    });
    dragStart.originClosed = originClosed;
    if (!store.interaction.thresholdActive) dragStart.push = push;
    dragRest = rest;
    store.interaction.rest = rest;
    store.interaction.insertion = insertion;

    for (const { id, x, y, follows, pulled, apex } of targets) {
        const sq = store.get(id);
        if (pulled && apex && thresholdJustMet) {
            playRelent(sq, apex, x, y);
            continue;
        }
        if (relent?.id === id) continue; // Let the relent play out
        if (Math.abs(sq.targetX - x) < 0.5 && Math.abs(sq.targetY - y) < 0.5) continue;
        // Being pulled in (threshold met) gets a snappy overshoot; magnet and
        // nudge track the pointer, so they're quick; closing gaps and springing
        // back are relaxed
        sq.moveTo(x, y, {
            animate: true,
            duration: pulled ? ANIMATION.DURATION.SNAP : follows ? ANIMATION.DURATION.FAST : ANIMATION.DURATION.DEFAULT,
            ease: pulled ? ANIMATION.EASE.SNAP : ANIMATION.EASE.SMOOTH
        });
    }
}

/**
 * Animates squares to new positions after a release (an insert, or a return
 * to start), with the overlap preview off while they slide past each other.
 * @param {Square} square - The square that was dragged.
 * @param {Array<{id, x, y}>} moves
 */
function settle(square, moves, { onComplete = null, duration, ease } = {}) {
    const { interaction } = store;
    interaction.isSettling = true;
    interaction.insertion = null;
    overlapView.hide();

    settling?.kill();
    const timeline = gsap.timeline({
        onComplete: () => {
            settling = null;
            interaction.isSettling = false;
            updatePreview(square);
            onComplete?.();
            store.changed();
        }
    });
    settling = timeline;
    for (const { id, x, y } of moves) {
        store.get(id).moveTo(x, y, { animate: true, timeline, position: 0, duration, ease });
    }
}

/**
 * Where a row the dragged square is joining or being inserted into should be
 * centered afterwards: where it was before the drag. If the square started in
 * that row, that's the row's center with it still in place (it may have been
 * dragged along the row without leaving it). Otherwise undefined: the row
 * centers on where it rests now (join.js / insertLayout decide).
 */
function rowCenterBefore(rowY, origin) {
    return Math.abs(rowY - origin.y) < ROW.THRESHOLD ? dragStart.originRowCenter : undefined;
}

/** Slides the dragged square into the seam and closes the row up around it. */
function insert(square, insertion, origin) {
    // The row grows by one but stays centered where it was, as after a join
    const centerX = rowCenterBefore(insertion.rowY, origin) ?? rowCenter(insertion.row);
    const layout = insertLayout(insertion, square.id, centerX);
    settle(square, layout.map(({ id, x }) => ({ id, x, y: insertion.rowY })));
}

/**
 * Undoes the drag: the dragged square goes back to where it started, and
 * everything the drag moved (a closed-up row, nudges) goes back too.
 */
function returnToStart(square, origin) {
    settle(square, [
        { id: square.id, x: origin.x, y: origin.y },
        ...dragStart.others.map(sq => ({ id: sq.id, x: sq.centerX, y: sq.centerY }))
    ]);
}

// During a group drag (dragging one of several selected squares), where each
// selected square started: [{ sq, x, y }]
let group = null;

// The other selected squares lifted along with the pressed one
let liftedWithPress = [];

/**
 * Removes squares (e.g. the selection, on Delete). Each row they leave closes
 * up around where it was, as when a square is dragged out of it. Ignored
 * while a drag, join, or settle is in progress.
 * @returns {number[]} The ids actually removed.
 */
export function removeSquares(ids) {
    const { interaction } = store;
    if (interaction.draggingId !== null || interaction.isJoining || interaction.isSettling) return [];
    const going = ids.map(id => store.get(id)).filter(Boolean);
    if (!going.length) return [];

    // The rows they're leaving, as they are now
    const rows = [];
    for (const sq of going) {
        if (!rows.some(r => Math.abs(r.y - sq.targetY) < ROW.THRESHOLD)) {
            const members = inRow(store.all(), sq.targetY);
            rows.push({ y: sq.targetY, centerX: rowCenter(members.map(m => ({ x: m.targetX }))) });
        }
    }

    const goingIds = new Set(going.map(sq => sq.id));
    for (const sq of going) {
        store.selection.delete(sq.id);
        if (interaction.lastDraggedId === sq.id) interaction.lastDraggedId = null;
        if (interaction.joinTarget === sq.id) interaction.joinTarget = null;
        sq.remove({ fade: ANIMATION.DURATION.REMOVE });
    }

    for (const row of rows) {
        const left = inRow(store.all(), row.y).filter(sq => !goingIds.has(sq.id));
        const slots = left.map(sq => ({ id: sq.id, x: sq.targetX }));
        for (const { id, x } of gapCloseTargets(slots, row.centerX)) {
            store.get(id).moveTo(x, row.y, { animate: true });
        }
    }

    overlapView.hide();
    interaction.thresholdActive = false;
    updateSizes();
    refreshBounds();
    store.changed();
    return [...goingIds];
}

/** Stops any drag or settle in progress and forgets it (when the engine is destroyed). */
export function reset() {
    stopRelent();
    settling?.kill();
    settling = null;
    attracted = null;
    dragStart = null;
    dragRest = null;
    group = null;
    liftedWithPress = [];
}

/**
 * Limits how far a pressed square can be dragged so its whole group stays
 * inside the container (keeping its shape); no group, the usual limit. Set on
 * press: changing a Draggable's limits mid-drag makes it lose the movement so far.
 */
function limitDragToGroup(square) {
    if (!inGroup(square.id)) {
        square.setDragBounds(null);
        return;
    }
    const { dxMin, dxMax, dyMin, dyMax } = groupDeltaBounds(selectedSquares());
    square.setDragBounds({
        minX: square.centerX + dxMin, maxX: square.centerX + dxMax,
        minY: square.centerY + dyMin, maxY: square.centerY + dyMax
    });
}

/** Starts dragging every selected square together, all drawn above the rest. */
function startGroupDrag(square, origin) {
    group = selectedSquares().map(sq => ({ sq, x: sq === square ? origin.x : sq.targetX, y: sq === square ? origin.y : sq.targetY }));
    group.forEach(({ sq }) => sq.raise(true));
}

/** Moves the rest of the group by however far the dragged square has moved. */
function moveGroup(square, origin) {
    const dx = square.centerX - origin.x;
    const dy = square.centerY - origin.y;
    for (const { sq, x, y } of group) {
        if (sq !== square) sq.moveTo(x + dx, y + dy);
    }
}

/**
 * Ends a group drag. Dropped on top of other squares, the whole group goes
 * back where it started; otherwise it stays. (Groups don't join, insert, or
 * close row gaps yet.)
 */
function endGroupDrag(square) {
    // (Its drag limits are reset on the next press: resetting them now, while
    // it's still scaled up from being pressed, would nudge it off its spot.)
    const ids = new Set(group.map(({ sq }) => sq.id));
    const others = store.all().filter(sq => !ids.has(sq.id));
    const members = group.map(({ sq }) => sq);
    const lower = () => members.forEach(sq => sq.raise(false));
    if (group.some(({ sq }) => bestOverlap(sq, others))) {
        // Stay on top while sliding back over the other squares
        settle(square, group.map(({ sq, x, y }) => ({ id: sq.id, x, y })), { onComplete: lower });
    } else {
        lower();
        store.changed();
    }
    group = null;
}

setSquareHooks({
    // Figma-style: pressing a square selects it (Shift adds or removes it).
    // Pressing a square that's already selected keeps the selection, so the
    // whole group can be dragged.
    onPress(square, event) {
        if (event?.shiftKey) toggle(square.id);
        else if (!store.selection.has(square.id)) select([square.id]);
        limitDragToGroup(square);
        // Grabbing one of a selected group lifts the whole group (shadow and all)
        liftedWithPress = inGroup(square.id) ? selectedSquares().filter(sq => sq !== square) : [];
        liftedWithPress.forEach(sq => sq.showPressed(true));
    },

    onRelease() {
        liftedWithPress.forEach(sq => sq.showPressed(false));
        liftedWithPress = [];
    },

    onDragStart(square, origin) {
        if (inGroup(square.id)) {
            store.interaction.lastDraggedId = null;
            startGroupDrag(square, origin);
            return;
        }
        store.interaction.lastDraggedId = square.id;
        const others = store.all()
            .filter(sq => sq.id !== square.id)
            .map(sq => ({ id: sq.id, centerX: sq.targetX, centerY: sq.targetY, size: sq.size }));
        const startedInPalette = paletteRow(store.all().map(sq => ({ id: sq.id, centerX: sq.targetX, centerY: sq.targetY }))).has(square.id);
        const originRow = inRow([...others, { id: square.id, centerX: origin.x, centerY: origin.y }], origin.y);
        dragStart = {
            others,
            originRowCenter: rowCenter(originRow.map(sq => ({ x: sq.centerX }))),
            originClosed: false, // Once the square leaves its row, the row stays closed for this drag
            startedInPalette
        };
    },

    onDrag(square, origin) {
        if (group) {
            moveGroup(square, origin);
            refreshBounds();
            return;
        }
        const wasActive = store.interaction.thresholdActive;
        layoutDuringDrag(square, origin);
        applyAttraction(square); // Before the preview, which shows what you see
        updateSizes();
        updatePreview(square, dragRest);
        refreshBounds(); // The dragged square is selected (pressing selects); its box follows
        // Threshold just met: the target relents from where it was pushed, and
        // holds there. Lost: it's pushed again.
        if (store.interaction.thresholdActive !== wasActive) {
            const met = store.interaction.thresholdActive;
            dragStart.heldPush = met ? dragStart.push : null;
            if (!met) stopRelent();
            layoutDuringDrag(square, origin, { thresholdJustMet: met });
        }
    },

    onDragEnd(square, origin) {
        if (group) {
            endGroupDrag(square);
            updateSizes();
            return;
        }
        // Decide from what the user saw on the last frame of the drag
        const { interaction } = store;
        const target = store.get(interaction.joinTarget);
        const thresholdMet = interaction.thresholdActive;
        // Squares spring back to where they rest, so check what it would land on
        const landsOn = bestOverlap(square, dragRest || []);
        const spot = attracted;
        attracted = null;
        stopRelent();
        layoutDuringDrag(square, origin, { nudge: false });

        if (interaction.insertion) {
            insert(square, interaction.insertion, origin);
        } else if (thresholdMet && target && !interaction.isJoining) {
            // Lay out from where the target is headed (its resting place), not
            // where it is mid-nudge
            const resting = { id: target.id, centerX: target.targetX, centerY: target.targetY };
            const side = joinSide(origin.x, square.centerX, target.targetX, JOIN.ACTIVE_SIDE);
            join(square, target, overlap(square, resting) || overlap(square, target), side, rowCenterBefore(target.targetY, origin));
        } else if (spot) {
            // Close beside a square and more than half aligned with it: it connects
            stick(square, spot);
        } else if (target || landsOn) {
            // Dropped on another square (or where one will spring back to)
            // without enough overlap to join: undo
            returnToStart(square, origin);
        }
        dragStart = null;
        dragRest = null;
        interaction.rest = null;
        if (!interaction.isJoining && !interaction.isSettling) {
            updatePreview(square);
            store.changed(); // A plain drop; joins and settles report when their animation ends
        }
        updateSizes();
        refreshBounds();
    },

    // Squares animating after a release (row shifts) can change the overlap
    // with the last dragged square; keep its preview in sync
    onMoved() {
        updateSizes();
        refreshBounds();
        const { interaction } = store;
        if (interaction.draggingId !== null || interaction.isJoining || interaction.isSettling) return;
        const active = store.get(interaction.lastDraggedId);
        if (active) updatePreview(active);
    }
});
