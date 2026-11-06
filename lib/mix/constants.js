// constants.js
//
// Every tunable number in one place: sizes, thresholds, timings, styles,
// and feature flags. No logic lives here.

/** Square size in pixels (squares are always square). */
export const SQUARE_SIZE = 100;
export const SQUARE_CENTER = SQUARE_SIZE / 2;

/**
 * Squares outside the main palette (the row with the most squares) are shown
 * at this scale. 1 means every square is the same size; set it below 1 (e.g.
 * 0.85) to make loose squares smaller. Scaling is around the square's center,
 * so positions don't move.
 */
export const LOOSE_SCALE = 1;

/** The canvas squares live in. Squares never leave it. */
export const CONTAINER = {
    WIDTH: 800,
    HEIGHT: 800
};

/**
 * Joining: overlap is measured as a percentage of one square's area.
 * Releasing at or above ACTIVATE creates a new square. Once active, the
 * threshold stays on until the overlap drops to DEACTIVATE, so it doesn't
 * flicker at the boundary.
 */
export const JOIN = {
    ACTIVATE: 50,
    DEACTIVATE: 45,
    // The dragged square lands on the side of the target it was dropped on.
    // This is the side used when it's dropped dead center and also came from
    // directly above or below.
    ACTIVE_SIDE: 'right'
};

/** Rows: squares whose centers are within THRESHOLD vertically share a row. */
export const ROW = {
    THRESHOLD: SQUARE_SIZE / 2,
    SPACING: SQUARE_SIZE,          // Distance between neighbors after a join or gap close
    GAP_TRIGGER: SQUARE_SIZE * 1.5, // A neighbor gap wider than this gets closed
    LEAVE_DISTANCE: SQUARE_SIZE     // Dragging this far off the row counts as leaving it
};

/**
 * Inserting ("magnet"): dragging a square near the seam between two
 * neighbors in a row pushes those two neighbors apart (only them, not the
 * rest of the row), more the closer it gets. Releasing there inserts the
 * square, and the row makes room. Near a seam, inserting beats joining.
 */
export const INSERT = {
    ZONE_X: SQUARE_SIZE / 4,  // How far from the seam (horizontally) the magnet reaches
    ZONE_Y: ROW.THRESHOLD,    // How far from the row (vertically) the magnet reaches
    SPREAD: 80                // Gap opened at full strength (each neighbor moves half)
};

/**
 * Attraction (the magnet's pull): a dragged square close beside another
 * square, more than half aligned with it (more than half its height beside
 * it, or half its width above or below it), connects: released, it animates
 * to sit flush against it, lined up with it (so beside a row square it joins
 * the row).
 *   - Close: the facing edges are less than GAP pixels apart. Pushed into the
 *     other square, it still connects until BREAK pixels in, where joining
 *     takes over.
 *   - Aligned: the centers are less than ALIGN pixels off-line.
 *   - While it's held, it's drawn toward the spot, more the closer it gets,
 *     but never more than HOLD pixels from the pointer; within CAPTURE
 *     pixels of the spot it sits there.
 * A spot another square already holds doesn't attract, nor does anything
 * while the square is well on top of another one, and near a seam in a row,
 * inserting wins.
 */
export const STICK = {
    GAP: 50,
    ALIGN: SQUARE_SIZE / 2,
    BREAK: 20,
    HOLD: 16,
    CAPTURE: 12
};

/**
 * Nudge (magnetic push): once the dragged square is pushed more than
 * STICK.BREAK pixels into another square (the one it overlaps most), that
 * square gives way:
 *   - The push eases in to CONTACT pixels over the first RAMP pixels past
 *     STICK.BREAK, then grows by GIVE pixels for every pixel you push in.
 *     GIVE is under 1, so the squares visibly overlap more and more.
 *   - The push peaks the moment the overlap with where the target rests
 *     reaches the join threshold. Then it relents: it eases SNAP pixels back
 *     toward the dragged square and holds there while the threshold is met,
 *     to show that releasing now will join.
 * It springs back when the dragged square moves on or is released. No other
 * square moves. (Before that depth, attraction is in charge: see STICK.)
 */
export const NUDGE = {
    RAMP: 15,
    CONTACT: 15,
    GIVE: 0.3,
    SNAP: 20
};

export const ANIMATION = {
    DURATION: {
        DEFAULT: 0.5,
        FAST: 0.2,
        FADE: 0.3,
        INTRO: 1.0,
        INTRO_HOLD: 0.4, // The intro's cursor stays this long after the join before leaving
        PUSH_OUT: 0.12, // At the threshold, the covered square first reaches the peak of the push...
        SNAP: 0.6,      // ...then relents
        STICK: 0.25,    // A released square going to connect with the one it's beside
        REMOVE: 0.12    // A deleted square fading out
    },
    // The join, in order (about 0.8s total)
    JOIN: {
        MOVE: 0.4,     // Preview grows into the new square's slot; row moves apart
        FADE_OUT: 0.2, // Preview fades out
        FADE_IN: 0.2   // New square fades in
    },
    EASE: {
        DEFAULT: 'power1.out',
        SMOOTH: 'power2.inOut',
        INTRO: 'power2.out',
        SNAP: 'power3.out', // The covered square relents fast, then slows to a stop
        STICK: 'power2.out' // Connecting: quick off the mark, easing into place
    },
    // The intro's drag, relative to where the square starts: down by DOWN and
    // OVER to the left onto its neighbor, in one easy diagonal-then-level
    // sweep, rising to END_DOWN at the end (the tweens overlap)
    INTRO_PATH: {
        DOWN: 30,
        OVER: 75,    // 75% of the neighbor, past JOIN.ACTIVATE even with the vertical offset
        END_DOWN: 18,
        DURATION: 1.0
    }
};

export const STYLE = {
    SHADOW: {
        ACTIVE: '-4px 4px 15px rgba(0, 0, 0, 0.15)',
        DEFAULT: '1px 1px 1px rgba(0, 0, 0, 0.0)',
        NONE: 'none'
    },
    PRESS_SCALE: 1.04,
    OVERLAP_BORDER: {
        WIDTH: '5px',
        COLOR: '#0000FF'
    },
    ZINDEX: {
        BASE: 1,
        DRAGGING: 10,
        OVERLAP: 15, // Above a dragged square
        TOP: 100
    }
};

export const GRID = {
    MARKER_INTERVAL: 50,
    LINE_COLOR: 'rgba(0, 0, 255, 0.1)',
    LABEL_COLOR: 'rgba(0, 0, 255, 0.5)',
    LABEL_SIZE: '12px'
};

/** Panning (Space + drag, or scroll / trackpad) and zooming (pinch, or Ctrl/Cmd + scroll). */
export const VIEW = {
    DRAG_THRESHOLD: 3,  // Pixels the pointer must move before a press on the background becomes a drag
    KEEP_VISIBLE: 100,  // The world can't be panned so far that less than this is on screen
    MIN_ZOOM: 0.25,
    MAX_ZOOM: 3,
    FIT_MARGIN: 24,     // World pixels kept around the squares when fitView zooms out to fit them
    FIT_DURATION: 0.4,  // Seconds fitSquares takes to ease out to show every square
    GLIDE_DURATION: 0.3, // Seconds the view takes to slide up to a palette added below the others
    ZOOM_SPEED: 0.01    // How fast a pinch / Ctrl+scroll zooms (per pixel of scroll)
};

/** Selecting squares (Figma-style): the drag rectangle and the box around a selection. */
export const SELECTION = {
    COLOR: '#4175DF',                // The site's --color1
    FILL: 'rgba(65, 117, 223, 0.08)', // Inside the drag-to-select rectangle
    BOUNDS_WIDTH: 2,  // Line around several selected squares, in pixels
    BOUNDS_OFFSET: 3  // Gap between the squares and that line
};

/** The ghost row shown while a palette is dragged over the canvas (drop-preview.js). */
export const DROP = {
    OPACITY: 0.55,
    ROW_GAP: SQUARE_SIZE / 2 // Space left between a row added below another and that row
};

/** The intro's fake cursor images, relative to the page (index.js can override). */
export const INTRO = {
    IMAGE_PATH: 'images/'
};

export const FEATURES = {
    ENABLE_LOGGING: false, // Console logging
    SHOW_GRID: true,       // Grid overlay
    SHOW_INTRO: true,      // Onboarding demo on load (skip with ?nointro)
    // The nudge (NUDGE): the square you push into gives way, then relents at
    // the join threshold. Off: only the dragged square ever moves during a
    // drag; the other stays put (the join border still shows the threshold)
    PUSH: false
};

/**
 * Sets the size of the world (CONTAINER) squares live in. Called by index.js
 * before any square exists, so every rule that clamps to the container (in
 * geometry.js) sees the same size.
 */
export function setWorldSize(width, height) {
    CONTAINER.WIDTH = width;
    CONTAINER.HEIGHT = height;
}
