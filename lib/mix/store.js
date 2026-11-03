// store.js
//
// Where things are: the squares on the canvas and what the user is doing.
// Just data and lookups; no behavior.

const squares = new Map();

export const store = {
    /** The world layer squares live in (set by index.js). It pans inside the canvas. */
    container: null,

    /** How far the world is panned inside the canvas, and its zoom (see view.js). */
    view: { panX: 0, panY: 0, scale: 1 },

    /** Ids of the selected squares (see selection.js). */
    selection: new Set(),

    /** True once the initial squares exist. */
    ready: false,

    /** What the user is doing right now. */
    interaction: {
        draggingId: null,      // Square being dragged, if any
        lastDraggedId: null,   // Square whose overlap preview is shown
        joinTarget: null,      // Square the dragged square would join with
        thresholdActive: false, // Overlap is past the join threshold
        insertion: null,       // Where the dragged square would be inserted (geometry.insertionPoint)
        rest: null,            // During a drag: where the other squares rest, before magnet/nudge offsets
        isJoining: false,      // A join animation is running
        isSettling: false      // An insert or return-to-start animation is running
    },

    /**
     * Called (with no arguments) once the squares have come to rest after a
     * drop, join, or insert; never on every frame. Set by index.js, which
     * turns it into the engine's onChange(state).
     */
    onChange: null,

    /**
     * Called with the selection (see selection.describeSelection) whenever
     * it changes or moves. Set by index.js from the engine's onSelectionChange.
     */
    onSelectionChange: null,

    /** Reports that the layout has settled (see onChange). */
    changed() {
        if (this.ready) this.onChange?.();
    },

    add(square) {
        if (squares.has(square.id)) throw new Error(`Square ${square.id} already exists`);
        squares.set(square.id, square);
    },

    remove(id) {
        squares.delete(id);
    },

    get(id) {
        return squares.get(id) || null;
    },

    /** All squares, in creation order. */
    all() {
        return [...squares.values()];
    },

    /** The smallest positive id not in use. */
    nextId() {
        let id = 1;
        while (squares.has(id)) id++;
        return id;
    },

    /** Back to the initial state (the squares themselves are removed by index.js). */
    reset() {
        squares.clear();
        this.container = null;
        this.view = { panX: 0, panY: 0, scale: 1 };
        this.selection.clear();
        this.ready = false;
        this.onChange = null;
        this.onSelectionChange = null;
        Object.assign(this.interaction, {
            draggingId: null, lastDraggedId: null, joinTarget: null, thresholdActive: false,
            insertion: null, rest: null, isJoining: false, isSettling: false
        });
    }
};
