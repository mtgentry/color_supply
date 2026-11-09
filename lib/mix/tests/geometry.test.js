// Unit tests for geometry.js (runs in Node). These are the layout rules:
// overlap, rows, gap closing, and where squares go after a join.
//   npm run test:unit

import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
    clampCenter, overlap, bestOverlap, inRow, rowCenter, shouldCloseGap, gapCloseTargets, fitRow, joinLayout,
    insertionPoint, insertLayout, dragLayout, nudge, joinSide, paletteRow, edgeGap, pushAmount,
    attraction, pullStrength,
    squaresInRect, groupDeltaBounds, rowSlots
} from '../geometry.js';
import { NUDGE, JOIN, STICK, ROW } from '../constants.js';

const sq = (id, centerX, centerY) => ({ id, centerX, centerY });
const xsById = targets => Object.fromEntries(targets.map(t => [t.id, t.x]));

test('clampCenter keeps the whole square in the 800x800 container', () => {
    assert.deepEqual(clampCenter(0, 0), { x: 50, y: 50 });
    assert.deepEqual(clampCenter(900, 900), { x: 750, y: 750 });
    assert.deepEqual(clampCenter(400, 300), { x: 400, y: 300 });
});

test('overlap: rectangle and percentage of one square', () => {
    const o = overlap(sq(1, 200, 200), sq(2, 200, 240));
    assert.deepEqual(o, { left: 150, top: 190, width: 100, height: 60, percent: 60 });
    assert.equal(overlap(sq(1, 200, 200), sq(2, 200, 200)).percent, 100);
});

test('overlap: touching edges or apart is no overlap', () => {
    assert.equal(overlap(sq(1, 200, 200), sq(2, 300, 200)), null);
    assert.equal(overlap(sq(1, 200, 200), sq(2, 500, 500)), null);
});

test('bestOverlap picks the square with the largest overlap', () => {
    // Closer to square 2 than square 1, and never compared with itself
    const active = sq(9, 270, 220);
    const best = bestOverlap(active, [sq(1, 200, 200), sq(2, 300, 200), active]);
    assert.equal(best.square.id, 2);
    assert.ok(Math.abs(best.overlap.percent - 56) < 1e-9); // 70 x 80 of 100 x 100
    assert.equal(bestOverlap(sq(9, 700, 700), [sq(1, 200, 200)]), null);
});

test('inRow: within half a square vertically, sorted by x, with exclusions', () => {
    const squares = [sq(1, 300, 200), sq(2, 100, 230), sq(3, 200, 260), sq(4, 400, 180)];
    assert.deepEqual(inRow(squares, 200).map(s => s.id), [2, 1, 4]);
    assert.deepEqual(inRow(squares, 200, [2]).map(s => s.id), [1, 4]);
});

test('shouldCloseGap: dragged more than a square off the row', () => {
    const row = [sq(1, 200, 200), sq(2, 300, 200)];
    assert.equal(shouldCloseGap(sq(3, 400, 301), 200, row), true);
    assert.equal(shouldCloseGap(sq(3, 400, 290), 200, [...row, sq(3, 400, 290)]), false);
});

test('shouldCloseGap: a neighbor gap wider than 1.5 squares', () => {
    assert.equal(shouldCloseGap(sq(3, 500, 200), 200, [sq(1, 200, 200), sq(2, 300, 200), sq(3, 500, 200)]), true);
    assert.equal(shouldCloseGap(sq(3, 450, 200), 200, [sq(1, 200, 200), sq(2, 300, 200), sq(3, 450, 200)]), false);
});

test('rowCenter is midway between the ends', () => {
    assert.equal(rowCenter([{ x: 300 }, { x: 200 }, { x: 600 }]), 400);
    assert.equal(rowCenter([{ x: 250 }]), 250);
});

test('gapCloseTargets: square removed from the middle, both sides meet', () => {
    // 400 removed from 200..600 (center 400)
    const t = xsById(gapCloseTargets([{ id: 1, x: 200 }, { id: 2, x: 300 }, { id: 4, x: 500 }, { id: 5, x: 600 }], 400));
    assert.deepEqual(t, { 1: 250, 2: 350, 4: 450, 5: 550 });
});

test('gapCloseTargets: square removed from either end, nothing moves (no gap)', () => {
    assert.deepEqual(gapCloseTargets([{ id: 1, x: 200 }, { id: 2, x: 300 }, { id: 3, x: 400 }, { id: 4, x: 500 }], 400), []);
    assert.deepEqual(gapCloseTargets([{ id: 2, x: 300 }, { id: 3, x: 400 }, { id: 4, x: 500 }, { id: 5, x: 600 }], 400), []);
});

test('gapCloseTargets: the last square left in a row stays where it is', () => {
    assert.deepEqual(gapCloseTargets([{ id: 1, x: 200 }], 250), []);
});

test('gapCloseTargets: only squares that need to move are returned', () => {
    assert.deepEqual(gapCloseTargets([{ id: 1, x: 250 }, { id: 2, x: 350 }], 300), []);
    const moves = gapCloseTargets([{ id: 1, x: 250 }, { id: 2, x: 350 }, { id: 3, x: 500 }], 350);
    assert.deepEqual(xsById(moves), { 3: 450 });
});

test('gapCloseTargets: a closed-up row stays inside the container', () => {
    // A middle gap closing around a center near the left edge would put the first square at 0
    const t = xsById(gapCloseTargets([{ id: 1, x: 50 }, { id: 2, x: 150 }, { id: 3, x: 350 }], 100));
    assert.deepEqual(t, { 3: 250 }, 'only the square past the gap moves; the row starts at the edge');
});

test('fitRow shifts a row back inside the container', () => {
    assert.deepEqual(fitRow([0, 100, 200]), [50, 150, 250]);
    assert.deepEqual(fitRow([700, 800]), [650, 750]);
    assert.deepEqual(fitRow([100, 200]), [100, 200]);
});

test('joinLayout: new square in the slot, pair either side, row pushed apart', () => {
    // Row 1-5 at 200..600; square 6 dropped onto 3 (x=400), slot at 400
    const { slotX, targets } = joinLayout({
        others: [{ id: 1, x: 200 }, { id: 2, x: 300 }, { id: 4, x: 500 }, { id: 5, x: 600 }],
        inactiveId: 3,
        activeId: 6,
        slotX: 400
    });
    assert.equal(slotX, 400);
    const x = xsById(targets);
    // Left of the slot, in order: 1, 2, 3 (inactive); right: 6 (active), 4, 5
    assert.deepEqual([x[1], x[2], x[3], slotX, x[6], x[4], x[5]], [100, 200, 300, 400, 500, 600, 700]);
});

test('joinLayout: activeSide left puts the dragged square on the left', () => {
    const { slotX, targets } = joinLayout({ others: [], inactiveId: 1, activeId: 2, slotX: 400, activeSide: 'left' });
    const x = xsById(targets);
    assert.deepEqual([x[2], slotX, x[1]], [300, 400, 500]);
});

test('joinLayout: a row that would hang off the edge shifts back inside', () => {
    // Join at the far left: slot at 100 would put the inactive square at 0
    const { slotX, targets } = joinLayout({ others: [{ id: 3, x: 300 }], inactiveId: 1, activeId: 2, slotX: 100 });
    const x = xsById(targets);
    assert.deepEqual([x[1], slotX, x[2], x[3]], [50, 150, 250, 350]);
});

test('joinLayout: every square ends up exactly one spacing from its neighbor', () => {
    const { slotX, targets } = joinLayout({
        others: [{ id: 1, x: 120 }, { id: 4, x: 610 }, { id: 5, x: 700 }],
        inactiveId: 2,
        activeId: 3,
        slotX: 333
    });
    const xs = [...targets.map(t => t.x), slotX].sort((a, b) => a - b);
    for (let i = 1; i < xs.length; i++) assert.equal(xs[i] - xs[i - 1], 100);
});

// Row 1-5 at x = 200..600, y = 200. Seams at 250, 350, 450, 550.
const ROW5 = [sq(1, 200, 200), sq(2, 300, 200), sq(3, 400, 200), sq(4, 500, 200), sq(5, 600, 200)];

test('insertionPoint: at a seam, full strength, index between the neighbors', () => {
    const p = insertionPoint(sq(9, 350, 200), ROW5);
    assert.equal(p.index, 2);
    assert.equal(p.seamX, 350);
    assert.equal(p.rowY, 200);
    assert.equal(p.strength, 1);
    assert.deepEqual(p.row.map(s => s.id), [1, 2, 3, 4, 5]);
});

test('insertionPoint: strength falls off with distance from the seam and row', () => {
    assert.ok(Math.abs(insertionPoint(sq(9, 362.5, 200), ROW5).strength - 0.5) < 1e-9); // half of ZONE_X (25)
    assert.ok(Math.abs(insertionPoint(sq(9, 350, 225), ROW5).strength - 0.5) < 1e-9); // half of ZONE_Y (50)
});

test('insertionPoint: none when over a square, off the row, or past the ends', () => {
    assert.equal(insertionPoint(sq(9, 380, 200), ROW5), null);  // 30 from the seam: mostly over square 3
    assert.equal(insertionPoint(sq(9, 350, 260), ROW5), null);  // off the row
    assert.equal(insertionPoint(sq(9, 150, 200), ROW5), null);  // left of the row (no seam)
});

test('insertLayout: the dragged square takes the seam, neighbors move out', () => {
    const layout = xsById(insertLayout(insertionPoint(sq(9, 350, 200), ROW5), 9));
    assert.deepEqual(layout, { 1: 150, 2: 250, 9: 350, 3: 450, 4: 550, 5: 650 });
});

test('insertLayout: a row that would hang off the edge shifts back inside', () => {
    const row = [sq(1, 100, 200), sq(2, 200, 200), sq(3, 300, 200)];
    const layout = xsById(insertLayout(insertionPoint(sq(9, 150, 200), row), 9));
    assert.deepEqual(layout, { 1: 50, 9: 150, 2: 250, 3: 350 });
});

test('dragLayout: the magnet pushes each side of the seam apart as a whole', () => {
    // Square 6 from below, hovering at the seam between 2 and 3
    const { targets, insertion } = dragLayout({
        others: ROW5, dragged: sq(6, 350, 200), originY: 400, originRowCenter: 400
    });
    assert.equal(insertion.index, 2);
    assert.deepEqual(xsById(targets), { 1: 160, 2: 260, 3: 440, 4: 540, 5: 640 }); // SPREAD 80: 40 each side
});

test('dragLayout: away from any seam, everything stays put', () => {
    const { targets, insertion } = dragLayout({
        others: ROW5, dragged: sq(6, 400, 450), originY: 400, originRowCenter: 400
    });
    assert.equal(insertion, null);
    assert.deepEqual(xsById(targets), { 1: 200, 2: 300, 3: 400, 4: 500, 5: 600 });
});

test('dragLayout: leaving a row closes it up, then the magnet works on the closed-up row', () => {
    // Square 3 dragged out of the row: 1,2,4,5 close up around 400 (250..550)
    const others = ROW5.filter(s => s.id !== 3);
    const away = dragLayout({ others, dragged: sq(3, 400, 450), originY: 200, originRowCenter: 400 });
    assert.deepEqual(xsById(away.targets), { 1: 250, 2: 350, 4: 450, 5: 550 });

    // ...then brought back to the seam between 4 and 5 (x = 500 in the closed-up row)
    const back = dragLayout({ others, dragged: sq(3, 500, 200), originY: 200, originRowCenter: 400 });
    assert.equal(back.insertion.index, 3);
    assert.deepEqual(xsById(back.targets), { 1: 210, 2: 310, 4: 410, 5: 590 });
});

test('dragLayout: depends only on where the dragged square is (no drift)', () => {
    const args = { others: ROW5, dragged: sq(6, 355, 205), originY: 400, originRowCenter: 400 };
    assert.deepEqual(dragLayout(args), dragLayout(args));
});

test('nudge: nothing is pushed before contact, or until STICK.BREAK deep (attraction is in charge)', () => {
    assert.equal(nudge(sq(9, 400, 320), ROW5), null);                   // 20px below square 3
    assert.equal(nudge(sq(9, 400, 300 - STICK.BREAK), ROW5), null);     // exactly BREAK deep
    assert.equal(nudge(sq(9, 400, 300 - STICK.BREAK - 5), ROW5).id, 3); // just past it
});

test('dragLayout: squares the magnet is pushing are not also nudged', () => {
    const { targets } = dragLayout({ others: ROW5, dragged: sq(6, 350, 200), originY: 400, originRowCenter: 400 });
    for (const t of targets) assert.equal(t.y, 200, `square ${t.id} stays in its row`);
});

test('dragLayout: keepOriginClosed keeps the row closed once the square has left it', () => {
    // Square 3 moved 50px right, still in the row: normally the row stays put...
    // (x = 450 is also away from every seam in the closed-up row, so no magnet)
    const others = ROW5.filter(s => s.id !== 3);
    const args = { others, dragged: sq(3, 450, 200), originY: 200, originRowCenter: 400, nudge: false };
    assert.equal(dragLayout(args).originClosed, false);
    // ...but once it has left the row earlier in the drag, the row stays closed up
    const kept = dragLayout({ ...args, keepOriginClosed: true });
    assert.equal(kept.originClosed, true);
    assert.deepEqual(xsById(kept.targets), { 1: 250, 2: 350, 4: 450, 5: 550 });
});

test('joinSide: the side of the target it was dropped on', () => {
    assert.equal(joinSide(200, 280, 300), 'left');   // pink dragged right onto purple's left half
    assert.equal(joinSide(600, 520, 500), 'right');  // red dragged left onto green's right half
    assert.equal(joinSide(600, 480, 500), 'left');   // red dragged further, onto green's left half
    assert.equal(joinSide(400, 390, 400), 'left');   // from directly below, dropped left of center
});

test('joinSide: dropped dead center, the side it came from, then the fallback', () => {
    assert.equal(joinSide(600, 500, 500), 'right');
    assert.equal(joinSide(200, 500, 500), 'left');
    assert.equal(joinSide(500, 500, 500), 'right');
    assert.equal(joinSide(500, 500, 500, 'left'), 'left');
});

test('joinLayout: with centerX, the whole row is re-centered there', () => {
    // Join at the left end of a row: row would span 50..550, re-centered on 400 it's 150..650
    const { slotX, targets } = joinLayout({
        others: [{ id: 3, x: 300 }, { id: 4, x: 400 }, { id: 5, x: 500 }],
        inactiveId: 1, activeId: 2, slotX: 150, centerX: 400
    });
    const xs = [...targets.map(t => t.x), slotX].sort((a, b) => a - b);
    assert.deepEqual(xs, [150, 250, 350, 450, 550, 650]);
});

test('insertLayout: with centerX, the whole row is re-centered there', () => {
    const row = [sq(1, 100, 200), sq(2, 200, 200), sq(3, 300, 200)];
    const layout = xsById(insertLayout(insertionPoint(sq(9, 150, 200), row), 9, 400));
    assert.deepEqual(layout, { 1: 250, 9: 350, 2: 450, 3: 550 });
});

test('overlap: squares of different sizes, as a share of the smaller one', () => {
    // A 70px square fully inside a 100px one
    const o = overlap({ id: 1, centerX: 200, centerY: 200, size: 70 }, sq(2, 200, 200));
    assert.deepEqual(o, { left: 165, top: 165, width: 70, height: 70, percent: 100 });
    // 70px square 40px below a 100px one: 70 wide, 45 tall -> 3150 / 4900
    const p = overlap({ id: 1, centerX: 200, centerY: 240, size: 70 }, sq(2, 200, 200));
    assert.equal(p.height, 45);
    assert.ok(Math.abs(p.percent - 3150 / 4900 * 100) < 1e-9);
    // Close enough to touch at full size, but not at 70px
    assert.equal(overlap({ id: 1, centerX: 290, centerY: 200, size: 70 }, sq(2, 200, 200)), null);
});

test('paletteRow: the row with the most squares', () => {
    const squares = [...ROW5, sq(6, 400, 400), sq(7, 500, 410)];
    assert.deepEqual([...paletteRow(squares)].sort(), [1, 2, 3, 4, 5]);
    // Rows tied: the topmost wins
    assert.deepEqual([...paletteRow([sq(1, 100, 500), sq(2, 100, 200)])], [2]);
    assert.deepEqual([...paletteRow([])], []);
});

test('edgeGap: edge-to-edge distance, negative when overlapping', () => {
    assert.equal(edgeGap(sq(1, 200, 200), sq(2, 340, 200)), 40);
    assert.equal(edgeGap(sq(1, 200, 200), sq(2, 300, 200)), 0);
    assert.equal(edgeGap(sq(1, 200, 200), sq(2, 270, 200)), -30);
    assert.equal(edgeGap({ id: 1, centerX: 200, centerY: 200, size: 80 }, sq(2, 300, 200)), 10);
});


test('pushAmount: nothing until STICK.BREAK deep, eases in over RAMP, then gives way at GIVE per pixel', () => {
    assert.equal(pushAmount(-30), 0);                                       // apart
    assert.equal(pushAmount(0), 0);                                         // contact
    assert.equal(pushAmount(STICK.BREAK), 0);                               // still attraction's
    const ramped = STICK.BREAK + NUDGE.RAMP;
    assert.equal(pushAmount(ramped), NUDGE.CONTACT + NUDGE.GIVE * NUDGE.RAMP);
    assert.equal(pushAmount(ramped + 10), NUDGE.CONTACT + NUDGE.GIVE * (NUDGE.RAMP + 10));
    assert.ok(pushAmount(STICK.BREAK + 1) < 3, 'starts gently, no jump');
    assert.ok(NUDGE.GIVE < 1, 'gives way slower than you push, so the overlap builds');
});

test('nudge: only the square overlapped most is pushed, directly away', () => {
    // Pushing up into square 3 from below, slightly left: 3 is pushed; 2 and 4 don't move
    const pushed = nudge(sq(9, 390, 270), ROW5);
    assert.equal(pushed.id, 3);
    assert.ok(Math.abs(Math.hypot(pushed.dx, pushed.dy) - pushAmount(30)) < 1e-9); // 30px in
    assert.ok(pushed.dy < 0 && pushed.dx > 0, 'up and to the right, away from the dragged square');
    assert.equal(nudge(sq(9, 400, 200), ROW5), null); // exactly on top: no direction
});

test('nudge: once snapped (threshold met), eases NUDGE.SNAP closer but stays pushed', () => {
    // 40px into square 3 from below
    const away = nudge(sq(9, 400, 260), ROW5);
    const snap = nudge(sq(9, 400, 260), ROW5, { snapped: true });
    assert.equal(-away.dy, pushAmount(40));
    assert.equal(-snap.dy, pushAmount(40) - NUDGE.SNAP, 'a little closer, not on top');
    assert.ok(-snap.dy > 0, 'still pushed away from where it rests');
    assert.deepEqual([snap.pulled, away.pulled], [true, false]);
});
test('dragLayout: only the pushed square moves; nudge: false springs it back', () => {
    const args = { others: ROW5, dragged: sq(6, 400, 270), originY: 400, originRowCenter: 400 };
    const moved = dragLayout(args).targets.filter(t => t.follows);
    assert.deepEqual(moved.map(t => [t.id, t.x, t.y]), [[3, 400, 200 - pushAmount(30)]]);
    const released = dragLayout({ ...args, nudge: false }).targets.find(t => t.id === 3);
    assert.deepEqual([released.x, released.y], [400, 200]);
});

test('the push peaks right when the join threshold is met, with the squares visibly overlapping', () => {
    // Push a loose square (85px) straight up into square 3, 1px at a time.
    // The threshold is measured against where square 3 rests.
    const size = 85;
    let peak = 0;
    let triggered = null;
    for (let y = 400; y >= 200 && !triggered; y--) {
        const dragged = { id: 9, centerX: 400, centerY: y, size };
        const push = nudge(dragged, ROW5);
        const amount = push && push.id === 3 ? -push.dy : 0;
        const rest = overlap(dragged, ROW5[2]);
        if (rest && rest.percent >= JOIN.ACTIVATE) {
            const visible = overlap(dragged, { id: 3, centerX: 400, centerY: 200 - amount });
            triggered = { amount, visible };
        } else {
            peak = Math.max(peak, amount);
        }
    }
    assert.ok(triggered.amount >= peak, `push is at its peak when it triggers (${triggered.amount} vs ${peak})`);
    assert.ok(triggered.visible, 'the squares visibly overlap at that moment');
});

test('nudge: once snapped with heldPush, holds NUDGE.SNAP closer no matter how deep', () => {
    const at = y => -nudge(sq(9, 400, y), ROW5, { snapped: true, heldPush: 30 }).dy;
    assert.equal(at(260), 30 - NUDGE.SNAP);
    assert.equal(at(240), 30 - NUDGE.SNAP, 'pushing deeper does not move it');
});

test('squaresInRect: squares the rectangle touches', () => {
    const ids = rect => squaresInRect(ROW5, rect).map(s => s.id);
    assert.deepEqual(ids({ left: 260, top: 120, right: 460, bottom: 280 }), [2, 3, 4]);
    assert.deepEqual(ids({ left: 260, top: 120, right: 440, bottom: 280 }), [2, 3]);
    assert.deepEqual(ids({ left: 240, top: 249, right: 260, bottom: 260 }), [1, 2]); // just touching 1's edge
    assert.deepEqual(ids({ left: 0, top: 300, right: 800, bottom: 800 }), []);
});

test('groupDeltaBounds: how far a group can move and stay inside', () => {
    // Squares at x 200..400, y 200: left edge at 150 (100 to spare), right at 450 (300 to spare)
    const b = groupDeltaBounds([sq(1, 200, 200), sq(2, 300, 200), sq(3, 400, 300)]);
    assert.deepEqual(b, { dxMin: -150, dxMax: 350, dyMin: -150, dyMax: 450 });
});

test('rowSlots lays a row out side by side, centered, and shifted to fit the container', () => {
    assert.deepEqual(rowSlots(3, 400), [300, 400, 500]);
    assert.deepEqual(rowSlots(4, 400), [250, 350, 450, 550]);
    assert.deepEqual(rowSlots(1, 400), [400]);
    assert.deepEqual(rowSlots(3, 60), [50, 150, 250]);   // Hanging off the left: shifted right
    assert.deepEqual(rowSlots(3, 790), [550, 650, 750]); // Hanging off the right: shifted left
});

// --- Attraction ---------------------------------------------------------

const ROW3 = [sq(1, 300, 200), sq(2, 400, 200), sq(3, 500, 200)];

test('attraction: 14px past the end of a row and 28px low, it connects flush in the row', () => {
    const a = attraction(sq(9, 614, 228), ROW3);
    assert.deepEqual([a.id, a.x, a.y, a.gap], [3, 600, 200, 14]);
});

test('attraction: more than half aligned connects; half or less does not', () => {
    // 8px beside square 3 and 47px higher: 53px of their heights line up
    assert.deepEqual([attraction(sq(9, 608, 153), ROW3)?.x, attraction(sq(9, 608, 153), ROW3)?.y], [600, 200]);
    // Exactly half (50px off-line), or less: nothing
    assert.equal(attraction(sq(9, 608, 200 - STICK.ALIGN), ROW3), null);
    assert.equal(attraction(sq(9, 608, 140), ROW3), null);
});

test('attraction: only within STICK.GAP of the edge', () => {
    assert.ok(attraction(sq(9, 600 + STICK.GAP - 1, 200), ROW3));
    assert.equal(attraction(sq(9, 600 + STICK.GAP, 200), ROW3), null);
});

test('attraction: above or below a square, flush in its column', () => {
    const a = attraction(sq(9, 315, 320), ROW3);
    assert.deepEqual([a.id, a.x, a.y], [1, 300, 300]);
});

test('attraction: while held, drawn at most STICK.HOLD toward the spot; all the way within CAPTURE', () => {
    // 8px beside, 47px off-line: the spot is about 48px away, but it only drifts HOLD
    const far = attraction(sq(9, 608, 153), ROW3);
    assert.ok(Math.hypot(far.draw.dx, far.draw.dy) <= STICK.HOLD + 1e-9);
    assert.ok(far.draw.dx < 0 && far.draw.dy > 0, 'toward the spot');
    // Within CAPTURE of the spot: sits on it
    const near = attraction(sq(9, 606, 207), ROW3);
    assert.deepEqual([606 + near.draw.dx, 207 + near.draw.dy], [600, 200]);
    // Farther along the gap, a gentler drift
    const mid = attraction(sq(9, 620, 210), ROW3);
    assert.ok(Math.hypot(mid.draw.dx, mid.draw.dy) < Math.hypot(20, 10));
});

test('pullStrength: none from GAP out, full at contact, lets go by BREAK deep', () => {
    assert.equal(pullStrength(STICK.GAP), 0);
    assert.ok(pullStrength(20) < pullStrength(10), 'stronger the closer it gets');
    assert.equal(pullStrength(0), 1);
    assert.equal(pullStrength(-STICK.BREAK / 2), 0.5);
    assert.equal(pullStrength(-STICK.BREAK), 0);
});

test('attraction: a spot already held does not attract', () => {
    const pair = [sq(1, 300, 200), sq(2, 400, 200)];
    assert.equal(attraction(sq(9, 410, 170), pair), null);
    assert.equal(attraction(sq(9, 410, 170), [pair[0]])?.x, 400, 'free spot: drawn to it');
});

test('attraction: the nearest spot wins', () => {
    const a = attraction(sq(9, 610, 210), ROW3);
    assert.deepEqual([a.id, a.x, a.y], [3, 600, 200]);
});

test('attraction: just pushed into a square still connects; past STICK.BREAK it lets go', () => {
    assert.ok(attraction(sq(9, 590, 200), ROW3));
    assert.equal(attraction(sq(9, 600 - STICK.BREAK, 200), ROW3), null);
});

test('attraction: never to a spot off the canvas', () => {
    assert.equal(attraction(sq(9, 760, 200), [sq(1, 750, 200)]), null);
});

test('attraction: not while on top of another square, even with a free spot nearby', () => {
    const closed = [sq(1, 250, 200), sq(2, 350, 200), sq(4, 450, 200), sq(5, 550, 200), sq(6, 400, 400)];
    assert.equal(attraction(sq(3, 460, 330), closed), null);
    assert.equal(attraction(sq(3, 460, 320), closed.slice(0, 4))?.y, 300, 'without square 6 it would connect');
});
