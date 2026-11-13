// Unit tests for the hue spreads (lib/mix/spreads, runs in Node).
//   npm run test:unit

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hexToOKLCH } from '../palette.js';
import { spreadGaps } from '../spreads/spread-1.js';
import { matchPairs } from '../spreads/spread-2.js';
import { triad } from '../spreads/spread-3.js';
import { doubling } from '../spreads/spread-4.js';
import { square } from '../spreads/spread-5.js';
import { SPREADS } from '../spreads/index.js';

test('every spread is listed, with a label and a move', () => {
    assert.deepEqual(SPREADS.map(s => s.label), ['Spread 1', 'Spread 2', 'Spread 3: triad', 'Spread 4: doubling', 'Spread 5: square']);
    for (const s of SPREADS) assert.equal(typeof s.move, 'function');
});

// --- spreadGaps ("Spread 1") ------------------------------------------

const gap = (a, b) => Math.abs(((a - b + 540) % 360) - 180); // Degrees between two hues, 0..180
const near = (a, b, msg) => assert.ok(Math.abs(a - b) < 1e-6, `${msg}: ${a} vs ${b}`);
const at = (hues) => hues.map((h, id) => ({ id, oklch: { mode: 'oklch', l: 0.6, c: 0.1, h } }));

test('spreadGaps: the Mix default palette keeps its cluster, evened out, with blue opposite orange', () => {
    const start = ['#2A5B96', '#D73E2F', '#F69219', '#FEE16C'].map(hexToOKLCH);
    const [blue, red, orange, yellow] = spreadGaps(start.map((oklch, id) => ({ id, oklch }))).map(c => c.oklch.h);
    // Red and yellow: equally far from orange, at the average of their old distances
    const was = (gap(start[1].h, start[2].h) + gap(start[3].h, start[2].h)) / 2;
    near(gap(red, orange), was, 'red to orange');
    near(gap(yellow, orange), was, 'yellow to orange');
    near(gap(blue, orange), 180, 'blue opposite orange');
});

test('spreadGaps: gaps of about the same size become even', () => {
    const out = spreadGaps(at([350, 100, 240])).map(c => c.oklch.h); // Gaps 110, 140, 110
    near(gap(out[0], out[1]), 120, 'first to second');
    near(gap(out[1], out[2]), 120, 'second to third');
    assert.ok(gap(out[0], 350) < 30, 'the color at 350 stays near 0');
});

test('spreadGaps: only the hue changes', () => {
    const before = ['#2A5B96', '#D73E2F', '#F69219'].map(hexToOKLCH);
    spreadGaps(before.map((oklch, id) => ({ id, oklch }))).forEach(({ oklch }, i) => {
        assert.equal(oklch.l, before[i].l);
        assert.equal(oklch.c, before[i].c);
    });
});

test('spreadGaps: colors already evened out stay where they are', () => {
    for (const hues of [[10, 130, 250], [0, 30, 60, 210, 240, 270]]) {
        const colors = at(hues);
        spreadGaps(colors).forEach(({ oklch }, i) => assert.ok(gap(oklch.h, hues[i]) < 1e-6, `${hues}`));
    }
});

test('spreadGaps: two colors end up opposite', () => {
    const out = spreadGaps(at([20, 80])).map(c => c.oklch.h);
    near(gap(out[0], out[1]), 180, 'apart');
});

test('spreadGaps: grays and single colors are left alone', () => {
    const gray = { mode: 'oklch', l: 0.5, c: 0.005, h: 40 };
    const out = spreadGaps([{ id: 'g', oklch: gray }, { id: 'r', oklch: hexToOKLCH('#D73E2F') }]);
    assert.deepEqual(out[0].oklch, gray);
    assert.equal(out[1].oklch.h, hexToOKLCH('#D73E2F').h);
});

// --- matchPairs ("Spread 2") ------------------------------------------

test('matchPairs: two pairs get the same gap; the colors either side of the largest gap stay', () => {
    // Blue 251, purple 301 (50 apart); orange 36, yellow 98 (62 apart); yellow -> blue is the largest gap
    const start = ['#63ACF8', '#4B1E7B', '#EE7A5C', '#F3D957'].map(hexToOKLCH);
    const [blue, purple, orange, yellow] = matchPairs(start.map((oklch, id) => ({ id, oklch }))).map(c => c.oklch.h);
    const pair = (gap(start[0].h, start[1].h) + gap(start[2].h, start[3].h)) / 2;
    near(blue, start[0].h, 'blue stays');
    near(yellow, start[3].h, 'yellow stays');
    near(gap(blue, purple), pair, 'blue to purple');
    near(gap(orange, yellow), pair, 'orange to yellow');
    near(gap(purple, orange), gap(start[1].h, start[2].h), 'purple to orange unchanged');
});

test('matchPairs: works the other way round, and across 0', () => {
    // Pairs 340/20 (40 apart) and 160/180 (20 apart); the largest gap is 180 -> 340
    const out = matchPairs(at([340, 20, 160, 180])).map(c => c.oklch.h);
    near(out[0], 340, '340 stays');
    near(out[3], 180, '180 stays');
    near(out[1], 10, '20 moves to 10');
    near(out[2], 150, '160 moves to 150');
    near(gap(out[0], out[1]), 30, 'first pair');
    near(gap(out[2], out[3]), 30, 'second pair');
});

test('matchPairs: not two pairs, no answer', () => {
    // The Mix default: a cluster (red, orange, yellow) and an accent; the two smallest gaps are next to each other
    assert.equal(matchPairs(['#2A5B96', '#D73E2F', '#F69219', '#FEE16C'].map((hex, id) => ({ id, oklch: hexToOKLCH(hex) }))), null);
    assert.equal(matchPairs(at([0, 120, 240])), null);
});

// --- triad ("Spread 3: triad") ------------------------------------------

test('triad: three colors end up 120 degrees apart, moving as little as possible', () => {
    // Green, lavender, red (as on the Mix canvas)
    const start = ['#55B97A', '#D0D0F8', '#DA4521'].map(hexToOKLCH);
    const out = triad(start.map((oklch, id) => ({ id, oklch }))).map(c => c.oklch.h);
    near(gap(out[0], out[1]), 120, 'green to lavender');
    near(gap(out[1], out[2]), 120, 'lavender to red');
    near(gap(out[2], out[0]), 120, 'red to green');
    // Moving each by the same amount the other way round would be no better
    const moved = out.reduce((sum, h, i) => sum + gap(h, start[i].h) ** 2, 0);
    for (const nudge of [-1, 1]) {
        const other = out.reduce((sum, h, i) => sum + gap(h + nudge, start[i].h) ** 2, 0);
        assert.ok(moved <= other, `nudged ${nudge}`);
    }
});

test('triad: only for three hues', () => {
    assert.equal(triad(at([0, 90, 180, 270])), null);
    assert.equal(triad(at([0, 90])), null);
    const gray = { mode: 'oklch', l: 0.5, c: 0.005, h: 40 };
    assert.ok(triad([...at([0, 100, 200]), { id: 'g', oklch: gray }])); // A gray doesn't count
});

// --- doubling ("Spread 4") --------------------------------------------

test('doubling: each gap is twice the one before, from the tight end', () => {
    // Like the screenshot: pink 350, purple 325, violet 280, green 165 (gaps 25, 45, 115 going down)
    const out = doubling(at([350, 325, 280, 165])).map(c => c.oklch.h);
    const x = gap(out[0], out[1]);
    near(gap(out[1], out[2]), 2 * x, 'purple to violet');
    near(gap(out[2], out[3]), 4 * x, 'violet to green');
    assert.ok(x > 20 && x < 30, `X near the old gaps: ${x}`);
    assert.ok(gap(out[0], 350) < 20, 'pink stays near where it was');
});

test('doubling: works going up the circle too', () => {
    const out = doubling(at([10, 30, 70, 160])).map(c => c.oklch.h);
    const x = gap(out[0], out[1]);
    near(gap(out[1], out[2]), 2 * x, 'second gap');
    near(gap(out[2], out[3]), 4 * x, 'third gap');
});

test('doubling: needs three hues, and keeps the chain inside the circle', () => {
    assert.equal(doubling(at([10, 200])), null);
    const out = doubling(at([0, 60, 120, 180, 240])).map(c => c.oklch.h); // 15X would pass 360
    const x = gap(out[0], out[1]) || gap(out[4], out[3]);
    assert.ok(15 * x <= 330 + 1e-6, `span ${15 * x}`);
});

// --- square ("Spread 5") ----------------------------------------------

test('square: four colors end up 90 degrees apart, in order, moving little', () => {
    const out = square(at([350, 325, 280, 165])).map(c => c.oklch.h);
    near(gap(out[0], out[1]), 90, 'first to second');
    near(gap(out[1], out[2]), 90, 'second to third');
    near(gap(out[2], out[3]), 90, 'third to fourth');
    near(gap(out[3], out[0]), 90, 'fourth to first');
});

test('square: needs exactly four hues', () => {
    assert.equal(square(at([10, 130, 250])), null);
    assert.equal(square(at([0, 70, 140, 210, 280])), null);
});
