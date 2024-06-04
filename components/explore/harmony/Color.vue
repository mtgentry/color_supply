<template lang="pug">
  .centered.clickable(@click="select")
    svg(width="30" height="30" viewBox="0 0 30 30")
      circle(r="14" cx="15" cy="15" :fill="colorProp" :stroke="title === 'white' ? 'var(--color3)' : ''" stroke-width="1")
      path(d="M16.0605 1.06055L5.7959 11.3252L1 6.5293" transform="translate(7,9)" :stroke="title === 'white' ? 'var(--color3)': 'white'"
        stroke-width="2" fill="transparent" v-if="color.includes(colorProp)")
    div {{ capitalized(title) }}

</template>

<script setup>
const props = defineProps({
  colorProp: String,
  title: String
})
const filterStore = useFilterStore()
const { color } = storeToRefs(filterStore)
const select = () => {
  filterStore.toggleColor(props.colorProp)
}

</script>

<style scoped lang="sass">

</style>