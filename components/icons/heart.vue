<template lang="pug">
  svg(xmlns='http://www.w3.org/2000/svg' width='16' height='13' viewBox='0 0 15 13' :fill='fill')
    path(d='M2.15083 2.67276L2.15083 2.67276C3.04282 1.50279 4.35044 1.26457 5.45391 1.61504C6.57819 1.97211 7.40352 2.9043 7.40352 4.01512H7.90352H8.40352C8.40352 2.90428 9.22887 1.97198 10.3533 1.61485C11.4568 1.26434 12.7647 1.50251 13.6572 2.67271C14.576 3.87822 14.6285 5.58971 13.6589 7.40582C12.7117 9.18018 10.8025 11.0058 7.9035 12.3749C5.00452 11.006 3.09532 9.18055 2.14824 7.40622C1.17888 5.59017 1.2315 3.87856 2.15083 2.67276Z' :stroke='stroke')
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