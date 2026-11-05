<template lang="pug">
  .wheel-triangles(:style="vars")
    .band.desktop(v-html="desktop")
    .band.mobile(v-html="mobile")
</template>

<script setup>
// The triangle band, recolored with the selected palette. The SVGs also hold
// 2- and 3-color layouts (.g2, .g3), but the old site always showed the
// 4-color one (.g4), filling missing colors in, so that's what's shown here.
import desktop from '~/assets/wheel/triangles.svg?raw'
import mobile from '~/assets/wheel/triangles-mobile.svg?raw'

const { colors } = storeToRefs(useWheelStore())

// Same fallbacks as the old site: a missing 3rd color reuses the 1st, a missing 4th the 2nd
const vars = computed(() => {
  const [c1, c2, c3, c4] = colors.value
  return { '--c1': c1, '--c2': c2, '--c3': c3 || c1, '--c4': c4 || c2 }
})
</script>

<style scoped lang="sass">
.band
  :deep(svg)
    display: block
    width: 100%
    height: auto
  :deep(.g2), :deep(.g3)
    display: none

.mobile
  display: none

@media (max-width: 600px)
  .desktop
    display: none
  .mobile
    display: block
</style>
