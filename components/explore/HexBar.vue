<template lang="pug">
  //- Phones: the tapped palette's hex values along the bottom of the screen, the same bar
  //- as at the bottom of the illustration previews (which phones don't show). Tap a hex to
  //- copy it. Teleported to the body so it sits on the screen's bottom edge even while the
  //- page is shifted down for the Sign Up / Login strip.
  Teleport(to="body")
    Transition(:css="false" @enter="slideIn" @leave="slideOut")
      #hexBar(v-if="show")
        ExplorePreviewInfo
</template>

<script setup>
import gsap from 'gsap'

const props = defineProps({
  // Set by the page: phone width, and a palette has been tapped
  show: { type: Boolean, default: false },
})

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const slideIn = (el, done) => {
  if (reducedMotion()) return done()
  gsap.fromTo(el, { yPercent: 100 }, { yPercent: 0, duration: 0.3, ease: 'power3.out', onComplete: done })
}
const slideOut = (el, done) => {
  if (reducedMotion()) return done()
  gsap.to(el, { yPercent: 100, duration: 0.22, ease: 'power3.in', onComplete: done })
}
</script>

<style scoped lang="sass">
#hexBar
  position: fixed
  left: 0
  right: 0
  bottom: 0
  z-index: 6
  background-color: var(--color6)
  padding-bottom: env(safe-area-inset-bottom)
  box-shadow: 0 -4px 16px rgba(0, 0, 0, .08)
  // Edge to edge (the container's padding left a white inset around the colors)
  :deep(.PreviewInfo)
    padding: 0
  // A touch bigger than in the previews: it's the only place phones show the hexes
  :deep(.v-row)
    margin: 0
    font-size: 13px
</style>
