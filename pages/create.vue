<template lang="pug">
  v-row#create
    v-col.centered(cols="9" @click="disableColor")
      CreateColors
    v-col(cols="3")
      CreateOptions
</template>

<script setup>
const colorStore = useColorStore()
const { palette, createColors, modifiedColors } = storeToRefs(colorStore)
if (!palette.value) {
  palette.value = {
    // colors: ['#FF0000', ],
    colors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#1A1A1A'],
    name: 'New Palette',
    id: null
  }
}
onMounted(() => {
  modifiedColors.value = [...palette.value.colors]
  createColors.value = [...palette.value.colors]
})
const disableColor = (event) => {
  if (!event.target.classList.contains('color')) {
    colorStore.selectColor(null)
  }
}

</script>

<style scoped lang="sass">
#create
  .v-col
    height: calc(100vh - 64px)
</style>