<template lang="pug">
  #wheel
    svg.wheel-svg(
      ref="svgEl"
      :viewBox="`0 0 ${SIZE} ${SIZE}`"
      :class="{ dragging }"
      @pointerdown="onPointerDown"
    )
      g.slices
        path.slice(
          v-for="(color, index) in scheme.wheel"
          :key="scheme.id + index"
          :d="slicePath(index, scheme.wheel.length)"
          :fill="color"
        )
      g.overlay(ref="overlayEl")
        line(
          v-if="overlay.toCenter"
          :x1="CENTER" :y1="CENTER - MARKER_RADIUS + MARKER_SIZE"
          :x2="CENTER" :y2="CENTER"
        )
        line(v-for="(l, i) in overlayLines" :key="'l' + i" v-bind="l")
        path(v-for="(d, i) in overlayArcs" :key="'a' + i" :d="d")
        circle(
          v-for="(m, i) in overlayMarkers" :key="'m' + i"
          :cx="m.x" :cy="m.y" :r="MARKER_SIZE"
        )
    .controls
      v-btn(variant="text" prepend-icon="mdi-chevron-left" @click="wheelStore.changeScheme(-1)") Back
      .scheme-name {{ scheme.name }}
      v-btn(variant="text" append-icon="mdi-chevron-right" @click="wheelStore.changeScheme(1)") Next
</template>

<script setup>
// The color wheel: drag it (or click a slice) to turn the pointer to a slice,
// which picks the set of palettes shown next to it. The overlay (Triad,
// Complementary, ...) turns with the pointer.
import {
  SIZE, CENTER, MARKER_RADIUS, MARKER_SIZE, OVERLAYS, INNER_RADIUS, OUTER_RADIUS,
  polar, slicePath, angleOf, angleDelta, sliceAt, trimmedLine, trimmedArc,
} from '~/lib/wheel/geometry.js'
import gsap from 'gsap'

const wheelStore = useWheelStore()
const { scheme, slice } = storeToRefs(wheelStore)

const svgEl = ref()
const overlayEl = ref()
// Rotation of the pointer in degrees (not wrapped to 0-360)
let rotation = 0
const dragging = ref(false)

// Animations use the same GSAP calls as the small harmony wheel on /palettes
// (components/explore/harmony/Circle.vue): 0.15s to a picked slice, the short
// way round, and 0.2s to settle after a drag.
const PICK_DURATION = 0.15
const SETTLE_DURATION = 0.2

onMounted(() => {
  gsap.set(overlayEl.value, { svgOrigin: `${CENTER} ${CENTER}`, rotation: 0 })
})
onBeforeUnmount(() => gsap.killTweensOf(overlayEl.value))

const sliceWidth = computed(() => 360 / scheme.value.wheel.length)
const overlay = computed(() => OVERLAYS[scheme.value.overlay] || OVERLAYS.single)
const overlayMarkers = computed(() => overlay.value.markers.map((a) => polar(a, MARKER_RADIUS)))
const overlayLines = computed(() => overlay.value.lines.map(([i, j]) =>
  trimmedLine(overlay.value.markers[i], overlay.value.markers[j])))
const overlayArcs = computed(() => (overlay.value.arcs || []).map(([i, j]) =>
  trimmedArc(overlay.value.markers[i], overlay.value.markers[j])))

// A new scheme starts with the pointer at the top, without animating there
watch(() => scheme.value.id, () => {
  rotation = 0
  gsap.killTweensOf(overlayEl.value)
  gsap.set(overlayEl.value, { rotation: 0 })
})

// Pointer position in the wheel's own coordinates
const svgPoint = (event) => {
  const svg = svgEl.value
  const pt = svg.createSVGPoint()
  pt.x = event.clientX
  pt.y = event.clientY
  return pt.matrixTransform(svg.getScreenCTM().inverse())
}

const pointerAngle = (event) => {
  const p = svgPoint(event)
  return angleOf(p.x, p.y)
}

// Turn the pointer to `angle` and pick the slice under it. While dragging it
// follows the pointer directly; otherwise it animates there.
const setRotation = (angle, duration = 0) => {
  rotation = angle
  wheelStore.setSlice(sliceAt(angle, scheme.value.wheel.length))
  if (duration) {
    gsap.to(overlayEl.value, { rotation: `${((angle % 360) + 360) % 360}_short`, duration, overwrite: true })
  } else {
    gsap.killTweensOf(overlayEl.value)
    gsap.set(overlayEl.value, { rotation: angle })
  }
}

// Turn to `index` the short way round
const rotateToSlice = (index) => {
  const target = index * sliceWidth.value
  setRotation(rotation + angleDelta(rotation, target), PICK_DURATION)
}

let lastAngle = 0
let moved = false

const onPointerDown = (event) => {
  if (event.button !== 0) return
  dragging.value = true
  moved = false
  lastAngle = pointerAngle(event)
  svgEl.value.setPointerCapture(event.pointerId)
  svgEl.value.addEventListener('pointermove', onPointerMove)
  svgEl.value.addEventListener('pointerup', onPointerUp)
  svgEl.value.addEventListener('pointercancel', onPointerUp)
}

const onPointerMove = (event) => {
  const angle = pointerAngle(event)
  const d = angleDelta(lastAngle, angle)
  if (!moved && Math.abs(d) < 1) return
  moved = true
  lastAngle = angle
  setRotation(rotation + d)
}

const onPointerUp = (event) => {
  svgEl.value.removeEventListener('pointermove', onPointerMove)
  svgEl.value.removeEventListener('pointerup', onPointerUp)
  svgEl.value.removeEventListener('pointercancel', onPointerUp)
  dragging.value = false
  if (moved) {
    // Settle on the middle of the slice under the pointer
    setRotation(Math.round(rotation / sliceWidth.value) * sliceWidth.value, SETTLE_DURATION)
    return
  }
  // A click (no drag) on the ring turns the pointer to the clicked slice
  const p = svgPoint(event)
  const distance = Math.hypot(p.x - CENTER, p.y - CENTER)
  if (distance >= INNER_RADIUS && distance <= OUTER_RADIUS) {
    rotateToSlice(sliceAt(angleOf(p.x, p.y), scheme.value.wheel.length))
  }
}

// Keep the pointer in step if the slice changes from elsewhere
watch(slice, (index) => {
  if (dragging.value) return
  if (sliceAt(rotation, scheme.value.wheel.length) !== index) rotateToSlice(index)
})
</script>

<style scoped lang="sass">
#wheel
  width: 100%
  max-width: 440px

.wheel-svg
  display: block
  width: 100%
  height: auto
  cursor: grab
  touch-action: none
  user-select: none
  &.dragging
    cursor: grabbing

.slice
  stroke: none
  cursor: pointer

.overlay
  pointer-events: none
  line, path, circle
    fill: none
    stroke: var(--color2)
    stroke-width: 2
  circle
    stroke-width: 2.5

.controls
  display: flex
  align-items: center
  justify-content: space-between
  margin-top: 16px
  .v-btn
    font-size: 15px
    color: var(--color2)
  .scheme-name
    font-size: 13px
    font-weight: 500
    letter-spacing: 0.08em
    text-transform: uppercase
    color: var(--color3)
</style>
