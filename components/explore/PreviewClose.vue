<template lang="pug">
  v-btn.pa-0#close-icon(flat)
    svg(width='34', height='34', viewBox='0 0 34 34', fill='none',
      xmlns='http://www.w3.org/2000/svg' @click="closePreview")
      circle(cx='17', cy='17', r='17', fill='transparent')
      path(d='M12.001 12.2778L21.7892 22.0661', :stroke='closeColor')
      path(d='M21.7893 12.2778L12.0011 22.0661', :stroke='closeColor')
</template>

<script setup>
const props = defineProps(
  {
    background: String
  }
)
const filterStore = useFilterStore()
const {preview, previousPreview} = storeToRefs(filterStore)
const closePreview = () => {
  previousPreview.value = preview.value
  preview.value = 2
}

const closeColor = computed(() => {
  let hsl = hexToHSL(props.background)
  if (hsl.l > 0.5) {
    return 'black'
  } else {
    return '#ffffff'
  }
})
</script>

<style scoped lang="sass">
#close-icon
  position: absolute
  top: 2px
  right: 2px
  cursor: pointer
  z-index: 100
  padding: 0!important
  height: 34px
  width: 34px
  min-width: 34px
  background-color: transparent
  border-radius: 100%
  opacity: 0
  &:hover
    opacity: 1
</style>