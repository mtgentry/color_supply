<template lang="pug">
  div#actions.centered
    v-btn(flat @click="shufflePalette" :disabled="!palette" )
      svg.mr-1(width='13' height='12' viewbox='0 0 13 12' fill='none' xmlns='http://www.w3.org/2000/svg')
        path(d='M0.963379 10.0742L1.82243 7.35995' :stroke="palette ? 'var(--color4)' : 'var(--color5)'")
        path(d='M4.09424 8.44727L1.38532 7.58652' :stroke="palette ? 'var(--color4)' : 'var(--color5)'")
        path(d='M1.74341 4.17021C2.48271 2.29702 4.35498 0.966797 6.54785 0.966797C9.38774 0.966797 11.6899 3.1978 11.6899 5.94988C11.6899 8.70196 9.38774 10.933 6.54785 10.933C4.35498 10.933 2.48271 9.60274 1.74341 7.72955' :stroke="palette ? 'var(--color4)' : 'var(--color5)'")
      | Shuffle
    v-btn(flat :disabled="!palette" @click="share()")
      svg.mr-1(xmlns='http://www.w3.org/2000/svg' width='12' height='16' viewbox='0 0 12 16' fill='none')
        path(d='M9.56855 11.0178C8.9248 11.0178 8.33862 11.2754 7.90319 11.6953L4.59216 9.14186C4.76516 8.79962 4.86298 8.41131 4.86298 8C4.86298 7.58871 4.76516 7.2004 4.59215 6.85816L7.90335 4.30473C8.33875 4.72455 8.92478 4.98215 9.56847 4.98215C10.9092 4.98215 12 3.86464 12 2.49104C12 1.11743 10.9092 0 9.56847 0C8.22773 0 7.13702 1.11752 7.13702 2.49112C7.13702 2.90236 7.23482 3.29063 7.40779 3.63283L4.09655 6.1863C3.66117 5.76652 3.07518 5.50896 2.43153 5.50896C1.09079 5.50896 0 6.6264 0 8C0 9.37368 1.09079 10.4911 2.43153 10.4911C3.07524 10.4911 3.66128 10.2335 4.09668 9.81365L7.40773 12.3671C7.23475 12.7093 7.13694 13.0976 7.13694 13.5089C7.13694 14.8826 8.22764 16 9.56839 16C10.9091 16 11.9999 14.8826 11.9999 13.5089C11.9999 12.1355 10.9092 11.0179 9.56855 11.0178ZM9.56847 0.842105C10.456 0.842105 11.178 1.58183 11.178 2.49112C11.178 3.40033 10.456 4.14005 9.56847 4.14005C8.68101 4.14005 7.95898 3.40033 7.95898 2.49104C7.95898 1.58183 8.68101 0.842105 9.56847 0.842105ZM2.43153 9.64901C1.54399 9.64901 0.821962 8.90921 0.821962 8C0.821962 7.09079 1.54399 6.35107 2.43153 6.35107C3.31899 6.35107 4.04102 7.09079 4.04102 8C4.04102 8.90921 3.31899 9.64901 2.43153 9.64901ZM9.56839 15.1579C8.68093 15.1579 7.9589 14.4181 7.9589 13.5089C7.9589 12.5997 8.6809 11.8599 9.56843 11.8599C10.456 11.8601 11.178 12.5997 11.178 13.5089C11.178 14.4181 10.4559 15.1579 9.56839 15.1579Z' :fill="palette ? 'var(--color4)' : 'var(--color5)'")
      | Share
    v-btn(flat :disabled="!palette" @click="favorite(palette)" min-width="30px" )
      IconsHeart(:stroke="!palette ?  'var(--color5)' : palette?.favorite ? 'var(--color9)' : 'var(--color4)'"
        :fill="!palette ? 'transparent' : palette?.favorite ? 'var(--color9)' : 'transparent'")
</template>

<script setup>
const colorStore = useColorStore()
const { shufflePalette } = colorStore
const { palette, info } = storeToRefs(colorStore)
</script>

<style scoped lang="sass">
#actions
  flex-direction: row
  justify-content: space-between
  width: 250px
  position: absolute
  bottom: 10px
  right: 10px

</style>