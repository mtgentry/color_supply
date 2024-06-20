<template lang="pug">
  #options
    OptionsPalette
    v-divider
    //OptionsAdjust
    OptionsSliders

</template>

<script setup>

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