<template lang="pug">
  v-row#create
    v-col.centered(cols="9" @click="disableColor")
      Colors
    v-col(cols="3")
      Options

</template>

<script setup>
const store = useColorStore()
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