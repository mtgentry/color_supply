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
:deep(.v-label)
  font-size: 13px!important
</style>