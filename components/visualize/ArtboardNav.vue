<template lang="pug">
  //- Bottom right of the artboard: Back as an outlined circle, Next filled. Both take
  //- their color from the artboard's background (like the heart), so they show on any palette.
  nav.artboard-nav(aria-label="Artboards" :style="{ '--ink': ink, '--paper': background }")
    button.back(
      v-if="showBack" type="button" aria-label="Previous artboard" title="Previous"
      @click.stop="$emit('back')")
      svg(width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true")
        path(d="M17 6H1.5M6.5 1L1.5 6L6.5 11" stroke="currentColor" stroke-width="1.2")
    button.next(
      v-if="showNext" type="button" aria-label="Next artboard" title="Next"
      @click.stop="$emit('next')")
      svg(width="18" height="12" viewBox="0 0 18 12" fill="none" aria-hidden="true")
        path(d="M1 6H16.5M11.5 1L16.5 6L11.5 11" stroke="currentColor" stroke-width="1.2")
</template>

<script setup>
const props = defineProps({
  background: { type: String, default: 'white' },
  showBack: Boolean,
  showNext: Boolean,
})
defineEmits(['back', 'next'])

// Black on light backgrounds, white on dark ones
const ink = computed(() => changeColorForBackground(props.background))
</script>

<style scoped lang="sass">
.artboard-nav
  position: absolute
  right: 32px
  bottom: 32px
  display: flex
  gap: 16px
  z-index: 2

button
  width: 52px
  height: 52px
  border-radius: 50%
  display: flex
  align-items: center
  justify-content: center
  cursor: pointer
  transition: transform .15s ease-out, opacity .15s
  &:hover
    transform: scale(1.06)
  &:active
    transform: scale(.97)
  &:focus-visible
    outline: 2px solid var(--ink)
    outline-offset: 3px

// Outlined: a thin ring and arrow in the ink color
.back
  background: transparent
  border: 1px solid var(--ink)
  color: var(--ink)

// Filled with the ink color; the arrow takes the artboard's background
.next
  background: var(--ink)
  border: 1px solid var(--ink)
  color: var(--paper)

@media (prefers-reduced-motion: reduce)
  button, button:hover, button:active
    transition: none
    transform: none
</style>
