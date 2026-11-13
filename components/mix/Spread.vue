<template lang="pug">
  //- On the canvas (components/mix/Canvas.vue). Presses stay here (not a marquee on the canvas).
  .mix-spread(@pointerdown.stop)
    v-switch(
      :model-value="on"
      @update:model-value="toggle"
      :disabled="moving || (!on && !canSpread)"
      color="primary"
      density="compact"
      hide-details
      inset)
      template(#label)
        .name {{ label }}
          .description(v-if="description") {{ description }}
</template>

<script setup>
// A switch that moves the hues of the selected squares (or all of them, as the
// sliders do) with one of the spreads in lib/mix/spreads. Turning it off puts
// the colors back. It shows on only while the squares still have the spread
// colors, so any other change (a slider, a join, a new selection) turns it off.
// While off, it's disabled when the spread doesn't apply to the palette, or
// wouldn't change it.
import gsap from 'gsap'

const props = defineProps({
  label: { type: String, required: true },
  description: String, // One line under the label: what it does
  // ([{ id, oklch }]) => the same with new hues, or null if it doesn't apply
  move: { type: Function, required: true }
})

const mixStore = useMixStore()
const asColors = (squares) => squares.map((s) => ({ id: s.id, oklch: { mode: 'oklch', ...s.oklch } }))

const DURATION = 0.5 // Seconds the hues take to move

// The last spread: { ids, before: [{ id, oklch }], after: Map(id -> hex) }
const last = ref(null)
const moving = ref(false)
const movingTo = ref(false) // While the hues move: where the switch is headed

// The squares it acts on, as { id, hex, oklch }: the selection, else every square
const targets = computed(() => {
  const squares = mixStore.state?.squares || []
  const selected = mixStore.selection?.ids || []
  if (!selected.length) return squares
  const ids = new Set(selected)
  return squares.filter((s) => ids.has(s.id))
})

// Applies, and would move some hue by more than a hair
const canSpread = computed(() => {
  const before = asColors(targets.value)
  const after = props.move(before)
  return !!after && after.some((c, i) => Math.abs(((c.oklch.h - before[i].oklch.h + 540) % 360) - 180) > 0.5)
})

// On while the targets are exactly the squares last spread, still in their spread colors
const on = computed(() => {
  if (moving.value) return movingTo.value
  const l = last.value
  if (!l) return false
  return targets.value.length === l.ids.length &&
    targets.value.every((s) => l.after.get(s.id) === s.hex)
})

// Moves each square from one color to another, the short way around the hue circle
const animate = (from, to) => {
  const engine = mixStore.engine
  if (!engine) return Promise.resolve()
  const target = new Map(to.map((c) => [c.id, c.oklch]))
  const step = { t: 0 }
  const frame = (t) => from.map(({ id, oklch }) => {
    const end = target.get(id)
    const turn = ((end.h - oklch.h + 540) % 360) - 180
    return { id, oklch: { ...end, h: (oklch.h + turn * t + 360) % 360 } }
  })
  moving.value = true
  return new Promise((resolve) => gsap.to(step, {
    t: 1,
    duration: DURATION,
    ease: 'power2.inOut',
    onUpdate: () => engine.setColors(frame(step.t), { settled: false }),
    onComplete: () => {
      engine.setColors(to, { settled: true })
      moving.value = false
      resolve()
    }
  }))
}

const toggle = async (value) => {
  const engine = mixStore.engine
  if (!engine || moving.value) return
  movingTo.value = value
  if (value) {
    const before = asColors(targets.value)
    const after = props.move(before)
    if (!after) return
    last.value = { ids: before.map((c) => c.id), before, after: new Map() }
    await animate(before, after)
    const ids = new Set(last.value.ids)
    last.value.after = new Map(engine.getState().squares.filter((s) => ids.has(s.id)).map((s) => [s.id, s.hex]))
    trackEvent('Mix Spread', { spread: props.label, colors: before.length })
  } else if (on.value) {
    const { before } = last.value
    const now = engine.getState().squares
    const current = before.map(({ id }) => {
      const s = now.find((sq) => sq.id === id)
      return { id, oklch: { mode: 'oklch', ...s.oklch } }
    })
    await animate(current, before)
    last.value = null
  }
}
</script>

<style scoped lang="sass">
.mix-spread
  :deep(.v-label)
    font-size: 13px
    letter-spacing: .3px
    color: var(--color3)
    opacity: 1
    padding-left: 10px
  .description
    font-size: 12px
    letter-spacing: .2px
    color: var(--color4)
    line-height: 1.3
</style>
