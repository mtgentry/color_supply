// intro.js
//
// Onboarding demo: a fake cursor grabs the rightmost square of the main
// palette, slides it over its neighbor until the overlap preview shows its
// join border, and lets go there, so the two join and the blended square
// appears, just as when the user does it. That square is locked while the
// demo plays and moves via square.moveTo() like any other square. The cursor
// lives inside the canvas, so it works wherever the canvas is on the page.

import gsap from 'gsap';
import { store } from './store.js';
import { updatePreview } from './interactions.js';
import { join } from './join.js';
import { paletteRow, overlap, joinSide, rowCenter } from './geometry.js';
import { ANIMATION, STYLE, INTRO, JOIN } from './constants.js';

/**
 * Plays the demo. Nothing happens with fewer than two squares in the palette.
 * @param {object} p
 * @param {HTMLElement} p.canvas - The visible canvas (position: relative, overflow: hidden).
 * @param {string} [p.imagePath] - Where the cursor images are.
 * @returns {{timeline, cancel: () => void}|null} cancel() stops the demo at once.
 */
export function startIntro({ canvas, imagePath = INTRO.IMAGE_PATH }) {
    const cursorImage = name => `url('${imagePath}${name}.svg')`;
    const CURSOR = { POINTER: cursorImage('cursor'), OPEN: cursorImage('openhand'), CLOSED: cursorImage('closedhand') };

    const members = paletteRow(store.all());
    const row = store.all().filter(sq => members.has(sq.id)).sort((a, b) => a.centerX - b.centerX);
    if (row.length < 2) return null;
    const square = row[row.length - 1];
    const target = row[row.length - 2];

    // The square is dragged from here; the user can't grab it meanwhile
    const origin = { x: square.centerX, y: square.centerY };
    // Where the row is centered now: it grows by one but stays centered here
    const centerX = rowCenter(row.map(sq => ({ x: sq.targetX })));
    square.lock();

    // Fake cursor, starting off-screen to the right of the square
    const cursor = document.createElement('div');
    cursor.id = 'intro-cursor';
    canvas.appendChild(cursor);
    const c = canvas.getBoundingClientRect();
    const s = square.element.getBoundingClientRect();
    gsap.set(cursor, {
        position: 'absolute',
        left: s.left - c.left + s.width / 2,
        top: s.top - c.top + s.height / 2,
        width: 32,
        height: 32,
        backgroundImage: CURSOR.POINTER,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        pointerEvents: 'none',
        zIndex: STYLE.ZINDEX.TOP,
        xPercent: -10,
        x: canvas.clientWidth
    });

    let handClosed = false;
    const updateCursorImage = () => {
        const cr = cursor.getBoundingClientRect();
        const sr = square.element.getBoundingClientRect();
        const overSquare = cr.left >= sr.left && cr.right <= sr.right && cr.top >= sr.top && cr.bottom <= sr.bottom;
        cursor.style.backgroundImage = !overSquare ? CURSOR.POINTER : handClosed ? CURSOR.CLOSED : CURSOR.OPEN;
    };

    const timeline = gsap.timeline({
        onUpdate: () => {
            updatePreview(square);
            updateCursorImage();
        }
    });

    // Cursor comes in from the right and grabs the square
    timeline
        .to(cursor, { x: 0, duration: ANIMATION.DURATION.INTRO, ease: ANIMATION.EASE.INTRO })
        .addLabel('grab')
        .call(() => {
            handClosed = true;
            square.showPressed(true);
        }, [], 'grab');

    // Drag the square, cursor and square together, in one easy motion: it
    // sets off diagonally down and to the left, and the path flattens into a
    // sweep left over the neighbor (far enough that the preview shows its
    // border, past JOIN.ACTIVATE), rising a little at the end. Overlapping
    // tweens on a point, so there's no corner anywhere. The square is
    // released there.
    const PATH = ANIMATION.INTRO_PATH;
    const point = { x: origin.x, y: origin.y };
    const place = () => {
        square.moveTo(point.x, point.y);
        gsap.set(cursor, { x: point.x - origin.x, y: point.y - origin.y });
    };
    timeline
        .to(point, { x: origin.x - PATH.OVER, duration: PATH.DURATION, ease: 'sine.inOut', onUpdate: place }, 'grab')
        .to(point, { y: origin.y + PATH.DOWN, duration: PATH.DURATION * 0.6, ease: 'sine.inOut', onUpdate: place }, 'grab')
        .to(point, { y: origin.y + PATH.END_DOWN, duration: PATH.DURATION * 0.4, ease: 'sine.inOut', onUpdate: place }, `grab+=${PATH.DURATION * 0.6}`);

    // Let go: the hand opens and the square is the user's again
    let released = false;
    const letGo = () => {
        released = true;
        handClosed = false;
        square.showPressed(false);
        square.unlock();
    };

    // Let go over the neighbor: the join runs from there (the preview grows
    // into the new square's slot, the row parts, the blended square appears)
    const release = () => {
        letGo();
        const rect = overlap(square, target);
        if (!rect || store.interaction.isJoining) {
            // Can't join (not expected): just put it back
            square.moveTo(origin.x, origin.y);
            updatePreview(square);
            return;
        }
        join(square, target, rect, joinSide(origin.x, square.centerX, target.targetX, JOIN.ACTIVE_SIDE), centerX);
    };

    // The cursor stays for the join and a beat after, then leaves. (Tracked
    // with a flag, not timeline.isActive(): GSAP doesn't count a timeline as
    // active until its first tick, and the demo can be cancelled before that.)
    let done = false;
    const joinTotal = ANIMATION.JOIN.MOVE + ANIMATION.JOIN.FADE_OUT + ANIMATION.JOIN.FADE_IN;
    timeline
        .addLabel('release', `grab+=${PATH.DURATION}`)
        .call(release, [], 'release')
        .to(cursor, {
            x: canvas.clientWidth,
            duration: ANIMATION.DURATION.INTRO,
            ease: ANIMATION.EASE.SMOOTH,
            onComplete: () => {
                done = true;
                cursor.remove();
            }
        }, `release+=${joinTotal + ANIMATION.DURATION.INTRO_HOLD}`);

    return {
        timeline,
        /** Whether the demo is still going (its join, and the change that reports, included). */
        isPlaying: () => !done,
        cancel() {
            if (done) return;
            done = true;
            timeline.kill();
            cursor.remove();
            // Not yet released: back to where it was. Released: the join is
            // the canvas's own now and carries on (load() and destroy() stop it)
            if (!released && store.get(square.id)) {
                letGo();
                square.moveTo(origin.x, origin.y);
                updatePreview(square);
            }
        }
    };
}
