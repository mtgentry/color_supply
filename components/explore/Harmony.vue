<template lang="pug">
  div.relative.centered
    svg(width='182' height='182' viewbox='0 0 182 182' fill='none' xmlns='http://www.w3.org/2000/svg')
      path(d='M91.4604 91.4604L150.504 150.504C140.14 160.868 127.23 168.322 113.072 172.115L91.4604 91.4604Z' fill='#50B78B'  @mousedown="selectColor(5)")
      path(d='M91.4604 91.4604L113.072 172.115C98.914 175.909 84.0069 175.909 69.8491 172.115L91.4604 91.4604Z' fill='#319A90' @mousedown="selectColor(6)")
      path(d='M91.4604 91.4604L69.8491 172.115C55.6912 168.322 42.7813 160.868 32.417 150.504L91.4604 91.4604Z' fill='#3E808C' @mousedown="selectColor(7)")
      path(d='M91.4604 91.4604L32.417 150.504C22.0527 140.14 14.5992 127.23 10.8056 113.072L91.4604 91.4604Z' fill='#366F99' @mousedown="selectColor(8)")
      path(d='M91.4604 91.4604L10.8056 113.072C7.01205 98.914 7.01204 84.0069 10.8056 69.8491L91.4604 91.4604Z' fill='#4A3D88' @mousedown="selectColor(9)")
      path(d='M91.4604 91.4604L10.8056 69.8491C14.5992 55.6912 22.0527 42.7813 32.417 32.417L91.4604 91.4604Z' fill='#9C46AA' @mousedown="selectColor(10)")
      path(d='M91.4604 91.4604L32.417 32.417C42.7813 22.0527 55.6912 14.5992 69.8491 10.8056L91.4604 91.4604Z' fill='#DD56B1' @mousedown="selectColor(11)")
      path(d='M91.4604 91.4604L69.8491 10.8056C84.0069 7.01205 98.914 7.01204 113.072 10.8056L91.4604 91.4604Z' fill='#F03872' @mousedown="selectColor(0)")
      path(d='M91.4604 91.4604L113.072 10.8056C127.23 14.5992 140.14 22.0527 150.504 32.417L91.4604 91.4604Z' fill='#F68745' @mousedown="selectColor(1)")
      path(d='M91.4604 91.4604L150.504 32.417C160.868 42.7813 168.322 55.6912 172.115 69.8491L91.4604 91.4604Z' fill='#F0B800' @mousedown="selectColor(2)")
      path(d='M91.4604 91.4604L172.115 69.8491C175.909 84.0069 175.909 98.914 172.115 113.072L91.4604 91.4604Z' fill='#E3EE00' @mousedown="selectColor(3)")
      path(d='M91.4604 91.4604L172.115 113.072C168.322 127.23 160.868 140.14 150.504 150.504L91.4604 91.4604Z' fill='#74CA4B' @mousedown="selectColor(4)")
      path(d='M82.4005 125.268C101.072 130.271 120.264 119.19 125.267 100.519C130.27 81.8477 119.189 62.6559 100.518 57.6529C81.8465 52.6499 62.6547 63.7303 57.6518 82.4016C52.6488 101.073 63.7292 120.265 82.4005 125.268Z' fill='white')
      ExploreHarmonyCircle(:selectedColor="selectedColor" :harmony="harmonies[harmony]")
  v-carousel(hide-delimiters height="50px" v-model="harmony")
    v-carousel-item(v-for="h in harmonies" :key="h")
      div.centered.h-100 {{ capitalized(h) }}

</template>

<script setup>
const harmonies = ['complimentary', 'split-complimentary', 'analogous', 'triad', 'square']
const harmony = ref('complimentary')
const positions = computed(() => {
  const positions = [];
  const angleStep = (2 * Math.PI) / 12;
  const distance = 80; // distance from the center to a dot
  const center = 18
  for (let i = 0; i < 12; i++) {
    const angle = angleStep * i;
    const x = distance + distance * Math.cos(angle);
    const y = distance + distance * Math.sin(angle);

    positions.push({ x: x+center, y: y+center });
  }
  return positions;
})
const visible = ref([])
const selectedColor = ref(0)
const selectColor = (i) => {
  selectedColor.value = i
}
</script>

<style scoped lang="sass">
:deep(.v-window__controls)
  padding: 0

:deep(.v-btn--variant-elevated)
  box-shadow: unset
:deep(.v-btn--icon.v-btn--density-default)
  width: 30px
  height: 30px


.dot
  position: absolute
  width: 20px
  height: 20px
  border: 1px solid black
  border-radius: 50%
  cursor: pointer

.relative
  position: relative

path
  cursor: pointer
</style>