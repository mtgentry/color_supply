<template lang="pug">
  //- On the canvas, under the spreads (components/mix/Canvas.vue)
  .mix-luminosity(@pointerdown.stop)
    v-switch(
      v-model="on"
      color="primary"
      density="compact"
      hide-details
      inset)
      template(#label)
        .name Luminosity
          .description Shows the colors as grays, to check contrast
</template>

<script setup>
// "Luminosity": shows the selected squares (or all of them, as the sliders
// do) as grays of their perceived lightness (OKLCH L), like a luminosity
// blend mode, to check there's contrast between the colors. A view only:
// the colors, the sliders, the dial and saving all keep the real colors.
const mixStore = useMixStore()

const on = ref(false)

// The squares it shows: the selection, else every square
const targetIds = computed(() => {
  const selected = mixStore.selection?.ids || []
  return selected.length ? selected : (mixStore.state?.squares || []).map((s) => s.id)
})

// Follows the selection and the canvas (a join or a dropped palette adds squares)
watch([on, targetIds, () => mixStore.state, () => mixStore.engine], () => {
  mixStore.engine?.showLightness(on.value ? targetIds.value : [])
})

onBeforeUnmount(() => mixStore.engine?.showLightness([]))
</script>

<style scoped lang="sass">
.mix-luminosity
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
