<template lang="pug">
  h2 Palette
  div.d-flex.flex-row
    ColorsDisplay(:colors='store.colors')


</template>

<script setup>
const store = useColorStore()

</script>

<style scoped lang="sass">
.color
  height: 33px
  width: 33px
</style>