<template lang="pug">
  v-row#create
    v-col.centered(cols="9" @click="disableColor")
      Colors
    v-col(cols="3")
      Options
</template>

<script setup>
const store = useColorStore()
if (!store.palette) {
  store.palette = {
    colors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#1A1A1A'],
    name: 'New Palette',
    id: null
  }
}
const disableColor = (event) => {
  if (!event.target.classList.contains('color')) {
    store.selectColor(null)
  }
}

</script>

<style scoped lang="sass">
#create
  .v-col
    height: calc(100vh - 64px)
</style>