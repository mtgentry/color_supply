<template lang="pug">
  .wheel-swatches
    .swatch(
      v-for="(color, i) in colors"
      :key="i"
      title="Copy hex code"
      @click="clipboard(color, snackbar)"
    )
      .chip(:style="{ backgroundColor: color }")
      .hex {{ color }}
</template>

<script setup>
// The selected palette's colors with their hex codes; click one to copy it
const snackbar = useSnackbar()
const { colors } = storeToRefs(useWheelStore())
</script>

<style scoped lang="sass">
.wheel-swatches
  display: flex
  justify-content: center
  gap: 24px
  flex-wrap: wrap

.swatch
  flex: 0 1 190px
  cursor: pointer
  &:hover .chip
    transform: scale(1.03)

.chip
  height: 48px
  border-radius: 5px
  transition: transform 0.1s ease-in-out

.hex
  margin-top: 10px
  text-align: center
  font-size: 14px
  letter-spacing: 0.04em
  color: var(--color3)
</style>
