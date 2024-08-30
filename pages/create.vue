<template lang="pug">
  v-row#create
    v-col.centered(col="auto" @click="disableColor")
      CreateColors
    v-col#options
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

watch(palette, () => {
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

#options
  overflow-y: auto
  background-color: var(--color7)
  min-width: 12em
  max-width: 17.375em
</style>