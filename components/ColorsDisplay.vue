<template lang="pug">
  .color-row(@click='selectPalette' :class='{clickable: !props.readonly, active: isSelected, round: props.rounded}' ref='colorRow')
    .color-box(v-for='(color, index) in palette.colors' :key='index' :style='{backgroundColor: color}')

</template>

<script setup>
const colorRow = ref()
const props = defineProps({
  palette: Object,
  rounded: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
})
const store = useColorStore()
const {palette: storePalette} = storeToRefs(store)

const selectPalette = () => {
  if (props.readonly) return
  store.selectPalette(props.palette)
}

const isSelected = computed(() => {
  let selected = storePalette.value?.id === props.palette.id
  if (selected) {
    colorRow.value?.scrollIntoView({ behavior: 'smooth', block: "center"});
  }
  return selected
})


</script>

<style scoped lang="sass">
.color-row
  display: flex
  width: 100%

  .round:hover
    transform: scale(1.03)
    transition: transform 0.1s ease-in-out

.active
  outline: 4px solid var(--color1)
  outline-offset: -4px

.color-box
  flex: 1 1 0
  height: 50px

.round
  &.active
    box-shadow: 0 0 0 2px var(--color1)
    border-radius: 5px
    outline: none

  &.color-row:hover
    transform: scale(1.03)
    transition: transform 0.1s ease-in-out

  .color-box
    height: 24px
    &:first-child
      border-top-left-radius: 5px
      border-bottom-left-radius: 5px
    &:last-child
      border-top-right-radius: 5px
      border-bottom-right-radius: 5px
</style>