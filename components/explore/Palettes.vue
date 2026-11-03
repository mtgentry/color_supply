<template lang="pug">
    v-container(fluid).ma-0#paletteRow
      v-row
        v-col.pa-0
          v-container.ma-0#paletteResults(fluid)
            //- the whole grid fades (see `refreshing`) instead of v-auto-animate growing it item by item,
            //- which pushed the loading placeholders down the page
            v-row.colorRow.grid(:class="{ refreshing }" v-if="palettes.length || loading")
              v-col.colorCol(:cols="showFilter ? 12 : 6" xs="12" :sm="showFilter && preview === 1 ? 12 : 6" md="4" lg="4" v-for='(palette, index) in palettes' :key='index')
                v-container(fluid)
                  v-row
                    v-col.pa-0(cols="12")
                      ColorsDisplay(:palette='palette')
                    v-col#actions(cols="12")
                      .info
                        IconsHeart.clickable(
                          :fill="palette.favorite ? 'var(--color9)' : 'transparent'",
                          :stroke="palette.favorite ? 'var(--color9)' : 'var(--color3)'",
                          @click="favorite(palette)")
                        #count {{ palette.favorite_count }}
                        //img(src='/img/icons/dots.svg')
            //- not while refreshing, or it flashes between clearing the old results and loading the new
            v-row(v-else-if="!refreshing")
              v-col(cols="12")
                div.text-center No palettes found
            InfiniteLoading#infinite(@infinite="load" :key="renderKey" distance="200" target="#palettes")
              //- placeholders only while loading more on scroll; a filter change is covered by the grid fade
              //- always render the wrapper div: an empty slot makes Vue fall back to the library's spinning wheel
              template(#spinner)
                div
                  v-row.colorRow.loading-row(v-if="palettes.length")
                    v-col.colorCol(cols="4" v-for='index in 3' :key='index')
                      ColorsDisplay(:palette='loadingPalette' noSelect readonly)
              template(#complete)
                div
        ExplorePreviewNav(v-if="preview === 1")
</template>

<script setup>
import InfiniteLoading from "v3-infinite-loading"
import "v3-infinite-loading/lib/style.css"
import {findClosestColor} from "~/composables/findClosestColor.js";
const props = defineProps({
  showFilter: Boolean,
  favorites: Boolean
})

const renderKey = ref(0)
const loading = ref(false)
const { status } = useAuth()
const filterStore = useFilterStore()
const colorStore = useColorStore()
const { mode, style, qty, harmony, colors, wheel_color, colorTab, preview, previousPreview } = storeToRefs(filterStore)
const { palettes, recentPalettes } = storeToRefs(colorStore)
const next = ref('palettes/list/')
const state = ref()
const last_next = ref()
const loadingPalette = ref({colors: ['#EEEFF1', ], id: 'none'})
// true while the grid is faded out for a filter change, until the new first page is in
const refreshing = ref(false)
// bumped on every filter change so a response for the old filters is ignored
let generation = 0
const GRID_FADE_MS = 150
let fadeTimer

const reorderColorsWheel = (color_arg, colors) => {
  const closestColor = findClosestColor(color_arg, colors)
  return colors.sort((a, b) => {
    return a === closestColor ? -1 : b === closestColor ? 1 : 0
  })
}

const reorderColorsByParent = (color_args, colors) => {
  const parentColors = [
    '#CC3333', '#E87E30', '#F6D659', '#339966', '#336699',
    '#663366', '#DC758C', '#9B836C', '#000000', '#8C8C8C',
    '#C0C0C0', '#FFFFFF'
  ]
  const colorOrder = new Map();
  color_args.forEach((color, index) => {
    colorOrder.set(color, index);
  });
  const transformedColors = colors.map(color => ({
    original: color,
    closest: findClosestColor(color, parentColors)
  }));
  let result = transformedColors.sort((a, b) => {
    const aOrder = colorOrder.has(a.closest) ? colorOrder.get(a.closest) : color_args.length;
    const bOrder = colorOrder.has(b.closest) ? colorOrder.get(b.closest) : color_args.length;
    return aOrder - bOrder;
  }).map(item => item.original);

  return result
}

const load = async ($state) => {
  if (loading.value) {
    return
  }
  // (checked before setting loading, so an early return can't leave loading stuck at true)
  if (last_next.value === next.value) {
    return
  }
  loading.value = true
  const requestGeneration = generation
  if ($state) {
    state.value = $state
  } else {
    $state = state.value
  }
  if (next.value === 'palettes/list/') {
    palettes.value = []
  }
  let color_arg = undefined
  let harmony_arg = undefined
  if (colorTab.value === 'color') {
    color_arg = colors.value
  }
  if (colorTab.value === 'wheel'){
    color_arg = [wheel_color.value]
    harmony_arg = harmony.value
  }

  if (colorTab.value === 'list') {
    harmony_arg = harmony.value
  }
  last_next.value =  next.value === 'palettes/list/' ? null : next.value
  const response = await fetch(next.value, 'get', {
    toggle: props.favorites ? 'favorites' : undefined,
    // mode: mode.value,
    style: style.value,
    qty: harmony_arg ? undefined : qty.value,
    harmony: harmony_arg,
    colors: color_arg
  })
  // filters changed while this was in flight: drop it (the watcher already reset `loading`)
  if (requestGeneration !== generation) {
    return
  }
  if (!response) {
    loading.value = false
    return
  }
  // if (colorTab.value === 'wheel') {
  //   response.results = response.results.map(p => {
  //     p.colors = reorderColorsWheel(wheel_color.value, p.colors)
  //     return p
  //   })
  // } else if (colors.value.length && colorTab.value === 'color') {
  //   response.results = response.results.map(p => {
  //     p.colors = reorderColorsByParent(colors.value, p.colors)
  //     return p
  //   })
  // }
  // results go in right away (the old 300ms delay was only there for v-auto-animate),
  // and before $state.loaded() so the loader measures the real list height
  if (next.value === 'palettes/list/') {
    palettes.value = response.results
    // fade the new first page in
    refreshing.value = false
  } else {
    let filtered = response.results.filter(p => !palettes.value.find(p2 => p2.id === p.id))
    palettes.value = [...palettes.value, ...filtered]
  }
  loading.value = false

  if (!response.next) {
    $state.complete()
  } else {
    next.value = response.next
    $state.loaded()
  }
}

watch([mode, style, qty, harmony, colors, wheel_color, colorTab], () => {
  generation += 1
  // fade the current results out, then reset; the remounted loader fetches page 1 and load() fades it in
  refreshing.value = true
  clearTimeout(fadeTimer)
  fadeTimer = setTimeout(() => {
    next.value = 'palettes/list/'
    last_next.value = undefined
    loading.value = false
    palettes.value = []
    renderKey.value += 1
  }, GRID_FADE_MS)
  // don't re-highlight (or scroll to) the old selection when it shows up in the new results
  colorStore.clearPaletteHighlight()
  // the selected palette is usually no longer in the new results, so fade the corner preview out
  // with the grid (same as clicking its X; clicking a new palette or the open-preview button reopens it)
  if (preview.value === 0) {
    previousPreview.value = 0
    preview.value = 2
  }
})

</script>

<style scoped lang="sass">
#paletteRow
  display: flex
  flex-direction: row
#paletteResults
  width: 100%
  #actions
    display: flex
    justify-content: flex-end
    padding: 8px 0 0 0
  .info
    color: var(--color3)
    min-width: 40px
    display: flex
    align-items: center
    justify-content: space-between
    padding-right: 3px
  #count
    margin-top: 3px
    padding-left: 4px
  #paletteResults
    height: calc(100vh - 88px)
    overflow-y: auto

  #loading
    width: calc(100vw - 350px)
    overflow: hidden

  // whole-grid fade on filter changes (GRID_FADE_MS in the script matches the fade-out)
  .grid
    transition: opacity 0.15s ease
    &.refreshing
      opacity: 0

  // "loading more" placeholders while scrolling: a visible light gray with a soft pulse
  .loading-row :deep(.color-row)
    animation: placeholder-pulse 1.2s ease-in-out infinite

  .colorRow
    padding: 32px 4px 16px 12px
  .colorCol
    padding: 32px 12px 32px 12px
  @media (min-width: 375px)
    .colorRow
      padding: 31px 12px 16px 12px
    .colorCol
      padding: 18px 12px 3px 12px

  @media (min-width: 600px)
    .colorRow
      padding: 31px 12px 16px 12px
    .colorCol
      padding: 18px 12px 3px 12px

  @media (min-width: 960px)
    .colorRow
      padding: 24px 12px 24px 12px
    .colorCol
      padding: 19px 12px 2px 12px

  @media (min-width: 1280px)
    .colorRow
      padding: 32px 24px 32px 8px
    .colorCol
      padding: 18px 24px 19px 24px
  @media (min-width: 1920px)
    .colorRow
      padding: 32px 24px 32px 24px
    .colorCol
      padding: 18px 24px 19px 24px

// (kept at the end: in indented Sass, rules after a root-level @keyframes would nest inside it)
@keyframes placeholder-pulse
  0%, 100%
    opacity: 1
  50%
    opacity: 0.5
</style>