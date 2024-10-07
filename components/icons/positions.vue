<template lang="pug">
  svg(xmlns='http://www.w3.org/2000/svg' width='33' height='33' viewbox='0 0 33 33' fill='none')
    circle(cx='16' cy='16' r='16' fill='transaprent')
    circle(cx='2' cy='2' r='2' transform='matrix(-1.19249e-08 1 1 1.19249e-08 14 14)' :fill='fill')
    circle(cx='2' cy='2' r='2' transform='matrix(-1.19249e-08 1 1 1.19249e-08 22 14)' :fill='fill')
    circle(cx='2' cy='2' r='2' transform='matrix(-1.19249e-08 1 1 1.19249e-08 6 14)' :fill='fill')
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