<template lang="pug">
  v-container#colors(v-if="palette.id" fluid)
    v-row
      v-col.pa-0.centered.clickable(col="auto" v-for="color in palette?.colors" @click="clipboard(colorFormat(color), snackbar)"
      :style="{'backgroundColor': color}" )
        div.pt-1.hex {{ colorFormat(color) }}
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
  padding-top: 10px
  .v-row
    box-shadow: 0 -1px 0 var(--color2)
    padding: 0
    height: 3.125em
.hex
  color: var(--color2)
</style>