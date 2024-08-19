<template lang="pug">
  v-navigation-drawer#preview-drawer(location="right" v-if="preview===1" width="374" touchless)
    ExplorePreviewNav
  v-container#paletteResults(fluid v-if="palettes.length")
    v-row(v-auto-animate="{ duration: 300 }")
      v-col(md="4" v-for='(palette, index) in palettes' :key='index')
        v-container(fluid)
          v-row()
            v-col.pa-0(cols="12")
              ColorsDisplay(:palette='palette')
            v-col#actions.pa-0(cols="12")
              .info
                IconsHeart.clickable(
                  :fill="palette.favorite ? 'var(--color9)' : 'transparent'",
                  :stroke="palette.favorite ? 'var(--color9)' : 'var(--color3)'",
                  @click="favorite(palette.id)")
                #count {{ palette.favorite_count }}
                img(src='/img/icons/dots.svg')
  InfiniteLoading(@infinite="load" :key="renderKey")
    template(#spinner)
      v-row#loading
        v-col(cols="4" v-for='index in loadingNumber' :key='index')
          ColorsDisplay(:palette='loadingPalette' noSelect readonly)
</template>

<script setup>
import InfiniteLoading from "v3-infinite-loading"
import "v3-infinite-loading/lib/style.css"
const renderKey = ref(0)
const loading = ref(false)
const { status } = useAuth()
const filterStore = useFilterStore()
const colorStore = useColorStore()
const { mode, style, qty, harmony, colors, wheel_color, colorTab } = storeToRefs(filterStore)
const { palettes, recentPalettes } = storeToRefs(colorStore)
const next = ref('palettes/list/')
const state = ref()
const last_next = ref()
const loadingPalette = ref({colors: ['#FBFBFA', ], id: 'none'})

const loadingNumber = computed(() => {
  return palettes.value.length ? 3 : 30
})

const store = useFilterStore()
const {preview} = storeToRefs(store)

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
  if (next.value === 'palettes/list/') {
    setTimeout(() => {
      if (recentPalettes.value.length) {
        palettes.value = [recentPalettes.value[0], ...response.results]
      } else {
        palettes.value = response.results
      }
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

watch([mode, style, qty, harmony, colors, wheel_color, colorTab, status], () => {
  next.value = 'palettes/list/'
  renderKey.value += 1
  palettes.value = []
})

</script>

<style scoped lang="sass">
#paletteResults
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


#preview-drawer
  :deep(.v-navigation-drawer__content)
    overflow: hidden
</style>