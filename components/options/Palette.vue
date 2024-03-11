<template lang="pug">
  h2 Palette
  div.d-flex.flex-row
    EditorColor.color(v-for="element in store.colors" :key="element" :color="element")


</template>

<script setup>
const store = useColorStore()

</script>

<style scoped lang="sass">
.color
  height: 33px
  width: 33px
</style>