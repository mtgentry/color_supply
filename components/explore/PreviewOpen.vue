<template lang="pug">
  svg#previewOpen(width='31', height='22', viewBox='0 0 31 22', fill='none', xmlns='http://www.w3.org/2000/svg'  @click='preview = previousPreview' v-if='preview === 2')
    path(d='M15.8548 21H3.03226C1.90987 21 1 20.0842 1 18.9545V3.04545C1 1.91578 1.90987 1 3.03226 1H27.9677C29.0901 1 30 1.91578 30 3.04545V6.61364V10.1818', stroke='#788092', stroke-width='2')
    path(d='M19 16C19 14.3431 20.3431 13 22 13H28C29.6569 13 31 14.3431 31 16V19C31 20.6569 29.6569 22 28 22H22C20.3431 22 19 20.6569 19 19V16Z', fill='#788092')
</template>

<script setup>
const filterStore = useFilterStore()
const {preview, previousPreview} = storeToRefs(filterStore)
</script>

<style scoped lang="sass">
#previewOpen
  position: fixed
  bottom: 20px
  right: 30px
  cursor: pointer
  z-index: 100
</style>