<template lang="pug">
  v-row#explore
    v-col#filter(cols="2")
      ExploreFilter
    v-col(cols="6")
</template>

<script setup>
</script>

<style scoped lang="sass">
#filter
  padding: 0
  background-color: var(--color7)
  height: calc(100vh - 64px)
  overflow: auto
</style>