<template lang="pug">
  .centered.clickable(@click="select")
    svg(width="30" height="30" viewBox="0 0 30 30")
      circle(r="14" cx="15" cy="15" :fill="color" :stroke="title === 'white' ? 'var(--color3)' : ''" stroke-width="1")
      path(d="M16.0605 1.06055L5.7959 11.3252L1 6.5293" transform="translate(7,9)" :stroke="title === 'white' ? 'var(--color3)': 'white'"
        stroke-width="2" fill="transparent" v-if="colors.includes(color)")
    div.color-name {{ capitalized(title) }}

</template>

<script setup>
const props = defineProps({
  color: String,
  title: String
})
const filterStore = useFilterStore()
const { colors } = storeToRefs(filterStore)
const select = () => {
  filterStore.toggleColor(props.color)
}

</script>

<style scoped lang="sass">
.color-name
  margin-top: 8px
  font-size: 0.813rem
  line-height: 0.4
</style>