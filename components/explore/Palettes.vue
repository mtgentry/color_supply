<template lang="pug">
  ExporePreviewBox
  v-container(fluid)
    v-row(v-if="pending")
      v-col(cols="4" v-for='index in [1,2,3]' :key='index')
        v-skeleton-loader(:loading="true"  type="heading")
    v-row(v-else)
      v-col(md="4" v-for='(palette, index) in data' :key='index')
        v-container(fluid)
          v-row()
            v-col.pa-0(cols="12")
              ColorsDisplay(:palette='palette')
            v-col.pa-0(cols="12")
              .info
                img(src='/img/icons/favorite.svg')
                div.pl-1 {{ palette.favorites || 8 }}k
                img(src='/img/icons/dots.svg')
</template>

<script setup>
const filterStore = useFilterStore()
const { mode, style, qty, harmony } = storeToRefs(filterStore)
const { data, pending, error } = useApi('palettes/list/', {
  mode,
  style,
  qty,
  harmony,
})

</script>

<style scoped lang="sass">
.info
  padding-top: 5px
  display: flex
  align-items: center
  justify-content: flex-end
  color: var(--color3)

  div
    line-height: 1px
    padding-top: 1px

</style>