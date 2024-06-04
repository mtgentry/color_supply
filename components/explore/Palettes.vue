<template lang="pug">
  ExporePreviewBox
  v-container#paletteResults(fluid)
    v-row
      v-col(md="4" v-for='(palette, index) in palettes' :key='index')
        v-container(fluid)
          v-row
            v-col.pa-0(cols="12")
              ColorsDisplay(:palette='palette')
            v-col.pa-0(cols="12")
              .info
                IconsHeart.clickable(
                  :fill="palette.favorite ? 'var(--color9)' : 'transparent'",
                  :stroke="palette.favorite ? 'var(--color9)' : 'var(--color3)'",
                  @click="favoriteClick(palette.id)")
                div#count.pl-2 {{ palette.favorite_count }}
                img(src='/img/icons/dots.svg')
      InfiniteLoading(@infinite="load")
        template(#spinner)
          v-row#loading
            v-col(cols="4" v-for='index in [1,2,3]' :key='index')
              v-skeleton-loader(:loading="true"  type="heading")
</template>

<script setup>
import InfiniteLoading from "v3-infinite-loading"
import "v3-infinite-loading/lib/style.css"
const { status } = useAuth()
const filterStore = useFilterStore()
const { mode, style, qty, harmony, colors } = storeToRefs(filterStore)
const next = ref('palettes/list/')
const palettes = ref([])
const dialogStore = useDialogStore()
const {changeSignUpForm} = dialogStore
const load = async $state => {
  const response = await fetch(next.value, 'get', {
    mode: mode.value,
    style: style.value,
    qty: qty.value,
    harmony: harmony.value,
  })
  if (!response) {
    return
  }
  palettes.value = [...palettes.value, ...response.results]
  if (!response.next) {
    $state.complete()
  } else {
    next.value = response.next
  }
}

watch([mode, style, qty, harmony], () => {
  next.value = 'palettes/list/'
  palettes.value = []
  load({ complete: () => {} })
})

const favorite = async (id) => {
  const palette = palettes.value.find(p => p.id === id)

  if (palette.favorite) {
    palette.favorite_count -= 1
    palette.favorite = !palette.favorite
    await fetch(`favorites/${id}/`,  'delete')
  } else {
    palette.favorite_count += 1
    palette.favorite = !palette.favorite
    await fetch(`favorites/`, 'post', {
      palette: id
    })
  }
}

const favoriteClick = async (id) => {
  if (status.value === 'unauthenticated') {
    dialogStore.changeSource('favorite')
    changeSignUpForm(true)
    return
  }
  await favorite(id)
}


</script>

<style scoped lang="sass">
#paletteResults
  .info
    padding-top: 5px
    display: flex
    align-items: center
    justify-content: flex-end
    color: var(--color3)

    div
      line-height: 1px
      padding-top: 1px

  #paletteResults
    height: calc(100vh - 88px)
    overflow-y: auto

  #loading
    width: calc(100vw - 350px)
    overflow: hidden

  #count
    min-width: 20px
</style>