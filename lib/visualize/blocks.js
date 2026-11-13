// The Visualize blocks artboard: a tall layout, 1027 units wide, of color blocks.
// Shared by the artboard (components/visualize/Blocks.vue) and the /layout_2
// prototype, which shows it for palettes of 2 to 5 colors.
//
// Module 1's height can vary (the artboard sizes it to the window); everything
// below it moves with it. blocksLayout(top) gives the layout for a module 1
// that many units tall; the named exports below are the layout at TOP.

import { DOTS_WIDTH, DOTS_HEIGHT } from './dots.js'
import { RING_SIZE, SMALL_RING_SIZE, CLUSTER_WIDTH, CLUSTER_HEIGHT, ROUND_SIZE } from './ring.js'
import { A_WIDTH, A_HEIGHT, ASTERISK_CENTER } from './glyphs.js'
import { EYE_WHITE_WIDTH, EYE_WHITE_HEIGHT, IRIS_DIAMETER, PUPIL_DIAMETER } from './eye.js'

export const WIDTH = 1027
// The stacked layout's width: modules 2 to 6's width in the mockup
export const STACKED_WIDTH = 514
// Module 1's default height (716 in the reference mockup, which read as too
// tall; the rows below it follow it, see blocksLayout)
export const TOP = 550
// Half of module 1's height in the reference mockup's grid, which the shapes
// below module 1 were measured at
const DESIGN_U = 257

// Module 1's three stars (lib/visualize/stars.js), in a row, as in the
// reference mockup: 221 units across, centers 293 apart with the middle one
// on the module's center line, at the module's mid-height.
const STAR_DRAWN = 221 // Size in layout units (the files are 267)
const STAR_SPACING = 293 // Center to center
const FILE_SCALE = STAR_DRAWN / 267 // Layout units per unit of the element files
// Module 1 is never shorter than this, so the stars keep room around them
export const MIN_TOP = Math.round(STAR_DRAWN * 1.5)
// Nor taller than in the reference mockup (in a tall, narrow column, like a
// phone's or an upright tablet's, it would otherwise dwarf the stars)
export const MAX_TOP = 716

// Each block's role: which of the five colors in the sketch it takes:
// 0 the large top block (cream), 1 blue, 2 orange, 3 white, 4 pink. Module 5
// has a role of its own (5): white too, unless the scene adds a white
// neutral, when it keeps a fifth palette color in the scene (see roleColors).
const ROLES = [0, 1, 2, 3, 5, 4, 2, 1]
export const ROLE_COUNT = 5
const MODULE_5_ROLE = 5

// Roles of the shapes in modules 1 and 5 (from the shapes' colors in the files;
// module 5's ring's dark blue takes the blue role) and module 6's disc
const STAR_ROLES = [2, 1, 4]
const DISC_ROLE = 0

/**
 * The layout for a module 1 `top` units tall: blocks (top to bottom) and the
 * shapes on them, in layout units.
 *
 * Every row's height is locked to module 1's, in units of half of it (u), as
 * in the reference mockup: module 1 is 2u; module 2 is 2u beside modules 3
 * and 4, u each; modules 5 and 6 are u; modules 7 and 8 are 2u.
 *
 * The shapes were measured in the mockup, where u was 257 (DESIGN_U). Each
 * module's shapes keep that drawing, scaled down to fit when the module is
 * smaller than in the mockup and centered in it when it's taller.
 *
 * Stacked (a narrow column, like a phone's): half as wide (STACKED_WIDTH),
 * with modules 2 to 6 one above another at the column's full width, which is
 * their width in the mockup. Module 1 is square, 2u, and modules 7 and 8 a
 * row of u, with u at the mockup's 257; module 1's stars and modules 7 and 8
 * shrink to fit. `top` is ignored.
 */
export function blocksLayout(top = TOP, { stacked = false } = {}) {
  let width, BLOCKS
  if (stacked) {
    const u = DESIGN_U
    width = STACKED_WIDTH
    top = 2 * u
    const w7 = Math.round((width * 763) / WIDTH) // Modules 7 and 8 split as in the mockup
    BLOCKS = [
      { x: 0, y: 0, w: width, h: top },
      { x: 0, y: top, w: width, h: 2 * u },
      { x: 0, y: top + 2 * u, w: width, h: u },
      { x: 0, y: top + 3 * u, w: width, h: u },
      { x: 0, y: top + 4 * u, w: width, h: u },
      { x: 0, y: top + 5 * u, w: width, h: u },
      { x: 0, y: top + 6 * u, w: w7, h: u },
      { x: w7, y: top + 6 * u, w: width - w7, h: u },
    ]
  } else {
    top = Math.min(MAX_TOP, Math.max(MIN_TOP, top))
    const u = top / 2
    width = WIDTH
    BLOCKS = [
      { x: 0, y: 0, w: 1027, h: top },
      { x: 0, y: top, w: 513, h: 2 * u },
      { x: 513, y: top, w: 514, h: u },
      { x: 513, y: top + u, w: 514, h: u },
      { x: 0, y: top + 2 * u, w: 513, h: u },
      { x: 513, y: top + 2 * u, w: 514, h: u },
      { x: 0, y: top + 3 * u, w: 763, h: 2 * u },
      { x: 763, y: top + 3 * u, w: 264, h: 2 * u },
    ]
  }
  BLOCKS = BLOCKS.map((b, i) => ({ ...b, role: ROLES[i] }))
  const last = BLOCKS[BLOCKS.length - 1]
  const height = last.y + last.h

  // A module's drawing, as in the mockup (its width there, by default the
  // module's, and its height in units of u), fitted to the module: s scales
  // it, and at(dx, dy) is where a point of the drawing lands.
  const fit = (block, rows, designW = block.w) => {
    const designH = rows * DESIGN_U
    const s = Math.min(1, block.w / designW, block.h / designH)
    const x = block.x + (block.w - designW * s) / 2
    const y = block.y + (block.h - designH * s) / 2
    return { s, at: (dx, dy) => ({ x: x + dx * s, y: y + dy * s }) }
  }

  // Module 1's stars, shrunk if the row of three is wider than 90% of the module
  const starScale = Math.min(1, (BLOCKS[0].w * 0.9) / (2 * STAR_SPACING + STAR_DRAWN))
  const STARS = STAR_ROLES.map((role, i) => ({
    star: i, // Index into STAR_PATHS
    role,
    x: BLOCKS[0].x + BLOCKS[0].w / 2 + ((i - 1) * STAR_SPACING - STAR_DRAWN / 2) * starScale,
    y: BLOCKS[0].y + top / 2 - (STAR_DRAWN * starScale) / 2,
    size: STAR_DRAWN * starScale,
  }))

  // Module 2 (measured from the reference mockup, at the files' scale): a large
  // circle (Ellipse 631.svg, 481 across) near the top left with a ring of twelve
  // dots (lib/visualize/ring.js) on its center, and a small circle (144 across)
  // at the bottom right, over the large one's edge, holding the small line star
  // (SMALL_STAR_PATH in lib/visualize/stars.js, 59 across).
  const m2 = fit(BLOCKS[1], 2)
  const BIG_CENTER = m2.at(209, 209) // 209 from the module's left and top
  const SMALL_CENTER = m2.at(441, 438)
  const f2 = FILE_SCALE * m2.s
  const CIRCLES = {
    big: { cx: BIG_CENTER.x, cy: BIG_CENTER.y, r: (481 * f2) / 2 },
    ring: { x: BIG_CENTER.x - (RING_SIZE * f2) / 2, y: BIG_CENTER.y - (RING_SIZE * f2) / 2, scale: f2 },
    small: { cx: SMALL_CENTER.x, cy: SMALL_CENTER.y, r: (144 * f2) / 2 },
    star: { x: SMALL_CENTER.x - (59 * f2) / 2, y: SMALL_CENTER.y - (59 * f2) / 2, scale: f2 },
  }

  // A drawing `width` x `height` (in file units) centered at a point of a
  // fitted module, at the files' scale
  const centered = (m, dx, dy, width, height, role) => {
    const c = m.at(dx, dy)
    const f = FILE_SCALE * m.s
    return { x: c.x - (width * f) / 2, y: c.y - (height * f) / 2, scale: f, role }
  }

  // Module 5's two groups of dots (lib/visualize/ring.js), side by side at the
  // module's mid-height, at the files' scale: a ring of small dots centered 138
  // from the module's left and a cluster centered 352 from it (measured from the
  // reference mockup).
  const M5 = BLOCKS[4]
  const m5 = fit(M5, 1)
  const DOT_GROUPS = {
    ring: centered(m5, 138, DESIGN_U / 2, SMALL_RING_SIZE, SMALL_RING_SIZE, 1),
    cluster: centered(m5, 352, DESIGN_U / 2, CLUSTER_WIDTH, CLUSTER_HEIGHT, 2),
  }

  // Module 6's two round shapes (lib/visualize/ring.js), side by side at the
  // module's mid-height, at the files' scale: a disc with a hole and a hoop,
  // spaced evenly (the same gap at the module's sides and between the two).
  const M6 = BLOCKS[5]
  const m6 = fit(M6, 1)
  const ROUND_DRAWN = ROUND_SIZE * FILE_SCALE
  const ROUND_GAP = (M6.w - 2 * ROUND_DRAWN) / 3
  const ROUNDS = {
    disc: centered(m6, ROUND_GAP + ROUND_DRAWN / 2, DESIGN_U / 2, ROUND_SIZE, ROUND_SIZE, DISC_ROLE),
    hoop: centered(m6, M6.w - ROUND_GAP - ROUND_DRAWN / 2, DESIGN_U / 2, ROUND_SIZE, ROUND_SIZE, null),
  }

  // Module 3's eye (lib/visualize/eye.js), centered in the module as in the
  // reference mockup, at the same scale as the stars.
  const M3 = BLOCKS[2]
  const m3 = fit(M3, 1)
  const eyeScale = FILE_SCALE * m3.s
  const EYE = {
    cx: M3.x + M3.w / 2,
    cy: M3.y + M3.h / 2,
    scale: eyeScale,
    white: {
      x: M3.x + M3.w / 2 - (EYE_WHITE_WIDTH * eyeScale) / 2,
      y: M3.y + M3.h / 2 - (EYE_WHITE_HEIGHT * eyeScale) / 2,
    },
    irisRadius: (IRIS_DIAMETER * eyeScale) / 2,
    pupilRadius: (PUPIL_DIAMETER * eyeScale) / 2,
  }

  // Module 4's dots (lib/visualize/dots.js): the file's 616 x 307 box centered
  // in the module at the files' scale, which all but fills it in the mockup
  // (510 x 254 of 514 x 256). Dots on the box's edge are cut off there, as in
  // the file.
  const M4 = BLOCKS[3]
  const dotsScale = FILE_SCALE * fit(M4, 1).s
  const DOTS_BOX = {
    x: M4.x + (M4.w - DOTS_WIDTH * dotsScale) / 2,
    y: M4.y + (M4.h - DOTS_HEIGHT * dotsScale) / 2,
    w: DOTS_WIDTH * dotsScale,
    h: DOTS_HEIGHT * dotsScale,
  }

  // Modules 7 and 8 (measured from the reference mockup, at the files' scale): a
  // capital A (lib/visualize/glyphs.js) the height of module 7, and a circle (424 across in its file) centered on the line
  // between the two modules, holding an asterisk on its center.
  const M7 = BLOCKS[6]
  const m7 = fit(M7, 2, 763)
  const f7 = FILE_SCALE * m7.s
  // The A is exactly the module's height, centered 324 from its left (or
  // further right if it's tall enough to cross the module's left edge)
  const letterScale = M7.h / A_HEIGHT
  const letterWidth = A_WIDTH * letterScale
  const letterCenter = (324 * M7.w) / 763
  const LETTER = {
    x: M7.x + Math.max(letterCenter, letterWidth / 2) - letterWidth / 2,
    y: M7.y,
    scale: letterScale,
  }
  const BADGE_CENTER = { x: M7.x + M7.w, y: M7.y + M7.h / 2 }
  const BADGE = {
    cx: BADGE_CENTER.x,
    cy: BADGE_CENTER.y,
    r: (424 * f7) / 2,
    asterisk: {
      x: BADGE_CENTER.x - ASTERISK_CENTER.x * f7,
      y: BADGE_CENTER.y - ASTERISK_CENTER.y * f7,
      scale: f7,
    },
  }

  return { TOP: top, WIDTH: width, HEIGHT: height, STACKED: stacked, BLOCKS, STARS, CIRCLES, DOT_GROUPS, ROUNDS, EYE, DOTS_BOX, LETTER, BADGE }
}

// The layout at the default height (/layout_2 shows it this way)
export const { HEIGHT, BLOCKS, STARS, CIRCLES, DOT_GROUPS, ROUNDS, EYE, DOTS_BOX, LETTER, BADGE } = blocksLayout()

// The block at a point of a layout (the default one if none is given), if any
export function blockAt(x, y, blocks = BLOCKS) {
  return blocks.find((b) => x >= b.x && x < b.x + b.w && y >= b.y && y < b.y + b.h)
}

// Neutrals: a white and a black the scene can add to the palette's colors
// (they're never part of the palette itself). White takes the sketch's white
// role (modules 4 and 5, the eye's white, the small circle in module 2, the
// circle over modules 7 and 8); black takes the shapes that are near-black in
// the sketch (the pupil, the A, the hoop, the small star, module 4's dots).
const WHITE_ROLE = 3
export const PURE_NEUTRALS = { white: '#FFFFFF', black: '#000000' }

/**
 * The neutrals for a palette, as { white, black } hexes, null where off.
 * Tinted ones lean toward the palette: an off-white mixed from its lightest
 * color, a near-black from its darkest.
 */
export function neutralColors(colors, { white = true, black = true, tinted = true } = {}) {
  const list = colors?.length ? colors : ['#808080']
  const lightest = list.reduce((a, b) => (luminance(b) > luminance(a) ? b : a))
  return {
    white: white ? (tinted ? mix(lightest, '#FFFFFF', 0.88) : PURE_NEUTRALS.white) : null,
    black: black ? (tinted ? mix(darkest(list), '#000000', 0.82) : PURE_NEUTRALS.black) : null,
  }
}

// Two hexes mixed: `amount` of the way from a to b
function mix(a, b, amount) {
  const channels = (hex) => [0, 2, 4].map((i) => parseInt(hex.replace('#', '').slice(i, i + 2), 16))
  const [ca, cb] = [channels(a), channels(b)]
  return '#' + ca.map((c, i) => Math.round(c + (cb[i] - c) * amount).toString(16).padStart(2, '0')).join('').toUpperCase()
}

/**
 * The color for each role: [role 0, ..., role 5] as hexes. For now the
 * palette's colors in order, repeating for palettes shorter than five (a
 * 3-color palette gives colors 0, 1, 2, 0, 1), with module 5's role matching
 * the white role. With a white neutral, the white role takes it and the
 * palette spreads over roles 0, 1, 2 and 4; module 5 takes a fifth palette
 * color if there is one, or else the white.
 */
export function roleColors(colors, white = null) {
  const list = colors?.length ? colors : ['#F4F0E6']
  if (!white) {
    const roles = Array.from({ length: ROLE_COUNT }, (_, i) => list[i % list.length])
    return [...roles, roles[WHITE_ROLE]]
  }
  const roles = []
  for (let role = 0, i = 0; role < ROLE_COUNT; role++) {
    roles.push(role === WHITE_ROLE ? white : list[i++ % list.length])
  }
  roles[MODULE_5_ROLE] = list.length > 4 ? list[4] : white
  return roles
}

/**
 * A shape's color on top of the color behind it: its role's, unless that's the
 * same color (short palettes repeat colors), when it takes the first role
 * color that differs.
 */
function colorOver(roles, role, behind) {
  if (roles[role] !== behind) return roles[role]
  return roles.find((color) => color !== behind) || roles[role]
}

// A star's color, on module 1
export function starColor(roles, role) {
  return colorOver(roles, role, roles[ROLES[0]])
}

// Dark shapes that aren't a palette color (the files' near-black)
export const INK = '#1D1E20'

/**
 * Module 2's colors: the large circle takes role 2 (the sketch's dark blue
 * isn't one of the five), the ring role 4 (pink) and the small circle role 3
 * (white), each moving to another color if it would match what's behind it.
 */
export function circlesColors(roles, ink = null) {
  const block = roles[ROLES[1]]
  const big = colorOver(roles, 2, block)
  const small = colorOver(roles, 3, block)
  // The small circle's star, like the A, takes the darkest color that shows on it
  return { big, ring: colorOver(roles, 4, big), small, star: darkestOver(roles, small, ink) }
}

// A dot group's color, on module 5
export function dotGroupColor(roles, role) {
  return colorOver(roles, role, roles[ROLES[4]])
}

// The disc's color, on module 6: role 0 (cream in the sketch)
export function discColor(roles) {
  return colorOver(roles, DISC_ROLE, roles[ROLES[5]])
}

// A hex's relative luminance (0 black to 1 white)
function luminance(hex) {
  const n = parseInt(hex.replace('#', '').slice(0, 6), 16)
  const linear = (c) => (c /= 255) <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  return 0.2126 * linear(n >> 16) + 0.7152 * linear((n >> 8) & 255) + 0.0722 * linear(n & 255)
}

// The darkest of a list of hexes
const darkest = (list) => list.reduce((a, b) => (luminance(b) < luminance(a) ? b : a))

/**
 * The eye's colors: the white takes role 3 (white in the sketch) and the iris
 * role 1 (blue), each moving to another color if it would match what's behind
 * it. The pupil takes the palette's darkest color that isn't the iris's.
 */
export function eyeColors(roles, ink = null) {
  const white = colorOver(roles, 3, roles[ROLES[2]])
  const iris = colorOver(roles, 1, white)
  return { white, iris, pupil: darkestOver(roles, iris, ink) }
}

/**
 * The color for a shape that's near-black in the sketch (the A, the hoop, the
 * small star, the pupil): the black neutral (ink) when it's on, or else the
 * palette's darkest color that isn't the one behind it.
 */
export function darkestOver(roles, behind, ink = null) {
  if (ink && ink !== behind) return ink
  const others = roles.filter((color) => color !== behind)
  return darkest(others.length ? others : roles)
}

// The A's color, on module 7
export function letterColor(roles, ink = null) {
  return darkestOver(roles, roles[ROLES[6]], ink)
}

// The hoop's color, on module 6
export function hoopColor(roles, ink = null) {
  return darkestOver(roles, roles[ROLES[5]], ink)
}

/**
 * The badge's colors: the circle takes role 3 (white in the sketch), moving to
 * another color if that's module 7's, and the asterisk role 1 (blue), moving
 * if that's the circle's. (A 2-color palette leaves the circle in module 8's
 * color: there are only the two.)
 */
export function badgeColors(roles) {
  const circle = colorOver(roles, 3, roles[ROLES[6]])
  return { circle, asterisk: colorOver(roles, 1, circle) }
}
