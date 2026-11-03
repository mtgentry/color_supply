<template lang="pug">
  v-radio-group(v-model="harmony" hide-details)
    div(v-for="m in harmonies" :key="m")
      v-radio(:key="m" :label="capitalized(m)" :value="m" v-model="harmony")
      v-divider(v-if="m !== harmonies[harmonies.length - 1]")
</template>

<script setup>
const filterStore = useFilterStore()
const { harmony } = storeToRefs(filterStore)
const harmonies = ['complementary', 'split-complementary', 'analogous', 'triad', 'square']

</script>

<style scoped lang="sass">
// 12px + nowrap so "Split-Complementary" fits on one line in the 188px filter column
:deep(.v-label)
  font-size: 12px!important
  white-space: nowrap
</style>