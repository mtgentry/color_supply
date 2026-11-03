// geometry.js
//
// Pure layout math: overlaps, rows, gap closing, joins, and inserting.
// No DOM, no GSAP, no state. Every function takes plain data and returns
// plain data, so the rules can be unit-tested in Node (tests/unit).
//
// Squares here are anything with { id, centerX, centerY }. Positions returned
// are square centers in container coordinates.

import { SQUARE_SIZE, SQUARE_CENTER, CONTAINER, ROW, INSERT, NUDGE } from './constants.js';

/** Clamps a center so the whole square stays inside the container. */
export function clampCenter(x, y) {
    return {
        x: Math.min(Math.max(x, SQUARE_CENTER), CONTAINER.WIDTH - SQUARE_CENTER),
        y: Math.min(Math.max(y, SQUARE_CENTER), CONTAINER.HEIGHT - SQUARE_CENTER)
    };
}

/**
 * The overlapping rectangle of two squares. Squares can have a `size`
 * (defaults to SQUARE_SIZE), e.g. smaller loose squares.
 * @returns {{left, top, width, height, percent}|null} percent is the overlap
 *   as a share of the smaller square's area (0-100). null if they don't overlap.
 */
export function overlap(a, b) {
    const sa = a.size ?? SQUARE_SIZE;
    const sb = b.size ?? SQUARE_SIZE;
    const left = Math.max(a.centerX - sa / 2, b.centerX - sb / 2);
    const right = Math.min(a.centerX + sa / 2, b.centerX + sb / 2);
    const top = Math.max(a.centerY - sa / 2, b.centerY - sb / 2);
    const bottom = Math.min(a.centerY + sa / 2, b.centerY + sb / 2);
    const width = right - left;
    const height = bottom - top;
    if (width <= 0 || height <= 0) return null;
    return {
        left,
        top,
        width,
        height,
        percent: (width * height) / Math.min(sa * sa, sb * sb) * 100
    };
}

/**
 * The main palette: the row with the most squares (the topmost one if tied).
 * @returns {Set} ids of the squares in it.
 */
export function paletteRow(squares) {
    const rows = [];
    for (const sq of [...squares].sort((a, b) => a.centerY - b.centerY)) {
        const row = rows.find(r => Math.abs(r.y - sq.centerY) < ROW.THRESHOLD);
        if (row) row.ids.push(sq.id);
        else rows.push({ y: sq.centerY, ids: [sq.id] });
    }
    let best = null;
    for (const row of rows) if (!best || row.ids.length > best.ids.length) best = row;
    return new Set(best ? best.ids : []);
}

/**
 * The square that `active` overlaps the most.
 * @returns {{square, overlap}|null}
 */
export function bestOverlap(active, squares) {
    let best = null;
    for (const square of squares) {
        if (square.id === active.id) continue;
        const o = overlap(active, square);
        if (o && (!best || o.percent > best.overlap.percent)) best = { square, overlap: o };
    }
    return best;
}

/** Squares in the row at rowY (minus excludeIds), sorted left to right. */
export function inRow(squares, rowY, excludeIds = []) {
    return squares
        .filter(sq => !excludeIds.includes(sq.id) && Math.abs(sq.centerY - rowY) < ROW.THRESHOLD)
        .sort((a, b) => a.centerX - b.centerX);
}

/**
 * Whether dragging a square should close a gap in the row it started in:
 * it has been dragged off the row, or the row now has a gap wider than
 * ROW.GAP_TRIGGER.
 * @param {object} dragged - The dragged square's current position.
 * @param {number} originY - The row the drag started in.
 * @param {Array} rowSquares - Squares in that row (including the dragged one).
 */
export function shouldCloseGap(dragged, originY, rowSquares) {
    if (Math.abs(dragged.centerY - originY) > ROW.LEAVE_DISTANCE) return true;
    const sorted = [...rowSquares].sort((a, b) => a.centerX - b.centerX);
    for (let i = 1; i < sorted.length; i++) {
        if (sorted[i].centerX - sorted[i - 1].centerX > ROW.GAP_TRIGGER) return true;
    }
    return false;
}

/**
 * The center of a row: midway between its leftmost and rightmost squares.
 * @param {Array<{x}>} slots - Row squares (any order).
 */
export function rowCenter(slots) {
    const xs = slots.map(s => s.x);
    return (Math.min(...xs) + Math.max(...xs)) / 2;
}

/**
 * Where the squares left in a row should go after one leaves it: side by side,
 * ROW.SPACING apart, centered on the row's original center. This closes a gap
 * in the middle and re-centers the row when a square leaves from either end.
 *
 * @param {Array<{id, x}>} slots - Squares still in the row, sorted by x.
 * @param {number} centerX - The row's center before the square left.
 * @returns {Array<{id, x}>} Only the squares that need to move (none if the
 *   row is already in place).
 */
export function gapCloseTargets(slots, centerX) {
    const xs = rowSlots(slots.length, centerX);
    return slots
        .map((s, i) => ({ id: s.id, x: xs[i] }))
        .filter((t, i) => Math.abs(t.x - slots[i].x) > 0.5);
}

/**
 * Where `count` squares go to sit side by side, ROW.SPACING apart, centered
 * on centerX (shifted as a whole to fit the container).
 * @returns {number[]} x positions, left to right.
 */
export function rowSlots(count, centerX) {
    const first = centerX - (count - 1) / 2 * ROW.SPACING;
    return fitRow(Array.from({ length: count }, (_, i) => first + i * ROW.SPACING));
}

/**
 * Shifts a left-to-right list of x positions as a whole so none hangs off the
 * container (if the row fits at all).
 */
export function fitRow(xs) {
    const min = SQUARE_CENTER;
    const max = CONTAINER.WIDTH - SQUARE_CENTER;
    let shift = 0;
    if (xs[0] < min) shift = min - xs[0];
    else if (xs[xs.length - 1] > max) shift = max - xs[xs.length - 1];
    return xs.map(x => x + shift);
}

/**
 * Which side of the new square the dragged square should land on after a
 * join: the side of the target it was dropped on (overlapping the target's
 * left half puts it on the left). Dropped dead center: the side it came
 * from; if it came from directly above or below too, `fallback`.
 * @param {number} originX - Dragged square's x when the drag started.
 * @param {number} releaseX - Dragged square's x on release.
 * @param {number} targetX - The target square's (resting) x.
 * @returns {'left'|'right'}
 */
export function joinSide(originX, releaseX, targetX, fallback = 'right') {
    const TOLERANCE = 1;
    if (releaseX < targetX - TOLERANCE) return 'left';
    if (releaseX > targetX + TOLERANCE) return 'right';
    if (originX < targetX - TOLERANCE) return 'left';
    if (originX > targetX + TOLERANCE) return 'right';
    return fallback;
}

/**
 * Row layout after a join. The new square takes a slot at slotX, the two
 * joined squares sit either side of it, and the rest of the row moves left or
 * right to make room, ROW.SPACING apart.
 *
 * @param {object} p
 * @param {Array<{id, x}>} p.others - Other squares in the row.
 * @param {number} p.inactiveId - The square that was dropped onto.
 * @param {number} p.activeId - The square that was dragged.
 * @param {number} p.slotX - Where the new square should go (center of the overlap).
 * @param {'left'|'right'} [p.activeSide='right'] - Side of the new square the
 *   dragged square lands on.
 * @param {number} [p.centerX] - If given, the whole row is shifted so it's
 *   centered here (e.g. the middle of the canvas).
 * @returns {{slotX: number, targets: Array<{id, x}>}} slotX is the new
 *   square's final x (after centering and fitting the row into the container).
 */
export function joinLayout({ others, inactiveId, activeId, slotX, activeSide = 'right', centerX }) {
    const left = others.filter(s => s.x < slotX).sort((a, b) => a.x - b.x);
    const right = others.filter(s => s.x >= slotX).sort((a, b) => a.x - b.x);
    const pair = activeSide === 'right' ? [inactiveId, activeId] : [activeId, inactiveId];

    const order = [...left.map(s => s.id), pair[0], 'slot', pair[1], ...right.map(s => s.id)];
    const slotIndex = order.indexOf('slot');
    let xs = order.map((_, i) => slotX + (i - slotIndex) * ROW.SPACING);
    if (centerX !== undefined) {
        const shift = centerX - (xs[0] + xs[xs.length - 1]) / 2;
        xs = xs.map(x => x + shift);
    }
    xs = fitRow(xs);

    return {
        slotX: xs[slotIndex],
        targets: order.map((id, i) => ({ id, x: xs[i] })).filter(t => t.id !== 'slot')
    };
}

/**
 * Where a dragged square would be inserted into a row: the seam between two
 * neighbors closest to it, if it's within INSERT.ZONE_X of the seam and
 * INSERT.ZONE_Y of the row.
 *
 * @param {object} dragged - The dragged square's current position.
 * @param {Array} squares - Every other square.
 * @returns {{row: Array<{id, x}>, index: number, seamX: number, rowY: number,
 *   strength: number}|null} row is the row's squares left to right; the dragged
 *   square would go at `index`. strength is 1 at the seam, falling to 0 at the
 *   edge of the zone.
 */
export function insertionPoint(dragged, squares) {
    const row = inRow(squares, dragged.centerY, [dragged.id]);
    let best = null;
    for (let i = 0; i < row.length - 1; i++) {
        const seamX = (row[i].centerX + row[i + 1].centerX) / 2;
        const rowY = (row[i].centerY + row[i + 1].centerY) / 2;
        const ax = Math.abs(dragged.centerX - seamX) / INSERT.ZONE_X;
        const ay = Math.abs(dragged.centerY - rowY) / INSERT.ZONE_Y;
        if (ax >= 1 || ay >= 1) continue;
        const strength = 1 - Math.max(ax, ay);
        if (!best || strength > best.strength) best = { index: i + 1, seamX, rowY, strength };
    }
    if (!best) return null;
    return { ...best, row: row.map(sq => ({ id: sq.id, x: sq.centerX })) };
}

/**
 * Row layout after inserting a square: it takes the seam, and the row closes
 * up around it, ROW.SPACING apart (shifted back inside the container if needed).
 * @param {{row: Array<{id, x}>, index: number, seamX: number}} insertion - From insertionPoint().
 * @param {number} draggedId
 * @param {number} [centerX] - If given, the whole row is shifted so it's
 *   centered here (e.g. the middle of the canvas).
 * @returns {Array<{id, x}>} Target x for every square in the row, including the dragged one.
 */
export function insertLayout({ row, index, seamX }, draggedId, centerX) {
    const order = [...row.slice(0, index).map(s => s.id), draggedId, ...row.slice(index).map(s => s.id)];
    let xs = order.map((_, i) => seamX + (i - index) * ROW.SPACING);
    if (centerX !== undefined) {
        const shift = centerX - (xs[0] + xs[xs.length - 1]) / 2;
        xs = xs.map(x => x + shift);
    }
    xs = fitRow(xs);
    return order.map((id, i) => ({ id, x: xs[i] }));
}

/** Edge-to-edge distance between two squares (negative when they overlap). */
export function edgeGap(a, b) {
    const half = ((a.size ?? SQUARE_SIZE) + (b.size ?? SQUARE_SIZE)) / 2;
    return Math.max(Math.abs(a.centerX - b.centerX), Math.abs(a.centerY - b.centerY)) - half;
}

/**
 * How far the nudge pushes a square, given how far the dragged square has
 * pushed into where it rests (`depth`: negative before contact). A light push
 * builds from NUDGE.RANGE out to NUDGE.CONTACT at contact (squared, so it
 * starts gently), then grows by NUDGE.GIVE per pixel of depth.
 */
export function pushAmount(depth) {
    if (depth <= -NUDGE.RANGE) return 0;
    if (depth <= 0) return NUDGE.CONTACT * ((depth + NUDGE.RANGE) / NUDGE.RANGE) ** 2;
    return NUDGE.CONTACT + NUDGE.GIVE * depth;
}

/**
 * The nudge (magnetic push). One square is pushed directly away from the
 * dragged square: the one it overlaps most, or else the nearest one within
 * NUDGE.RANGE of its edge, by pushAmount(). With `snapped` (the join
 * threshold is met), it relents: it holds NUDGE.SNAP closer than `heldPush`
 * (how far it had been pushed when the threshold was met), no matter how much
 * further the dragged square moves.
 * @param {Array} squares - Every other square, where they rest.
 * @returns {{id, dx: number, dy: number, amount: number, pulled: boolean,
 *   apex: {dx, dy}|null}|null} amount is how far it's pushed (before
 *   relenting, if snapped); apex is the offset at the peak of the push, before
 *   it relents (only when snapped).
 */
export function nudge(dragged, squares, { snapped = false, heldPush = null } = {}) {
    const best = bestOverlap(dragged, squares);
    let target = best?.square;
    const push = target ? pushAmount(-edgeGap(dragged, target)) : 0;
    let amount = snapped && target ? (heldPush ?? push) - NUDGE.SNAP : push;
    if (!target) {
        // Nearest by edge gap; on a tie (e.g. a neighbor's corner lines up with
        // the dragged square's edge), the closer center wins
        const centerDistance = sq => Math.hypot(sq.centerX - dragged.centerX, sq.centerY - dragged.centerY);
        let nearestGap = NUDGE.RANGE;
        for (const sq of squares) {
            if (sq.id === dragged.id) continue;
            const gap = edgeGap(dragged, sq);
            const closer = gap < nearestGap - 1e-9 ||
                (target && Math.abs(gap - nearestGap) <= 1e-9 && centerDistance(sq) < centerDistance(target));
            if (closer) {
                nearestGap = gap;
                target = sq;
            }
        }
        if (!target) return null;
        amount = pushAmount(-nearestGap);
    }
    const dx = target.centerX - dragged.centerX;
    const dy = target.centerY - dragged.centerY;
    const distance = Math.hypot(dx, dy);
    if (distance === 0) return null; // Exactly on top: no direction to push
    const pulled = snapped && !!best;
    const peak = pulled ? amount + NUDGE.SNAP : amount;
    return {
        id: target.id,
        dx: dx / distance * amount,
        dy: dy / distance * amount,
        amount: peak,
        pulled,
        apex: pulled ? { dx: dx / distance * peak, dy: dy / distance * peak } : null
    };
}

/**
 * Where every other square should be on this frame of a drag. Computed from
 * where squares were when the drag started (`others`), so the result depends
 * only on where the dragged square is now, and never drifts:
 *   1. If the dragged square has left its row (or `keepOriginClosed`, once
 *      it has left earlier in the drag), that row closes up around its
 *      original center (gapCloseTargets).
 *   2. If the dragged square is near a seam in a row, the magnet pushes the
 *      two squares either side of the seam apart (insertionPoint), each by up
 *      to INSERT.SPREAD / 2. The rest of the row stays put.
 *   3. Otherwise, the square it's pushing against leans slightly away from it,
 *      or snaps toward it if `snapped` (nudge()), unless `nudge` is false (on
 *      release, so it springs back).
 *
 * @param {object} p
 * @param {Array} p.others - Every other square as it was at drag start.
 * @param {object} p.dragged - The dragged square's current position.
 * @param {number} p.originY - The row the drag started in.
 * @param {number} p.originRowCenter - That row's center at drag start.
 * @param {boolean} [p.keepOriginClosed=false] - The origin row was closed
 *   earlier in this drag; keep it closed (so it doesn't flip back and forth).
 * @param {boolean} [p.nudge=true]
 * @param {boolean} [p.snapped=false] - The join threshold is met.
 * @param {number|null} [p.heldPush=null] - How far the target had been pushed
 *   when the threshold was met (it holds there, relented, while snapped).
 * @returns {{targets: Array<{id, x, y, follows, pulled, apex}>, rest: Array, insertion:
 *   object|null, originClosed: boolean, push: number}} push is how far the
 *   nudge is pushing its target this frame (0 if nothing is pushed). targets holds every other square's
 *   position for this frame; `follows` is true when it's offset by the magnet
 *   or nudge (so it tracks the pointer), `pulled` when it's being pulled in
 *   toward the dragged square (threshold met). rest is where the squares sit before
 *   those offsets (joins are measured against it). insertion is from
 *   insertionPoint() (against the closed-up layout), or null. originClosed
 *   says whether the origin row closed.
 */
export function dragLayout({ others, dragged, originY, originRowCenter, keepOriginClosed = false, nudge: withNudge = true, snapped = false, heldPush = null }) {
    const rest = others.map(sq => ({ id: sq.id, centerX: sq.centerX, centerY: sq.centerY, size: sq.size }));
    const byId = new Map(rest.map(sq => [sq.id, sq]));

    const originRow = inRow(rest, originY);
    const originClosed = originRow.length > 0 &&
        (keepOriginClosed || shouldCloseGap(dragged, originY, [...originRow, dragged]));
    if (originClosed) {
        const slots = originRow.map(sq => ({ id: sq.id, x: sq.centerX }));
        for (const t of gapCloseTargets(slots, originRowCenter)) byId.get(t.id).centerX = t.x;
    }

    const insertion = insertionPoint(dragged, rest);
    const offset = new Map();
    if (insertion) {
        const half = INSERT.SPREAD * insertion.strength / 2;
        offset.set(insertion.row[insertion.index - 1].id, { dx: -half, dy: 0 });
        offset.set(insertion.row[insertion.index].id, { dx: half, dy: 0 });
    }
    // The magnet already moves the squares at a seam, so no nudge there
    const pushed = withNudge && !insertion ? nudge(dragged, rest, { snapped, heldPush }) : null;
    if (pushed) offset.set(pushed.id, { dx: pushed.dx, dy: pushed.dy });

    return {
        targets: rest.map(sq => {
            const o = offset.get(sq.id) || { dx: 0, dy: 0 };
            return {
                id: sq.id,
                x: sq.centerX + o.dx,
                y: sq.centerY + o.dy,
                follows: !!(o.dx || o.dy),
                pulled: !!pushed?.pulled && pushed.id === sq.id,
                // Where it was at the peak of the push, before relenting
                apex: pushed?.apex && pushed.id === sq.id
                    ? { x: sq.centerX + pushed.apex.dx, y: sq.centerY + pushed.apex.dy }
                    : null
            };
        }),
        rest,
        insertion,
        originClosed,
        push: pushed ? pushed.amount : 0
    };
}

/**
 * The squares a selection rectangle touches (Figma-style: touching is enough).
 * @param {{left, top, right, bottom}} rect - In world coordinates.
 */
export function squaresInRect(squares, rect) {
    return squares.filter(sq => {
        const half = (sq.size ?? SQUARE_SIZE) / 2;
        return sq.centerX + half >= rect.left && sq.centerX - half <= rect.right &&
               sq.centerY + half >= rect.top && sq.centerY - half <= rect.bottom;
    });
}

/**
 * How far a group of squares can move together and all stay inside the
 * container: the range of offsets (dx, dy) to apply to every square.
 */
export function groupDeltaBounds(squares) {
    const min = SQUARE_CENTER;
    const maxX = CONTAINER.WIDTH - SQUARE_CENTER;
    const maxY = CONTAINER.HEIGHT - SQUARE_CENTER;
    return {
        dxMin: Math.max(...squares.map(sq => min - sq.centerX)),
        dxMax: Math.min(...squares.map(sq => maxX - sq.centerX)),
        dyMin: Math.max(...squares.map(sq => min - sq.centerY)),
        dyMax: Math.min(...squares.map(sq => maxY - sq.centerY))
    };
}
