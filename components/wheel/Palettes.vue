<template lang="pug">
  #wheel-palettes
    .grid
      .palette-row(
        v-for="(p, index) in palettes"
        :key="scheme.id + '-' + slice + '-' + index"
        :class="{ active: index === paletteIndex }"
        :title="SHOW_CREDITS && p.author ? `by ${p.author.name}` : undefined"
        @click="wheelStore.selectPalette(index)"
      )
        .color-box(
          v-for="(color, i) in p.colors.slice(0, 4)"
          :key="i"
          :style="{ backgroundColor: color }"
        )
        span.credit-dot(v-if="SHOW_CREDITS && p.author")
    .selected(v-if="colors.length")
      .bar
        .bar-box(v-for="(color, i) in colors" :key="i" :style="{ backgroundColor: color }")
      WheelSaveHeart(:colors="colors")
      .credit(v-if="SHOW_CREDITS && palette.author")
        | by&nbsp;
        a(:href="palette.author.url" target="_blank" rel="noopener") {{ palette.author.name }}
</template>

<script setup>
// The palettes for the wheel slice under the pointer, two to a row like the
// old site, and the selected one shown larger underneath.

// Designer credits (a dot next to credited palettes, "by <name>" under the
// selected one) are hidden for now. Set to true to show them again; the
// credits are still in lib/wheel/schemes.json.
const SHOW_CREDITS = false

const wheelStore = useWheelStore()
const { scheme, slice, palettes, paletteIndex, palette, colors } = storeToRefs(wheelStore)
</script>

<style scoped lang="sass">
#wheel-palettes
  width: 100%
  max-width: 340px

.grid
  display: grid
  grid-template-columns: 1fr 1fr
  column-gap: 32px
  row-gap: 12px

.palette-row
  position: relative
  display: flex
  cursor: pointer
  border-radius: 5px
  transition: transform 0.1s ease-in-out
  &:hover
    transform: scale(1.09)
  &.active
    box-shadow: 0 0 0 2px var(--color1)

.color-box
  flex: 1 1 0
  height: 24px
  &:first-child
    border-top-left-radius: 5px
    border-bottom-left-radius: 5px
  &:last-child
    border-top-right-radius: 5px
    border-bottom-right-radius: 5px

.credit-dot
  position: absolute
  right: -12px
  top: 50%
  width: 5px
  height: 5px
  margin-top: -2.5px
  border-radius: 50%
  background-color: var(--color4)

.selected
  margin-top: 28px

.bar
  display: flex
  gap: 4px
  .bar-box
    flex: 1 1 0
    height: 32px
    border-radius: 5px

.credit
  margin-top: 10px
  font-size: 13px
  color: var(--color3)
  a
    color: var(--color2)
    text-decoration: none
    &:hover
      text-decoration: underline
</style>
