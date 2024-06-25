<template lang="pug">
  #options
    //OptionsPalette
    //v-divider
    OptionsAdjust(v-if="selectedColor !== null")
    OptionsSliders(v-else)

</template>

<script setup>
const colorStore = useColorStore()
const { selectedColor } = storeToRefs(colorStore)
</script>

<style scoped lang="sass">
#options
  background-color: var(--color7)
  margin: -12px
  padding: 32px 24px
  height: calc(100vh - 64px)

  :deep(h2)
    padding-bottom: 20px

  .v-divider
    margin: 32px 0 26px 0
</style>