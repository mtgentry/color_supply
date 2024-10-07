<template lang="pug">
  svg(width='31', height='20', viewBox='0 0 31 20', fill='none', xmlns='http://www.w3.org/2000/svg')
    path.background(d='M0.442857 0.442857H30.5571V19.5571H0.442857V0.442857Z', fill='white', :stroke='stroke', stroke-width='0.885714')
    path.middle(d='M20 9H27V16H20V9Z', :fill='fill')
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