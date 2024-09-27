<template lang="pug">
  svg(xmlns='http://www.w3.org/2000/svg', width='34', height='34', viewBox='0 0 34 34', fill='none')
    path(d='M16.4407 10.6201H12.6622C10.2135 10.6201 10.5017 10.3523 10.5017 12.78C10.5017 15.2078 10.5041 14.9988 10.5017 20.3398C10.5007 22.4998 10.5007 22.4998 12.661 22.4998H21.3007C22.1236 22.4998 22.3807 22.4998 22.3807 21.4198V16.5598M24.0005 14.9399V10.0802C24.0005 8.99994 24.0005 9.00025 22.9205 9.00025L18.0605 9.00025M24 9L15.0051 17.9949', :stroke='stroke', stroke-width='1.1')
</template>

<script setup>
const props = defineProps({
  fill: {
    type: String,
    default: 'none',
  },
  stroke: {
    type: String,
    default: '#A4A7B1',
  }
})
</script>

<style scoped lang="sass">
svg
  cursor: pointer
</style>