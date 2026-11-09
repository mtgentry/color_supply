<template lang="pug">
  //- v-expansion-panel-text, but opened and closed with GSAP: Vuetify's animates the
  //- height in CSS and can stutter on the tall COLOR swatches. Same classes as
  //- Vuetify's, so the styles written for it (Filter.vue, ExpansionPanel.vue) still apply.
  Transition(:css="false" @enter="expand" @leave="collapse")
    .v-expansion-panel-text(v-show="open")
      .v-expansion-panel-text__wrapper
        slot
</template>

<script setup>
import gsap from 'gsap'

// Provided by the enclosing v-expansion-panel (the key Vuetify registers it under)
const panel = inject(Symbol.for('vuetify:v-expansion-panel'), null)
const open = computed(() => panel?.isSelected.value ?? true)

// minHeight 0 while moving: a section with a min-height (QTY's is 70px, in Filter.vue)
// would otherwise hold at it, then vanish at the end
const expand = (el, done) => {
  if (prefersReducedMotion()) return done()
  const wrapper = el.firstElementChild
  const full = el.offsetHeight // Measured with the min-height, so it doesn't jump at the end
  gsap.set(el, { overflow: 'hidden', minHeight: 0 })
  gsap.fromTo(el, { height: 0 }, { height: full, duration: 0.3, ease: 'power2.out', overwrite: true, clearProps: 'height,overflow,minHeight', onComplete: done })
  gsap.fromTo(wrapper, { opacity: 0 }, { opacity: 1, duration: 0.25, delay: 0.05, ease: 'power1.out', overwrite: true, clearProps: 'opacity' })
}

const collapse = (el, done) => {
  if (prefersReducedMotion()) return done()
  const wrapper = el.firstElementChild
  gsap.set(el, { overflow: 'hidden', minHeight: 0 })
  // Together: the contents fade out over the whole collapse, and the height starts
  // moving at once (an ease-in-out held it still while the fade ran, so it read as
  // fade, then collapse)
  gsap.to(wrapper, { opacity: 0, duration: 0.24, ease: 'power1.out', overwrite: true })
  gsap.to(el, { height: 0, duration: 0.24, ease: 'power2.out', overwrite: true, onComplete: () => {
    gsap.set([el, wrapper], { clearProps: 'height,overflow,minHeight,opacity' })
    done()
  } })
}
</script>
