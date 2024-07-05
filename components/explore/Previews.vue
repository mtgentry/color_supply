<template lang="pug">
  v-btn-toggle#preview.flex-row(v-model="selected" mandatory)
    v-btn
      svg(width='35' height='23' viewBox='0 0 35 23' fill='none' xmlns='http://www.w3.org/2000/svg')
        path(d='M0.5 0.5H34.5V22.5H0.5V0.5Z' fill='white' :stroke='selected === 0 ? color1 : color5')
        path(d='M24 12H32V20H24V12Z' :fill='selected === 0 ? color1 : color5')
    v-btn
      svg(width='35', height='23', viewBox='0 0 35 23', fill='none', xmlns='http://www.w3.org/2000/svg')
        path(d='M0.5 0.5H34.5V22.5H0.5V0.5Z', fill='white', :stroke='selected === 1 ? color1 : color5')
        path(d='M25 3H32V20H25V3Z', :stroke='selected === 1 ? color1 : color5')

</template>

<script setup>
const filterStore = useFilterStore()
const {preview} = storeToRefs(filterStore)
const selected = ref(0)

let element = document.documentElement
let style = getComputedStyle(element)
const color1 = style.getPropertyValue('--color1').trim()
const color5 = style.getPropertyValue('--color5').trim()

watch(selected, (value) => {
  filterStore.changeFilter(preview, value)
})

onMounted(() => {
  selected.value = preview.value
})

</script>

<style scoped lang="sass">
.v-btn
  width: 35px!important
  height: 23px!important
  min-width: 35px!important
  padding: 0!important
  --v-activated-opacity: 0

  &:nth-child(2)
    margin: 0 8px

.v-btn-group--density-default.v-btn-group
  height: unset
</style>