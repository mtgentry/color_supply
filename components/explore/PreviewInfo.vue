<template lang="pug">
  v-container.PreviewInfo(v-if="palette.id" fluid)
    v-row
      v-col.pa-0.centered.clickable(:col="isNav ? undefined : palette?.colors.length > 6 ? null : 'auto'" :cols="isNav ? 4 : palette?.colors.length > 6 ? 2 : null"
        v-for="color in palette?.colors" @click="clipboard(colorFormat(color), snackbar)" :style="{'backgroundColor': color}" )
        div.pt-1(:style="{color: changeColorForBackground(color)}") {{ colorFormat(color) }}
</template>

<script setup>
const snackbar = useSnackbar()
const colorStore = useColorStore()
const { palette, info } = storeToRefs(colorStore)
const props = defineProps({
  isNav: Boolean
})

const colorFormat = (color) => {
  return color.toUpperCase().replace('#', '')
}
</script>

<style scoped lang="sass">
.PreviewInfo
  .v-row
    border-top: black 1px solid
    padding: 0
    font-size: 0.75em
    font-weight: normal
    letter-spacing: 1.08px
    line-height: 133.316%
    -webkit-user-select: none
    -moz-user-select: none
    -ms-user-select: none
    user-select: none
    background-color: var(--color6)
    .v-col
      height: 50px
</style>