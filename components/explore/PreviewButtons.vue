<template lang="pug">
  div#actions.centered
    v-btn(flat :disabled="!palette"  @click="favorite(palette?.id)")
      IconsHeart(:stroke="!palette ?  'var(--color6)' : palette?.favorite ? 'var(--color9)' : 'var(--color4)'"
        :fill="!palette ? 'transparent' : palette?.favorite ? 'var(--color9)' : 'transparent'")
    v-btn(flat @click="toggleInfo" :disabled="!palette" :active="info") Info
    v-btn(flat @click="selectRandomPalette")
      svg.mr-1(width='13' height='12' viewbox='0 0 13 12' fill='none' xmlns='http://www.w3.org/2000/svg')
        path(d='M0.963379 10.0742L1.82243 7.35995' stroke='#A4A7B1')
        path(d='M4.09424 8.44727L1.38532 7.58652' stroke='#A4A7B1')
        path(d='M1.74341 4.17021C2.48271 2.29702 4.35498 0.966797 6.54785 0.966797C9.38774 0.966797 11.6899 3.1978 11.6899 5.94988C11.6899 8.70196 9.38774 10.933 6.54785 10.933C4.35498 10.933 2.48271 9.60274 1.74341 7.72955' stroke='#A4A7B1')
      | Shuffle
    v-btn(flat) Adjust


</template>

<script setup>
const colorStore = useColorStore()
const { selectRandomPalette, toggleInfo } = colorStore
const { palette, info } = storeToRefs(colorStore)
</script>

<style scoped lang="sass">
#actions
  flex-direction: row
  justify-content: space-between
  padding: 26px 23px

.v-btn
  border: 1px solid var(--color4)
  color: var(--color4)
  font-size: 13px
  letter-spacing: 0.26px

  &.v-btn--disabled
    color: var(--color6)

</style>