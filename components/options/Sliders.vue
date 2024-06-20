<template lang="pug">
  #sliders
    #hue
      v-label Hue
      v-slider(v-model="hue" min="0" max="359" step="1")
    #saturation
      v-label Saturation
      v-slider(v-model="saturation" min="0" max="100" step="1")
</template>

<script setup>
const colorStore = useColorStore()
const { hue, saturation } = storeToRefs(colorStore)
</script>

<style scoped lang="sass">
#sliders
  .v-label
    color: var(--color2)
    opacity: 1
    font-size: 15px
    letter-spacing: 0.3px
  #hue
    :deep(.v-slider-track__background)
      opacity: 1
      background: linear-gradient(to right, #F00 0%, #FF0 16.66%, #0F0 33.33%, #0FF 50%, #00F 66.66%, #F0F 83.33%, #F00 100%)
    :deep(.v-slider-track__fill)
      background: transparent
  #saturation
    :deep(.v-slider-track__background)
      opacity: 1
      background: linear-gradient(to right, hsl(0, 0%, 100%), hsl(0, 0%, 0%))
    :deep(.v-slider-track__fill)
      background: transparent
</style>