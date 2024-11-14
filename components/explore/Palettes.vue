<template lang="pug">
    v-container(fluid).ma-0#paletteRow
      v-row
        v-col.pa-0
          v-container.ma-0#paletteResults(fluid)
            v-row.colorRow(v-auto-animate="{ duration: 300 }" v-if="palettes.length")
              v-col.colorCol(:cols="showFilter ? 12 : 6" xs="12" :sm="showFilter && preview === 1 ? 12 : 6" md="4" lg="4" v-for='(palette, index) in palettes' :key='index')
                v-container(fluid)
                  v-row
                    v-col.pa-0(cols="12")
                      ColorsDisplay(:palette='palette')
                    v-col#actions.pa-0(cols="12")
                      .info
                        IconsHeart.clickable(
                          :fill="palette.favorite ? 'var(--color9)' : 'transparent'",
                          :stroke="palette.favorite ? 'var(--color9)' : 'var(--color3)'",
                          @click="favorite(palette)")
                        #count {{ palette.favorite_count }}
                        img(src='/img/icons/dots.svg')
            InfiniteLoading#infinite(@infinite="load" :key="renderKey" distance="400" target="#palettes")
              template(#spinner)
                v-row.colorRow
                  v-col.colorCol(cols="4" v-for='index in loadingNumber' :key='index')
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
  showFilter: Boolean
})

const renderKey = ref(0)
const loading = ref(false)
const { status } = useAuth()
const filterStore = useFilterStore()
const colorStore = useColorStore()
const { mode, style, qty, harmony, colors, wheel_color, colorTab, preview } = storeToRefs(filterStore)
const { palettes, recentPalettes } = storeToRefs(colorStore)
const next = ref('palettes/list/')
const state = ref()
const last_next = ref()
const loadingPalette = ref({colors: ['#FBFBFA', ], id: 'none'})

const loadingNumber = computed(() => {
  return palettes.value.length ? 3 : 30
})

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
  loading.value = true
  if (last_next.value === next.value) {
    return
  }
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
    mode: mode.value,
    style: style.value,
    qty: harmony_arg ? undefined : qty.value,
    harmony: harmony_arg,
    colors: color_arg
  })
  if (!response) {
    return
  }
  if (colorTab.value === 'wheel') {
    response.results = response.results.map(p => {
      p.colors = reorderColorsWheel(wheel_color.value, p.colors)
      return p
    })
  } else if (colors.value.length && colorTab.value === 'color') {
    response.results = response.results.map(p => {
      p.colors = reorderColorsByParent(colors.value, p.colors)
      return p
    })
  }
  if (next.value === 'palettes/list/') {
    setTimeout(() => {
      // if (recentPalettes.value.length) {
      //   palettes.value = [recentPalettes.value[0], ...response.results]
      // } else {
      //
      // }
      palettes.value = response.results
      loading.value = false
    }, 300)
  } else {
    setTimeout(() => {
      let filtered = response.results.filter(p => !palettes.value.find(p2 => p2.id === p.id))
      palettes.value = [...palettes.value, ...filtered]
      loading.value = false
    }, 300)
  }

  if (!response.next) {
    $state.complete()
  } else {
    next.value = response.next
    $state.loaded()
  }
}

watch([mode, style, qty, harmony, colors, wheel_color, colorTab], () => {
  next.value = 'palettes/list/'
  renderKey.value += 1
  palettes.value = []
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
  .info
    color: var(--color3)
    min-width: 70px
    display: flex
    align-items: center
    justify-content: space-between
  #count
    margin-top: 3px
    padding-left: 4px
  #paletteResults
    height: calc(100vh - 88px)
    overflow-y: auto

  #loading
    width: calc(100vw - 350px)
    overflow: hidden

  .colorRow
    padding: 32px 4px 16px 12px
  .colorCol
    padding: 32px 12px 32px 12px
  @media (min-width: 375px)
    .colorRow
      padding: 31px 12px 16px 12px
    .colorCol
      padding: 32px 12px 32px 12px

  @media (min-width: 600px)
    .colorRow
      padding: 31px 12px 16px 12px
    .colorCol
      padding: 32px 12px 32px 12px

  @media (min-width: 960px)
    .colorRow
      padding: 24px 12px 24px 12px
    .colorCol
      padding: 24px 12px 24px 12px

  @media (min-width: 1280px)
    .colorRow
      padding: 32px 24px 32px 8px
    .colorCol
      padding: 32px 24px 32px 24px
  @media (min-width: 1920px)
    .colorRow
      padding: 32px 24px 32px 24px
    .colorCol
      padding: 32px 24px 32px 24px
</style>