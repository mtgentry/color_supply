// The lightness view (pages/lightness.vue): palette swatches drawn as grays of
// their perceived lightness (OKLCH L), like a luminosity blend mode, to check
// the contrast between a palette's colors, and optionally sorted darkest to
// lightest. Off everywhere else.
import { converter, formatHex } from 'culori'

export const useLightnessView = () => useState('lightnessView', () => false)

const toOklch = converter('oklch')
const toRgb = converter('rgb')
const grays = new Map()

// The gray with the same OKLCH lightness as a color, as a hex
export const lightnessGray = (color) => {
  if (!grays.has(color)) {
    const c = toOklch(color)
    grays.set(color, c ? formatHex(toRgb({ mode: 'oklch', l: c.l, c: 0, h: 0 })) : color)
  }
  return grays.get(color)
}

const lightness = new Map()

// A color's perceived lightness, OKLCH L (0 black .. 1 white)
export const lightnessOf = (color) => {
  if (!lightness.has(color)) lightness.set(color, toOklch(color)?.l ?? 0)
  return lightness.get(color)
}

// A palette's colors, darkest first (a copy)
export const darkestFirst = (colors) => [...colors].sort((a, b) => lightnessOf(a) - lightnessOf(b))

// /lightness only: the palettes ranked by contrast score: null (not ranked), 'high'
// (highest first) or 'low' (lowest first). The API ranks them.
export const useLightnessRank = () => useState('lightnessRank', () => null)

// /lightness only: just the palettes even_out_lightness changed (lib/lightness/revised.js)
export const useLightnessRevised = () => useState('lightnessRevised', () => false)

// Shown on /lightness only: each palette's contrast score under it
export const useLightnessScores = () => useState('lightnessScores', () => false)

// How far apart, in OKLCH L, the two closest colors need to be to count as
// clearly different (lightness runs 0..1)
// The API ranks with the same score (color_supply_backend core/palettes/contrast.py): keep them in step
const DISTINCT = 0.10 // Full color difference (OKLab) at which two colors stop looking alike

const toOklab = converter('oklab')
const colorDifference = (a, b) => {
  const x = toOklab(a), y = toOklab(b)
  return Math.hypot(x.l - y.l, x.a - y.a, x.b - y.b)
}

/**
 * A palette's contrast, 1..10, from two things:
 *   - Spacing (lightness): sorted dark to light, are the steps between
 *     neighbors equal? 1 minus how much they vary (standard deviation over
 *     the mean), so one short step costs some, not everything.
 *   - No look-alikes (full color): the two most similar colors in the palette
 *     have to be at least DISTINCT apart (OKLab, so hue and chroma count: a
 *     green and a pink of the same lightness don't look alike).
 * Score = 1 + 9 x spacing x look-alikes. A 10: equal steps, no two colors
 * alike. The exact lightness values don't matter, only the steps between them.
 * @returns {number|null} 1.0..10.0, one decimal; null for fewer than two colors
 */
export const contrastScore = (colors) => {
  if (!colors || colors.length < 2) return null
  const ls = colors.map(lightnessOf).sort((a, b) => a - b)
  const steps = ls.slice(1).map((l, i) => l - ls[i])
  const mean = steps.reduce((a, b) => a + b, 0) / steps.length
  const spread = Math.sqrt(steps.reduce((sum, s) => sum + (s - mean) ** 2, 0) / steps.length)
  const even = mean > 0 ? Math.max(0, 1 - spread / mean) : 0 // 0..1: 1 when every step is the same

  let closest = Infinity
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) closest = Math.min(closest, colorDifference(colors[i], colors[j]))
  }
  const distinct = Math.min(1, closest / DISTINCT) // 0..1: do the two most similar colors still look different?

  return Math.round((1 + 9 * even * distinct) * 10) / 10 // One decimal, e.g. 4.7
}
