<template lang="pug">
  svg(ref="el" :class="{ pop: popping }" xmlns='http://www.w3.org/2000/svg' width='16' height='13' viewBox='0 0 15 13' :fill='shownFill' @animationend="onPopEnd")
    path(d='M2.15083 2.67276L2.15083 2.67276C3.04282 1.50279 4.35044 1.26457 5.45391 1.61504C6.57819 1.97211 7.40352 2.9043 7.40352 4.01512H7.90352H8.40352C8.40352 2.90428 9.22887 1.97198 10.3533 1.61485C11.4568 1.26434 12.7647 1.50251 13.6572 2.67271C14.576 3.87822 14.6285 5.58971 13.6589 7.40582C12.7117 9.18018 10.8025 11.0058 7.9035 12.3749C5.00452 11.006 3.09532 9.18055 2.14824 7.40622C1.17888 5.59017 1.2315 3.87856 2.15083 2.67276Z' :stroke='shownStroke')
</template>

<script setup>
// The heart. When it's tapped and turns filled (favorited), it plays a short "favorited"
// animation instead of an alert: the outline quickly grows, then the filled heart
// replaces it at full size and settles back with a small bounce.
// Only right after a tap on this heart (or the button around it): a list that refreshes
// with favorited palettes, or a heart reused for another palette, just changes color.
const props = defineProps({
  fill: {
    type: String,
    default: 'none',
  },
  stroke: {
    type: String,
    default: '#A4A7B1',
  }
})

// popped: a tap favorited it and its animation has finished (at once with reduced motion)
const emit = defineEmits(['popped'])

const GROW_MS = 120   // The outline growing; matches the 30% keyframe of the 400ms heart-pop below
const ARMED_MS = 4000 // How long after a tap a fill still counts as "this tap favorited it" (a save waits for the server)

const el = ref()
const shownFill = ref(props.fill)
const shownStroke = ref(props.stroke)
const popping = ref(false)
let tappedAt = 0
let swapTimer = null

const isFilled = (fill) => !!fill && fill !== 'none' && fill !== 'transparent'
const show = () => {
  shownFill.value = props.fill
  shownStroke.value = props.stroke
}

watch(() => [props.fill, props.stroke], ([fill], [oldFill]) => {
  clearTimeout(swapTimer)
  const favorited = isFilled(fill) && !isFilled(oldFill)
  const tapped = Date.now() - tappedAt < ARMED_MS
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!favorited || !tapped || reduced) {
    popping.value = false
    show()
    if (favorited && tapped) {
      tappedAt = 0
      emit('popped')
    }
    return
  }
  tappedAt = 0
  // Restart the animation even if one is still running
  popping.value = false
  requestAnimationFrame(() => { popping.value = true })
  swapTimer = setTimeout(show, GROW_MS) // Gray while it grows, then the filled heart
})

const onPopEnd = () => {
  popping.value = false
  emit('popped')
}

let target = null
const onTap = () => { tappedAt = Date.now() }
onMounted(() => {
  target = el.value?.closest('button') || el.value
  target?.addEventListener('click', onTap, true)
})
onBeforeUnmount(() => {
  clearTimeout(swapTimer)
  target?.removeEventListener('click', onTap, true)
})
</script>

<style scoped lang="sass">
svg
  cursor: pointer
  overflow: visible
  transform-origin: 50% 55%
  &.pop
    animation: heart-pop 400ms ease-out

// 0-30%: the outline grows; at 30% the filled heart takes its place (GROW_MS) and settles
@keyframes heart-pop
  0%
    transform: scale(1)
  30%
    transform: scale(1.45)
  55%
    transform: scale(0.9)
  78%
    transform: scale(1.08)
  100%
    transform: scale(1)
</style>
