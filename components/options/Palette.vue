<template lang="pug">
  h2 Palette
  div.d-flex.flex-row
    EditorColor.color(v-for="(element, index) in store.colors" :key="index" :color="element" disabled)


</template>

<script setup>
const store = useColorStore()

</script>

<style scoped lang="sass">
.color
  height: 33px
  width: 33px
</style>