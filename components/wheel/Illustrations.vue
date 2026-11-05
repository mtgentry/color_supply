<template lang="pug">
  .wheel-illustrations(:style="vars")
    .illustration(v-for="(svg, i) in badges" :key="i" v-html="svg")
</template>

<script setup>
// The four illustrations, recolored with the selected palette. Each SVG's
// color slots are CSS variables (--c1 to --c4) set here; see assets/wheel/.
import badge1 from '~/assets/wheel/badge1.svg?raw'
import badge2 from '~/assets/wheel/badge2.svg?raw'
import badge3 from '~/assets/wheel/badge3.svg?raw'
import badge4 from '~/assets/wheel/badge4.svg?raw'

const badges = [badge1, badge2, badge3, badge4]
const { colors } = storeToRefs(useWheelStore())

// Same fallbacks as the old site: a missing 3rd or 4th color reuses the 2nd
const vars = computed(() => {
  const [c1, c2, c3, c4] = colors.value
  return { '--c1': c1, '--c2': c2, '--c3': c3 || c2, '--c4': c4 || c2 }
})
</script>

<style scoped lang="sass">
.wheel-illustrations
  display: grid
  grid-template-columns: repeat(4, 1fr)
  gap: 32px
  @media (max-width: 600px)
    grid-template-columns: repeat(2, 1fr)

.illustration
  aspect-ratio: 1
  :deep(svg)
    display: block
    width: 100%
    height: 100%
    overflow: visible
</style>
