<template lang="pug">
  div.color.top-right.bottom-left(:style="{backgroundColor: color}"
    :class="{active: index === selectedColor, bright: hsl.l <= brigtness, darker: hsl.l > brigtness, disabled}" @click="activate")
    div.top-right
    div.bottom-left
</template>

<script setup>
const props = defineProps({
  color: String,
  dragging: Boolean,
  index: Number,
  disabled: Boolean
})
const brigtness = 0.2
const colorStore = useColorStore()
const {palette, hueDiff, saturationDiff, hue, selectedColor, createColors} = storeToRefs(colorStore)

const hsl = computed(() => {
  return hexToHSL(palette.value.colors[props.index])
})

const adjustColor = () => {
  let h = (hsl.value.h + hueDiff.value) % 360
  if (h < 0) h += 360
  return HSLToHex(
    h,
    hsl.value.s,
    hsl.value.l
  )
}


const activate = () => {
  if (props.disabled) return
  colorStore.selectColor(props.index)
}

watch(hueDiff, () => {
  createColors.value[props.index] = adjustColor()
})

watch(palette.value, () => {
  createColors.value[props.index] = adjustColor()
}, {deep: true})

</script>

<style scoped lang="sass">
.color
  width: 115px
  height: 115px
  position: relative
  transition: top 0.1s ease-in-out, left 0.2s ease-in-out
  top: 0
  left: 0
  cursor: pointer
  background-color: #788092

  &:active
    filter: brightness(1) !important

  &.disabled
    cursor: initial

.active
  border: 2px solid var(--color1)
  top: -2px
  left: -2px
  z-index: 10

  &::before, &::after, .top-right::before, .bottom-left::before
    content: ""
    position: absolute
    width: 10px
    height: 10px
    background-color: white
    border-radius: 50%
    border: 2px solid var(--color1)

  &::before
    top: -5px
    left: -5px

  &::after
    bottom: -5px
    right: -5px

  .top-right::before
    top: -5px
    right: -5px

  .bottom-left::before
    bottom: -5px
    left: -5px

.flip-list-move
  transition: transform 0.5s


.no-move
  transition: transform 0s

.color-hover.bright:hover:not(.active):not(.disabled)
  filter: brightness(3)

.color-hover.darker:hover:not(.active):not(.disabled)
  filter: brightness(0.5)

</style>