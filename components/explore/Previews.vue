<template lang="pug">
  v-btn-toggle#preview.flex-row(v-model="selected" mandatory)
    v-btn
      svg(width='35' height='23' viewBox='0 0 35 23' fill='none' xmlns='http://www.w3.org/2000/svg')
        path(d='M0.5 0.539062H34.5V21.5391H0.5V0.539062Z' fill='white' :stroke='selected === 0 ? color1 : color5')
        path(d='M24 11.0391H32V19.0391H24V11.0391Z' :fill='selected === 0 ? color1 : color5')
    v-btn
      svg(width='35' height='23' viewBox='0 0 35 23' fill='none' xmlns='http://www.w3.org/2000/svg')
        path(d='M0.5 0.539062H34.5V21.5391H0.5V0.539062Z' fill='white' :stroke='selected === 1 ? color1 : color5')
        path(d='M25 3.03906H32V19.0391H25V3.03906Z' :fill='selected === 1 ? color1 : color5')
    v-btn
      svg(width='35' height='23' viewBox='0 0 35 23' fill='none' xmlns='http://www.w3.org/2000/svg')
        path(d='M0.5 0.539062H34.5V21.5391H0.5V0.539062Z' fill='white' :stroke='selected === 2 ? color1 : color5')
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