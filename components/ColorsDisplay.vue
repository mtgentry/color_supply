<template lang="pug">
  .color-row(@click='selectPalette' :class='{clickable: !props.readonly, active: isSelected}')
    .color-box(v-for='(color, index) in palette.colors' :key='index' :style='{backgroundColor: color}')

</template>

<script setup>
const props = defineProps({
  palette: Array,
  readonly: {
    type: Boolean,
    default: false,
  },
})
const store = useColorStore()

const selectPalette = () => {
  if (props.readonly) return
  store.selectPalette(props.palette)
}

const isSelected = computed(() => store.palette === props.palette)

</script>

<style scoped lang="sass">
.color-row
  display: flex
  width: 100%

.active
  outline: 4px solid var(--color1)
  outline-offset: -4px

.color-box
  flex: 1 1 0
  height: 50px
</style>