<template lang="pug">
    h2#text-label Color
    v-color-picker(v-model="color" mode="hsla" @update:modelValue="change"  width="100%"  elevation="0" hide-inputs)
    .d-flex.flex-row.align-center.justify-space-between
      .d-flex.align-center
        svg(width="26" height="26" viewBox="0 0 26 26").mr-5
          circle(r="12" cx="13" cy="13" :fill="color" :stroke="color === '#FFFFFF' ? 'var(--color3)' : ''" stroke-width="1")
        div#colorLabel {{ color }}
      .d-flex.justify-end.align-center
        svg.mr-2.clickable(xmlns='http://www.w3.org/2000/svg' width='15' height='13' viewBox='0 0 15 13' fill='none' @click="clipboard(color, snackbar)")
          path(d='M1.86523 1.61328H10.1854V8.82345H1.86523V1.61328Z' stroke='#788092' stroke-width='1.25')
          path(d='M5.59375 4.95117H13.9139V12.1613H5.59375V4.95117Z' fill='white' stroke='#788092' stroke-width='1.25')
        svg(xmlns='http://www.w3.org/2000/svg' width='19' height='22' viewBox='0 0 19 22' fill='none')
          path(d='M11.0649 9.72424C11.0649 8.50161 11.0649 6.70437 11.0649 6.68842C11.0649 5.33794 9.97008 4.24316 8.6196 4.24316C7.26913 4.24316 6.17435 5.33794 6.17435 6.68842C6.17435 6.70746 6.17341 8.88731 6.17406 9.55559' stroke='#788092' stroke-width='1.26486')
          path(d='M11.0649 7.19451C11.0649 5.97188 11.0649 6.70437 11.0649 6.68842C11.0649 5.33794 9.97008 4.24316 8.6196 4.24316C7.26913 4.24316 6.17435 5.33794 6.17435 6.68842C6.17435 6.70746 6.17341 8.88731 6.17406 9.55559' stroke='#788092' stroke-width='1.26486')
          path(d='M3.87267 10.1207H13.3676V18.3676H3.87267V10.1207Z' stroke='#788092' stroke-width='1.26486')


</template>

<script setup>
const snackbar = useSnackbar()
const store = useColorStore()
const color = ref()
const options = ref([0])

const {selectedColor, palette, createColors} = storeToRefs(store)

onMounted(() => {
  color.value = createColors.value[selectedColor.value]
})

watch(color, (value) => {
  store.updateSelectedColor(value);
})

let timeoutId = null;
const change = (value) => {
  if (timeoutId) {
    return
  }
  timeoutId = setTimeout(() => {
    store.updateSelectedColor(value)
    timeoutId = null;
  }, 10);
}

watch(selectedColor, (value) => {
  color.value = createColors.value[value]
})

</script>

<style scoped lang="sass">

#text-label
  text-transform: none
  color: var(--color2)
  padding-bottom: 24px!important

:deep(.v-expansion-panel-title)
  padding: 0
  min-height: unset!important

:deep(.v-expansion-panel-text__wrapper)
  padding: 0!important
:deep(.v-color-picker-preview__alpha)
  display: none
:deep(.v-color-picker-preview__eye-dropper)
  display: none
:deep(.v-color-picker-preview__dot)
  display: none
:deep(.v-color-picker__controls)
  padding: 15px 0
:deep(.v-color-picker-preview__sliders)
  padding-inline-end: 0
h3
  font-size: 15px
  font-style: normal
  font-weight: 400
  line-height: 77%
  letter-spacing: 0.3px
  padding-bottom: 12px
  padding-top: 24px

#colorLabel
  font-size: 18px
#actions
  align-items: end
  justify-self: end
</style>