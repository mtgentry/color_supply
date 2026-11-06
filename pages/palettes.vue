<template lang="pug">
  v-row#explore(v-auto-animate="{ duration: 200 }")
    //was 'explore' before
    v-col#filter(cols="2" v-if="showFilter && !narrow")
      ExploreFilter
    v-col#palettes(:class="{ withHexBar: hexBarShown }")
      //- a solid strip that takes up space, so swatches start below the button and scroll behind it
      #filterBar
        v-btn#hamburger.iconBtn(@click="showFilter = !showFilter" flat)
          svg(width='20', height='10', viewBox='0 0 20 10', fill='none', xmlns='http://www.w3.org/2000/svg')
            path(d='M2.94141 4.70542C2.94141 4.38055 3.20477 4.11719 3.52964 4.11719H16.4708C16.7957 4.11719 17.0591 4.38055 17.0591 4.70542V4.70542C17.0591 5.0303 16.7957 5.29366 16.4708 5.29366H3.52964C3.20477 5.29366 2.94141 5.0303 2.94141 4.70542V4.70542Z', fill='#788092')
            path(d='M5.88232 8.82652C5.88232 8.50164 6.14569 8.23828 6.47056 8.23828H13.5294C13.8543 8.23828 14.1176 8.50164 14.1176 8.82652V8.82652C14.1176 9.15139 13.8543 9.41475 13.5294 9.41475H12.9411H6.47056C6.14569 9.41475 5.88232 9.15139 5.88232 8.82652V8.82652Z', fill='#788092')
            path(d='M0 0.588235C0 0.263362 0.263362 0 0.588235 0H19.4118C19.7366 0 20 0.263362 20 0.588235V0.588235C20 0.913109 19.7366 1.17647 19.4118 1.17647H0.588236C0.263363 1.17647 0 0.913109 0 0.588235V0.588235Z', fill='#788092')
      //- Phones: the filter slides in over the palettes (GSAP) instead of squeezing them,
      //- with a dimmed backdrop that closes it. Inside this column, not #explore, so
      //- #explore's auto-animate leaves it to GSAP.
      Transition(:css="false" @enter="slideIn" @leave="slideOut")
        #filterSheet(v-if="narrow && showFilter")
          .scrim(@click="showFilter = false")
          .panel
            ExploreFilter
      ExplorePalettes(:showFilter="showFilter && !narrow")
      ExplorePreviewBottom
      ExploreHexBar(:show="hexBarShown")
    ExplorePreviewBox
    ExplorePreviewOpen
</template>

<script setup>
const store = useFilterStore()
const {preview} = storeToRefs(store)
import gsap from 'gsap'

// Phones start with the palettes, full width; the filter button opens the filter over them.
// Wider screens start with the filter open beside the palettes, as before.
const PHONE = '(max-width: 599px)'
const narrowQuery = window.matchMedia(PHONE)
const narrow = ref(narrowQuery.matches)
const showFilter = ref(!narrow.value)
onBeforeUnmount(() => {
  store.preview = 2
})
const showFilterOnResize = function() {
  if (window.innerWidth > 768) {
    showFilter.value = true
  }
}
const onNarrowChange = () => {
  narrow.value = narrowQuery.matches
  if (narrow.value) showFilter.value = false // Into phone width: back to the palettes
}

// Phones: the hex bar shows once a palette is tapped here (only a tap selects one), and
// hides again when a filter change clears the selection's highlight
const colorStore = useColorStore()
const { palette: selectedPalette, paletteHighlighted } = storeToRefs(colorStore)
const tapped = ref(false)
watch(() => selectedPalette.value?.id, () => { tapped.value = true })
const hexBarShown = computed(() => narrow.value && tapped.value && paletteHighlighted.value && !!selectedPalette.value?.id)

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const slideIn = (el, done) => {
  const panel = el.querySelector('.panel')
  const scrim = el.querySelector('.scrim')
  if (reducedMotion()) return done()
  gsap.timeline({ onComplete: done })
    .fromTo(scrim, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'power1.out' }, 0)
    .fromTo(panel, { xPercent: -100 }, { xPercent: 0, duration: 0.32, ease: 'power3.out' }, 0)
}
const slideOut = (el, done) => {
  if (reducedMotion()) return done()
  gsap.timeline({ onComplete: done })
    .to(el.querySelector('.scrim'), { opacity: 0, duration: 0.2, ease: 'power1.in' }, 0)
    .to(el.querySelector('.panel'), { xPercent: -100, duration: 0.24, ease: 'power3.in' }, 0)
}

onMounted(() => {
  window.addEventListener('resize', showFilterOnResize)
  narrowQuery.addEventListener('change', onNarrowChange)
})
onUnmounted(() => {
  window.removeEventListener('resize', showFilterOnResize)
  narrowQuery.removeEventListener('change', onNarrowChange)
})
</script>

<style scoped lang="sass">
#explore
  position: relative

// 188px of content, plus 8px of padding that overlaps the palettes column's empty left margin
// (margin-right pulls it back), so the QTY thumb's hover halo isn't clipped by this scroll box
#filter
  min-width: 196px
  max-width: 196px
  padding: 0 8px 0 0
  margin-right: -8px
  position: relative
  z-index: 1
  background-color: var(--color7)
  height: calc(100vh - 64px)
  overflow-y: auto
  overflow-x: hidden

#palettes
  background-color: var(--color7)
  overflow-y: auto
  height: calc(100vh - 64px)
  overflow-x: hidden
  padding: 0

// Phones: the filter over the palettes. Positioned against #explore (not the scrolling
// column), so it stays put while the palettes scroll behind it.
#filterSheet
  position: absolute
  inset: 0
  z-index: 6 // Over #filterBar
  .scrim
    position: absolute
    inset: 0
    background-color: rgba(0, 0, 0, .25)
  .panel
    position: absolute
    top: 0
    bottom: 0
    left: 0
    width: min(280px, 80%)
    padding-right: 8px
    overflow-y: auto
    overflow-x: hidden
    background-color: var(--color7)
    box-shadow: 4px 0 16px rgba(0, 0, 0, .08)

// Room below the last palettes for the phone hex bar (51px: 50 + its top border, + the home-indicator area)
#palettes.withHexBar
  padding-bottom: calc(51px + env(safe-area-inset-bottom))

// A circle, so its pressed/hover highlight is round: .iconBtn's 10px side padding made it
// 40 x 32, which border-radius drew as an oval. 32px: the height #filterBar is sized around.
#hamburger
  width: 32px
  height: 32px !important
  padding: 0 !important

// below 960px only (the filter button hides from there). 11px + the 32px button
#filterBar
  position: sticky
  top: 0
  z-index: 5
  background-color: var(--color7)
  padding: 11px 0 0 14px
  display: flex
  @media (min-width: 960px)
    display: none
</style>