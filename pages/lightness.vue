<template lang="pug">
  //- The Palettes page with toggles above it: every palette's colors as grays of
  //- their lightness, and/or darkest to lightest, to check contrast. Not linked from the site.
  #lightness
    #lightnessBar
      v-switch(
        v-model="lightnessView"
        label="Luminosity"
        color="primary"
        density="compact"
        hide-details
        inset)
      v-switch(
        v-model="lightnessRevised"
        label="Revised only"
        color="primary"
        density="compact"
        hide-details
        inset)
      v-switch(
        v-model="ranked"
        label="Rank by contrast"
        color="primary"
        density="compact"
        hide-details
        inset)
      //- Which end of the ranking comes first: the 10s or the 1s
      v-btn-toggle.direction(v-if="ranked" v-model="lightnessRank" mandatory density="compact" variant="outlined" divided)
        v-btn(value="high" size="small") Highest first
        v-btn(value="low" size="small") Lowest first
    PalettesPage
</template>

<script setup>
import PalettesPage from '~/pages/palettes.vue'

useHead({
  title: 'Lightness',
  meta: [{ name: 'robots', content: 'noindex' }]
})

const lightnessView = useLightnessView()
const lightnessScores = useLightnessScores()
const lightnessRank = useLightnessRank()
const lightnessRevised = useLightnessRevised()
// The switch turns ranking on (highest first) or off; the buttons pick the direction
const ranked = computed({
  get: () => !!lightnessRank.value,
  set: (on) => { lightnessRank.value = on ? 'high' : null }
})
lightnessView.value = true   // Opens in grays
lightnessScores.value = true // With each palette's contrast score under it
onBeforeUnmount(() => { // Colors, in their own order, and no scores, again everywhere else
  lightnessView.value = false
  lightnessScores.value = false
  lightnessRank.value = null
  lightnessRevised.value = false
})
</script>

<style scoped lang="sass">
$bar: 48px

// Full width, at the top of the layout's 12px padding; the 12px below it is what the
// Palettes page's row takes back with its own -12px margin
#lightnessBar
  margin: -12px -12px 12px
  height: $bar
  display: flex
  align-items: center
  gap: 32px
  padding: 0 24px
  background-color: var(--color7)
  border-bottom: 1px solid var(--color5)
  .v-switch
    flex: none // Side by side, each as wide as its label
  .direction
    margin-left: -16px // Closer to its switch than the gap between switches
    height: 28px
    // Small buttons keep the site's 10px uppercase (assets/css/custom.sass)
    :deep(.v-btn)
      color: var(--color3)
    :deep(.v-btn--active)
      color: var(--color2)
  :deep(.v-label)
    font-size: 13px
    letter-spacing: .3px
    color: var(--color3)
    opacity: 1
    padding-left: 10px

// The Palettes page's columns fill the screen below the nav; here they also sit below the bar
#lightness
  :deep(#filter), :deep(#palettes)
    height: calc(100vh - 64px - #{$bar})
</style>
