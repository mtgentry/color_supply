<template lang="pug">
  //- Temporary: the "Tens" dial from /wheel-lab, at the top of the Mix sidebar
  #hue-dial
    WheelLabSmallDial(variant="tens" :colors="colors")
  v-divider.section-divider
</template>

<script setup>
// Where the colors sit on the hue wheel: the selected squares, placed by their
// OKLCH hue, or with nothing selected, the main palette (the longest row).
// Follows the sliders while they move.
import { converter } from 'culori'
import WheelLabSmallDial from '~/components/wheel-lab/SmallDial.vue'

const mixStore = useMixStore()
const toOklch = converter('oklch')

const hexes = computed(() => mixStore.selection?.hexes?.length
  ? mixStore.selection.hexes
  : mixStore.liveMainPalette || mixStore.mainPalette)

const colors = computed(() => hexes.value.map((hex) => {
  const c = toOklch(hex)
  return { hex, angle: c && c.c >= 0.02 ? c.h ?? null : null } // Grays have no hue
}))
</script>

<style scoped lang="sass">
#hue-dial
  display: flex
  justify-content: center
.section-divider // As under the sliders (components/mix/Options.vue)
  margin: var(--section-gap) 0
  border-color: var(--section-rule)
  opacity: 1
</style>
