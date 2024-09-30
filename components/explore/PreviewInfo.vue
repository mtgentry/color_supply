<template lang="pug">
  v-container#colors(v-if="palette.id" fluid)
    v-row
      v-col.pa-0.centered.clickable(:col="palette?.colors.length > 6 ? null : 'auto'" :cols="palette?.colors.length > 6 ? 2 : null"
        v-for="color in palette?.colors" @click="clipboard(colorFormat(color), snackbar)" :style="{'backgroundColor': color}" )
        div.pt-1(:style="{color: changeColorForBackground(color)}") {{ colorFormat(color) }}
</template>

<script setup>
const snackbar = useSnackbar()
const colorStore = useColorStore()
const { palette, info } = storeToRefs(colorStore)

const colorFormat = (color) => {
  return color.toUpperCase().replace('#', '')
}
</script>

<style scoped lang="sass">
#colors
  .v-row
    border-top: black 1px solid
    padding: 0
    height: 3.125rem
    font-size: 0.75rem
    font-weight: normal
    letter-spacing: 1.08px
    line-height: 133.316%
</style>