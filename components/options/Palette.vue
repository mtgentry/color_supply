<template lang="pug">
  h2 Palette
  div.d-flex.flex-row
    ColorsDisplay(:palette='palette' readonly no-select)


</template>

<script setup>
const colorStore = useColorStore()
const { palette } = storeToRefs(colorStore)

</script>

<style scoped lang="sass">
.color
  height: 33px
  width: 33px
</style>