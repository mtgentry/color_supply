<template lang="pug">
  .wheel-gradients
    .circles
      .circle(v-for="(bg, i) in circles" :key="i" :style="{ background: bg }")
    .squares
      .square-group
        .square(v-for="(bg, i) in toWhite" :key="'w' + i" :style="{ background: bg }")
      .square-group
        .square(v-for="(bg, i) in toBlack" :key="'b' + i" :style="{ background: bg }")
</template>

<script setup>
// Gradients built from the selected palette: six circles blending its colors
// (or fading to white/black when it has only two), and each color fading to
// white and to black. Slots without a color are left empty, as on the old site.
const { colors } = storeToRefs(useWheelStore())
const EMPTY = 'var(--color6)'

const blend = (a, b, stop = 95) => `linear-gradient(to bottom, ${a} 0%, ${b} ${stop}%)`

const circles = computed(() => {
  const [c1, c2, c3, c4] = colors.value
  if (!c3) {
    return [blend(c1, c2), blend(c1, '#fff', 75), blend(c2, '#fff', 75),
      blend(c1, '#000', 75), blend(c2, '#000', 75), EMPTY]
  }
  if (!c4) {
    return [blend(c1, c2), blend(c1, c3, 85), blend(c3, c2, 85), EMPTY, EMPTY, EMPTY]
  }
  return [blend(c1, c2), blend(c1, c3, 85), blend(c3, c2, 85),
    blend(c1, c4), blend(c2, c4), blend(c3, c4)]
})

const fade = (to) => computed(() => [0, 1, 2, 3].map((i) => {
  const c = colors.value[i]
  return c ? blend(c, to, 90) : EMPTY
}))
const toWhite = fade('#fff')
const toBlack = fade('#000')
</script>

<style scoped lang="sass">
.circles
  display: flex
  justify-content: space-between
  gap: 16px
  flex-wrap: wrap

.circle
  flex: 0 0 120px
  aspect-ratio: 1
  border-radius: 50%
  @media (max-width: 600px)
    flex-basis: 28%

.squares
  display: flex
  justify-content: space-between
  gap: 48px
  margin-top: 48px
  @media (max-width: 600px)
    flex-direction: column
    gap: 24px

.square-group
  flex: 1 1 0
  display: flex

.square
  flex: 1 1 0
  aspect-ratio: 1
</style>
