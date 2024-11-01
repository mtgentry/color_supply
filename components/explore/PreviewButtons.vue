<template lang="pug">
  div#actions(ref="actions")
    v-btn(flat :disabled="!palette.colors" @click="favorite(palette)")
      IconsHeart(:stroke="!palette.colors ?  'var(--color5)' : palette?.favorite ? 'var(--color9)' : changeColorForBackground(props.background)"
        :fill="!palette.colors ? 'var(--color5)' : palette?.favorite ? 'var(--color9)' : 'transparent'")
    v-btn.pa-0(flat)
      IconsShare(:stroke='changeColorForBackground(props.background)')
    v-btn.pa-0(flat)
      IconsPositions(:fill='changeColorForBackground(props.background)')
      v-menu(activator='parent')
        v-list.pa-0
          v-list-item
            h2 Position
          v-list-item(@click="changePreview(0)" :class="{ 'activePreview': preview === 0 }")
            IconsCorner(stroke="var(--color5)" fill="var(--color5)")
            span.pl-2 Corner
          v-list-item(@click="changePreview(1)" :class="{ 'activePreview': preview === 1 }")
            IconsSide(stroke="var(--color5)" fill="var(--color5)")
            span.pl-2 Side
          v-list-item(@click="changePreview(2)" :class="{ 'activePreview': preview === 2 }")
            IconsBottom(stroke="var(--color5)" fill="var(--color5)")
            span.pl-2 Bottom
    //v-btn.actionBtn(flat @click="shufflePalette" :disabled="!palette" )
    //  svg.mr-1(width='13' height='12' viewbox='0 0 13 12' fill='none' xmlns='http://www.w3.org/2000/svg')
    //    path(d='M0.963379 10.0742L1.82243 7.35995' :stroke="palette ? 'var(--color4)' : 'var(--color5)'")
    //    path(d='M4.09424 8.44727L1.38532 7.58652' :stroke="palette ? 'var(--color4)' : 'var(--color5)'")
    //    path(d='M1.74341 4.17021C2.48271 2.29702 4.35498 0.966797 6.54785 0.966797C9.38774 0.966797 11.6899 3.1978 11.6899 5.94988C11.6899 8.70196 9.38774 10.933 6.54785 10.933C4.35498 10.933 2.48271 9.60274 1.74341 7.72955' :stroke="palette ? 'var(--color4)' : 'var(--color5)'")
    //  | Shuffle
    //v-btn.actionBtn(flat :disabled="!palette" )
    //  svg.mr-1(width='14' height='13' viewbox='0 0 14 13' fill='none' xmlns='http://www.w3.org/2000/svg')
    //    path(d='M4.58443 1H13.0588V2H4.58443C4.39235 2.5826 3.87409 3 3.26488 3C2.65568 3 2.13741 2.5826 1.94534 2H0V1H1.94534C2.13741 0.417404 2.65568 0 3.26488 0C3.87409 0 4.39235 0.417404 4.58443 1Z' :fill="palette ? 'var(--color4)' : 'var(--color5)'")
    //    path(d='M6.19199 11H13.0588V12H6.19199C5.98607 12.5826 5.43045 13 4.77734 13C4.12423 13 3.56861 12.5826 3.3627 12H0V11H3.3627C3.56861 10.4174 4.12423 10 4.77734 10C5.43045 10 5.98607 10.4174 6.19199 11Z' :fill="palette ? 'var(--color4)' : 'var(--color5)'")
    //    path(d='M6.86685 7L1.43925e-05 7L1.448e-05 6L6.86685 6C7.07277 5.4174 7.62838 5 8.28149 5C8.9346 5 9.49022 5.4174 9.69614 6L13.0588 6L13.0588 7L9.69614 7C9.49022 7.5826 8.9346 8 8.28149 8C7.62838 8 7.07277 7.5826 6.86685 7Z' :fill="palette ? 'var(--color4)' : 'var(--color5)'")
    //  | Adjust

    //div#line(v-if="showPreviews" v-auto-animate)
    //  svg(height='48' width='2')
    //    line(x1='5' y1='0' x2='5' y2='48' style='stroke:var(--color4);stroke-width:2')
    //div.centered(v-show="showPreviews")
    //  ExplorePreviews
    v-btn.pa-0#close-icon(flat)
      svg(width='34', height='34', viewBox='0 0 34 34', fill='none',
        xmlns='http://www.w3.org/2000/svg' @click="closePreview")
        circle(cx='17', cy='17', r='17', fill='transparent')
        path(d='M12.001 12.2778L21.7892 22.0661', :stroke='changeColorForBackground(props.background)')
        path(d='M21.7893 12.2778L12.0011 22.0661', :stroke='changeColorForBackground(props.background)')

</template>

<script setup>
const props = defineProps(
  {
    background: {
      type: String,
      default: 'white',
    },
  }
)
const colorStore = useColorStore()
const actions = ref(null)
const filterStore = useFilterStore()
const {preview, showPreviews, previousPreview} = storeToRefs(filterStore)
const { palette, info  } = storeToRefs(colorStore)
const togglePreviews = () => {
  if (!showPreviews.value) {
    setTimeout(() => {
      actions.value.scrollTo({
        left: actions.value.scrollWidth,
        behavior: 'smooth'
      });
    }, 10)
    showPreviews.value = true
  } else {
    actions.value.scrollTo({
      left: 0,
      behavior: 'smooth'
    });
    setTimeout(() => {
      showPreviews.value = false
    }, 150)
  }
}
onMounted(() => {
  if (showPreviews.value) {
    showPreviews.value = false
  }
})

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

const changePreview = (value) => {
  preview.value = value
}
</script>

<style scoped lang="sass">
#actions
  display: flex
  flex-direction: row
  position: absolute
  top: 2px
  right: 2px
  z-index: 100
  overflow-x: hidden
  opacity: 0.4
  transition: opacity 0.3s ease
  &:hover
    opacity: 1
  #line
    background: var(--color5)
    margin: -10px 16px -10px 12px
  //#extra
  //  position: absolute
  //  right: 5px
  //  z-index: 11
  .v-btn
    padding: 0 10px
    cursor: pointer
    height: 34px
    min-width: unset
    background-color: transparent!important
    border-radius: 100%
    border: unset
    :deep(.v-btn__overlay)
      opacity: 0

.v-list-item
  min-height: 45px
  h2
    font-size: 1.0625rem
    font-weight: 500
    line-height: normal
    letter-spacing: 0.34px
:deep(.v-list-item:not(:first-child))
  padding-top: 0
  padding-bottom: 0

  &:hover:not(.activePreview)
    background: var(--color1)
    cursor: pointer
    .v-list-item__content
      color: var(--color7)

      svg
        fill: var(--color7)
        stroke: var(--color7)

        path.background
          fill: var(--color1)
        path.middle
          fill: var(--color7)

  .v-list-item__content
    display: flex
    align-items: center
    border-bottom: var(--color5) 1px solid
    height: 100%
    font-size: 0.875rem
    font-style: normal
    font-weight: 400
    line-height: 135%

.activePreview
  color: var(--color1)

  :deep(.middle)
    stroke: var(--color1) !important
    fill: var(--color1) !important

  :deep(.background)
    stroke: var(--color1) !important
  &:hover
    cursor: default
  svg:hover
    cursor: default
</style>