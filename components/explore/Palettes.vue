<template lang="pug">
  div {{data}}
</template>

<script setup>
const filterStore = useFilterStore()
const { mode, style, qty, harmony } = storeToRefs(filterStore)
const { data, pending, error } = useApi('palettes/list/', {
  mode,
  style,
  qty,
  harmony,
})

</script>

<style scoped lang="sass">


</style>