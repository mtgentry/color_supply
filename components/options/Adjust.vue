<template lang="pug">
  h2 Adjust
  h3(v-if="store.selectedColor !== null") Hue
  div(v-if="store.selectedColor !== null")
    v-color-picker(v-model="color" mode="hsla" @update:modelValue="change"  width="100%" show-swatches elevation="0" )
    //v-slider(v-model="color.s" label="Saturation" min="0.01" max="1" step="0.01" )
    //v-slider(v-model="color.l" label="Lightness" min="0.01" max="0.99" step="0.01")
</template>

<script setup>
const store = useColorStore()

const color = ref()

watch(() => store.selectedColor, (value) => {
  color.value = store.colors[value]
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
    store.updateSelectedColor(value);
    timeoutId = null;
  }, 10);
}

</script>

<style scoped lang="sass">
h3
  font-size: 15px
  font-style: normal
  font-weight: 400
  line-height: 77%
  letter-spacing: 0.3px
  padding-bottom: 12px
</style>