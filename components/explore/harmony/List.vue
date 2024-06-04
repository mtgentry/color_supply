<template lang="pug">
  v-radio-group(v-model="harmony" hide-details)
    div(v-for="m in harmonies" :key="m")
      v-radio.px-5(:key="m" :label="capitalized(m)" :value="m" v-model="harmony")
      v-divider(v-if="m !== harmonies[harmonies.length - 1]")
</template>

<script setup>
const harmony = ref('complimentary')
const harmonies = ['complimentary', 'split-complimentary', 'analogous', 'triad', 'square']
</script>

<style scoped lang="sass">

</style>