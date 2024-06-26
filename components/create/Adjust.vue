<template lang="pug">
  v-expansion-panels(static multiple variant="accordion" v-model="options")
    ExploreExpansionPanel(title="Adjust" static variant="accordion")
      template(v-slot:title)
        h2 Adjust
      h3(v-if="selectedColor !== null") Hue
      div(v-if="selectedColor !== null")
        v-color-picker(v-model="color" mode="hsla" @update:modelValue="change"  width="100%"  elevation="0" )
        //v-slider(v-model="color.s" label="Saturation" min="0.01" max="1" step="0.01" )
        //v-slider(v-model="color.l" label="Lightness" min="0.01" max="0.99" step="0.01")
</template>

<script setup>
const store = useColorStore()
const color = ref()
const options = ref([0])

const {selectedColor, palette, createColors} = storeToRefs(store)

onMounted(() => {
  color.value = createColors.value[selectedColor.value]
})

watch(() => color, (value) => {
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

</script>

<style scoped lang="sass">
h2
  text-transform: none
  color: var(--color2)
  padding-bottom: 0!important

:deep(.v-expansion-panel-title)
  padding: 0
  min-height: unset!important

:deep(.v-expansion-panel-text__wrapper)
  padding: 0!important
:deep(.v-color-picker-preview__alpha)
  display: none
h3
  font-size: 15px
  font-style: normal
  font-weight: 400
  line-height: 77%
  letter-spacing: 0.3px
  padding-bottom: 12px
  padding-top: 24px
</style>