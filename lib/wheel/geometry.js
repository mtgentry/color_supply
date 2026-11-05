// Geometry for the color wheel on /wheel.
// Angles are in degrees, 0 at the top, increasing clockwise (SVG's y axis points down).

export const SIZE = 440
export const CENTER = SIZE / 2
export const OUTER_RADIUS = 216
export const INNER_RADIUS = 100
export const MARKER_RADIUS = 158 // Where overlay markers sit: the middle of the ring
export const MARKER_SIZE = 16

// A point at `radius` from the centre, `angle` degrees clockwise from the top
export const polar = (angle, radius) => {
  const rad = (angle - 90) * Math.PI / 180
  return { x: CENTER + radius * Math.cos(rad), y: CENTER + radius * Math.sin(rad) }
}

// The ring slice for slice `index` of `count`; slice 0 is centred on the top
export const slicePath = (index, count) => {
  const width = 360 / count
  const start = index * width - width / 2
  const end = start + width
  const large = width > 180 ? 1 : 0
  const a = polar(start, OUTER_RADIUS)
  const b = polar(end, OUTER_RADIUS)
  const c = polar(end, INNER_RADIUS)
  const d = polar(start, INNER_RADIUS)
  return [
    `M${a.x},${a.y}`,
    `A${OUTER_RADIUS},${OUTER_RADIUS} 0 ${large} 1 ${b.x},${b.y}`,
    `L${c.x},${c.y}`,
    `A${INNER_RADIUS},${INNER_RADIUS} 0 ${large} 0 ${d.x},${d.y}`,
    'Z',
  ].join(' ')
}

// Angle of a point (in SVG coordinates) around the centre
export const angleOf = (x, y) => {
  const deg = Math.atan2(x - CENTER, -(y - CENTER)) * 180 / Math.PI
  return (deg + 360) % 360
}

// Smallest signed difference from angle a to angle b, in (-180, 180]
export const angleDelta = (a, b) => {
  const d = ((b - a) % 360 + 540) % 360 - 180
  return d === -180 ? 180 : d
}

// The slice under the pointer for a (possibly unwrapped) rotation angle
export const sliceAt = (angle, count) => {
  const width = 360 / count
  return ((Math.round(angle / width) % count) + count) % count
}

// Marker angles for each color-theory overlay, relative to the pointer at the top.
// `lines` are pairs of marker indexes joined by a straight line; `arcs` are joined
// along the marker circle (Analogous).
export const OVERLAYS = {
  single:          { markers: [0],               lines: [],                               toCenter: true },
  complementary:   { markers: [0, 180],          lines: [[0, 1]] },
  analogous:       { markers: [-30, 0, 30],      lines: [], arcs: [[0, 1], [1, 2]] },
  triad:           { markers: [0, 120, 240],     lines: [[0, 1], [1, 2], [2, 0]] },
  splitComplement: { markers: [0, 150, 210],     lines: [[0, 1], [0, 2]] },
  square:          { markers: [0, 90, 180, 270], lines: [[0, 1], [1, 2], [2, 3], [3, 0]] },
}

// A line between two markers, trimmed so it starts and ends at the marker circles
export const trimmedLine = (angleA, angleB) => {
  const a = polar(angleA, MARKER_RADIUS)
  const b = polar(angleB, MARKER_RADIUS)
  const len = Math.hypot(b.x - a.x, b.y - a.y)
  const ux = (b.x - a.x) / len
  const uy = (b.y - a.y) / len
  return {
    x1: a.x + ux * MARKER_SIZE, y1: a.y + uy * MARKER_SIZE,
    x2: b.x - ux * MARKER_SIZE, y2: b.y - uy * MARKER_SIZE,
  }
}

// An arc along the marker circle between two markers, trimmed at both ends
export const trimmedArc = (angleA, angleB) => {
  const trim = (MARKER_SIZE / MARKER_RADIUS) * 180 / Math.PI
  const from = polar(angleA + trim, MARKER_RADIUS)
  const to = polar(angleB - trim, MARKER_RADIUS)
  return `M${from.x},${from.y} A${MARKER_RADIUS},${MARKER_RADIUS} 0 0 1 ${to.x},${to.y}`
}
