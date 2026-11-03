<template lang="pug">
  #mix-canvas-wrap
    #mix-canvas(ref="el" @pointerdown.capture="onCanvasPointerDown")
    a.reset(href="#" @click.prevent="reset" @pointerdown.stop) Reset
    Teleport(v-if="worldEl" :to="worldEl")
      //- Under the selection's right end, like the heart under the palettes on Explore.
      //- It arrives once the selection is committed (pointer released), with a short rise.
      Transition(name="heart")
        .save-heart(
          v-if="heart && !pointerDown"
          :style="{ left: heart.x + 'px', top: heart.y + 'px' }"
          :class="{ saved: heart.saved }"
          @pointerdown.stop)
          button(
            :title="heart.saved ? 'Remove from your favorites' : 'Save as a palette in your favorites'"
            :disabled="saving"
            @click.prevent="toggleSave")
            IconsHeart(:stroke="heart.saved ? 'var(--color9)' : 'var(--color3)'" :fill="heart.saved ? 'var(--color9)' : 'transparent'")
          span.count(v-if="heart.count") {{ heart.count }}
</template>

<script setup>
// The drag canvas. All of the behavior is in lib/mix (plain JS, no Vue); this
// component creates the engine in this element when the page mounts, destroys
// it when the page leaves, passes what it reports to the store, and draws the
// one piece of app UI that lives on the canvas: the heart under a selected
// row, which saves it as a palette (and a favorite) through the API.
import { createMixEngine } from '~/lib/mix/index.js'

const el = ref()
const colorStore = useColorStore()
const mixStore = useMixStore()
const dialogStore = useDialogStore()
const snackbar = useSnackbar()
const { status } = useAuth()
const { state } = storeToRefs(mixStore)

// A plain variable, not a ref: the engine owns its elements and GSAP tweens,
// and must stay out of Vue's reactivity
let engine = null
const worldEl = ref(null) // The engine's world layer, once it exists; the heart is teleported into it

// The pannable world squares live in. Bigger than any screen, so rows have
// room to grow; the view opens centered on it.
const WORLD = { width: 2400, height: 1200 }

// What the canvas opens with (and Reset goes back to): a palette of its own,
// not the one highlighted in the sidebar, so the first visit and the intro
// always look the same. Blue, red, yellow: the intro drags the yellow over
// the red. Other palettes come in from the sidebar.
const DEFAULT_PALETTE = ['#2A5B96', '#D73E2F', '#FEE16C']

// Back to just the default palette, with the view re-centered, and the intro again
const reset = () => {
  if (!engine) return
  engine.load([...DEFAULT_PALETTE])
  engine.fitView()
  mixStore.setState(engine.getState())
  engine.playIntro()
}

// --- Saving a selected row as a palette ---------------------------------

const selection = ref(null) // From the engine: { ids, hexes, isRow, bounds }
const pointerDown = ref(false) // A marquee or a drag in progress: the heart waits for the release
const pointerUp = () => { pointerDown.value = false } // On window: a drag can end outside the canvas
// A press on the heart itself doesn't hide it (it would vanish before the click lands)
const onCanvasPointerDown = (event) => { if (!event.target.closest('.save-heart')) pointerDown.value = true }
const saving = ref(false)
const savedHere = ref({})   // Palettes saved or unfavorited on this page, by their colors
const colorKey = (hexes) => hexes.map((h) => h.toUpperCase()).join(',')

// The favorite palette with exactly these colors, if the user has one
const favoriteFor = (hexes) => {
  const key = colorKey(hexes)
  const here = savedHere.value[key]
  if (here) return here.favorite ? here : null
  return colorStore.recentPalettes.find((p) => p.favorite && colorKey(p.colors || []) === key) || null
}

// Where the heart goes: under the right end of a selection of two or more
// squares in one row (x is its right edge)
const heart = computed(() => {
  const s = selection.value
  if (!s?.isRow || s.ids.length < 2 || !s.bounds) return null
  const saved = favoriteFor(s.hexes)
  return {
    x: s.bounds.right,
    y: s.bounds.bottom + 8,
    hexes: s.hexes,
    saved: !!saved,
    count: saved?.favorite_count || 0
  }
})

let pendingSave = null // Colors to save once the user has logged in

const save = async (hexes) => {
  saving.value = true
  try {
    const saved = await fetch('palettes/', 'post', { colors: hexes })
    savedHere.value = { ...savedHere.value, [colorKey(hexes)]: saved }
    colorStore.addRecentPalette(saved) // Shows up at the top of Recent (and in Favorites)
    snackbar.add({ type: 'info', text: 'Saved to your favorites' })
  } catch (error) {
    snackbar.add({ type: 'error', text: 'The palette could not be saved' })
  }
  saving.value = false
}

const unfavorite = async (saved) => {
  saving.value = true
  try {
    await fetch(`favorites/${saved.id}/`, 'delete')
    saved.favorite = false
    saved.favorite_count = Math.max(0, (saved.favorite_count || 1) - 1)
    savedHere.value = { ...savedHere.value, [colorKey(saved.colors)]: saved }
    snackbar.add({ type: 'info', text: 'Removed from your favorites' })
  } catch (error) {
    snackbar.add({ type: 'error', text: 'The palette could not be removed' })
  }
  saving.value = false
}

const toggleSave = () => {
  if (!heart.value || saving.value) return
  const { hexes } = heart.value
  if (status.value !== 'authenticated') {
    // The same "save favorites" dialog as the heart elsewhere; the save runs
    // once the user is in (loginFavorite stays empty: there's no palette yet)
    pendingSave = hexes
    dialogStore.loginFavorite = null
    dialogStore.changeSource('favorite')
    if (useCookie('was_logged').value) dialogStore.changeLoginForm(true)
    else dialogStore.changeSignUpForm(true)
    return
  }
  const existing = favoriteFor(hexes)
  if (existing) unfavorite(existing)
  else save(hexes)
}

watch(status, (value) => {
  if (value !== 'authenticated' || !pendingSave) return
  const hexes = pendingSave
  pendingSave = null
  save(hexes)
})

// --- Engine lifecycle ---------------------------------------------------

// Builds the engine, once, and only when the element has a size: Nuxt's page
// Suspense can run mounted hooks while the page is still detached (and run
// them twice), and the view is centered from the element's size
let sizeWatch = null
const start = () => {
  if (engine || !el.value?.clientWidth) return
  const { query } = useRoute()
  const debug = query.debug !== undefined
  engine = createMixEngine(el.value, {
    colors: state.value || [...DEFAULT_PALETTE], // Pick up where the user left off
    world: WORLD,
    grid: debug,
    intro: !mixStore.introSeen || query.intro !== undefined, // Until the user has done something, or ?intro
    introImages: '/mix/',
    debug,
    onChange: (s) => {
      mixStore.setState(s)
      // The first change to the canvas: the user has got it (the intro's own
      // join, which it plays to show what happens, doesn't count)
      if (!engine?.isIntroPlaying()) mixStore.markIntroSeen()
    },
    onSelectionChange: (s) => { selection.value = s; mixStore.selection = s }
  })
  mixStore.setState(engine.getState()) // So the sidebar shows the palette right away
  mixStore.engine = markRaw(engine)    // So the sidebar can drop palettes on it
  worldEl.value = engine.worldElement
  sizeWatch?.disconnect()
  sizeWatch = null
}

onMounted(() => {
  window.addEventListener('pointerup', pointerUp)
  window.addEventListener('pointercancel', pointerUp)
  start()
  if (engine) return
  sizeWatch = new ResizeObserver(start)
  sizeWatch.observe(el.value)
})

onBeforeUnmount(() => {
  window.removeEventListener('pointerup', pointerUp)
  window.removeEventListener('pointercancel', pointerUp)
  sizeWatch?.disconnect()
  worldEl.value = null
  selection.value = null
  mixStore.selection = null
  mixStore.engine = null
  engine?.destroy()
  engine = null
})
</script>

<style scoped lang="sass">
#mix-canvas-wrap
  position: relative
  width: 100%
  height: 100%

#mix-canvas
  position: relative
  overflow: hidden
  width: 100%
  height: 100%

.reset
  position: absolute
  right: 16px
  bottom: 12px
  font-size: 13px
  letter-spacing: .3px
  color: var(--color3)
  text-decoration: none
  &:hover
    color: var(--color2)
    text-decoration: underline

.heart-enter-active
  transition: opacity .2s ease-out, transform .2s ease-out
.heart-leave-active
  transition: opacity .1s ease-in
.heart-enter-from
  opacity: 0
  transform: translateX(-100%) translateY(6px)
.heart-leave-to
  opacity: 0

.save-heart
  position: absolute
  transform: translateX(-100%) // Right-aligned to the selection's edge
  z-index: 101 // Above the squares and the selection box
  display: flex
  align-items: center
  gap: 6px
  padding: 4px 3px 4px 6px // Some room to click, as on the Explore cards
  color: var(--color3)
  font-size: 14px
  line-height: 1
  button
    display: flex
    border: none
    background: none
    padding: 0
    cursor: pointer
    &:hover svg
      transform: scale(1.12)
    &:disabled
      opacity: .6
      cursor: default
  svg
    transition: transform .1s ease-in-out
  .count
    margin-top: 1px
</style>
