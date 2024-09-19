<template lang="pug">
  div#actions(ref="actions")
    v-btn.actionBtn(flat :disabled="!palette" @click="favorite(palette)" min-width="30px" )
      IconsHeart(:stroke="!palette ?  'var(--color5)' : palette?.favorite ? 'var(--color9)' : 'var(--color4)'"
        :fill="!palette ? 'var(--color5)' : palette?.favorite ? 'var(--color9)' : 'transparent'")
    v-btn.actionBtn(flat @click="toggleInfo" :disabled="!palette" :active="info")
      svg.mr-1(width='18' height='17' viewbox='0 0 18 17' fill='none' xmlns='http://www.w3.org/2000/svg')
        path(fill-rule='evenodd' clip-rule='evenodd' d='M3.56527 10.6501C1.48222 9.86716 0 7.85667 0 5.5C0 2.46243 2.46243 0 5.5 0C6.82963 0 8.04906 0.471818 9 1.25716C9.95094 0.471818 11.1704 0 12.5 0C15.5376 0 18 2.46243 18 5.5C18 7.85667 16.5178 9.86716 14.4347 10.6501C14.4777 10.9271 14.5 11.2109 14.5 11.5C14.5 14.5376 12.0376 17 9 17C5.96243 17 3.5 14.5376 3.5 11.5C3.5 11.2109 3.5223 10.9271 3.56527 10.6501ZM5.5 11C6.82963 11 8.04906 10.5282 9 9.74284C9.95094 10.5282 11.1704 11 12.5 11C12.8283 11 13.1499 10.9712 13.4625 10.9161C13.4872 11.1072 13.5 11.3021 13.5 11.5C13.5 13.9853 11.4853 16 9 16C6.51472 16 4.5 13.9853 4.5 11.5C4.5 11.3021 4.51278 11.1072 4.53754 10.9161C4.85005 10.9712 5.17167 11 5.5 11ZM3.81098 9.67228C2.16263 9.00434 1 7.38794 1 5.5C1 3.01472 3.01472 1 5.5 1C6.5519 1 7.51951 1.36092 8.28573 1.96569C7.48328 2.92152 7 4.15433 7 5.5C7 5.78906 7.0223 6.07291 7.06527 6.34993C5.54856 6.91999 4.35039 8.14085 3.81098 9.67228ZM4.77693 9.94222C5.01234 9.98024 5.25386 10 5.5 10C6.5519 10 7.51951 9.63908 8.28573 9.03431C7.86536 8.53359 7.53258 7.95686 7.31098 7.32772C6.14075 7.80192 5.21533 8.75416 4.77693 9.94222ZM14.189 9.67228C15.8374 9.00434 17 7.38794 17 5.5C17 3.01472 14.9853 1 12.5 1C11.4481 1 10.4805 1.36093 9.71427 1.96569C10.5167 2.92153 11 4.15433 11 5.5C11 5.78906 10.9777 6.07291 10.9347 6.34993C12.4514 6.91999 13.6496 8.14085 14.189 9.67228ZM9.96246 6.08393C9.98723 5.89279 10 5.69789 10 5.5C10 4.42835 9.6254 3.4442 9 2.67134C8.3746 3.4442 8 4.42835 8 5.5C8 5.69789 8.01277 5.89279 8.03754 6.08393C8.35005 6.02877 8.67167 6 9 6C9.32833 6 9.64995 6.02877 9.96246 6.08393ZM8.27693 7.05779C8.51234 7.01977 8.75386 7 9 7C9.24614 7 9.48766 7.01977 9.72307 7.05779C9.55167 7.52229 9.30582 7.95074 9 8.32866C8.69418 7.95074 8.44834 7.52229 8.27693 7.05779ZM10.689 7.32772C11.8593 7.80192 12.7847 8.75416 13.2231 9.94222C12.9877 9.98024 12.7461 10 12.5 10C11.4481 10 10.4805 9.63907 9.71427 9.03431C10.1346 8.53359 10.4674 7.95686 10.689 7.32772Z'
          :fill="palette ? 'var(--color4)' : 'var(--color5)'")
      | Info
    v-btn.actionBtn(flat @click="shufflePalette" :disabled="!palette" )
      svg.mr-1(width='13' height='12' viewbox='0 0 13 12' fill='none' xmlns='http://www.w3.org/2000/svg')
        path(d='M0.963379 10.0742L1.82243 7.35995' :stroke="palette ? 'var(--color4)' : 'var(--color5)'")
        path(d='M4.09424 8.44727L1.38532 7.58652' :stroke="palette ? 'var(--color4)' : 'var(--color5)'")
        path(d='M1.74341 4.17021C2.48271 2.29702 4.35498 0.966797 6.54785 0.966797C9.38774 0.966797 11.6899 3.1978 11.6899 5.94988C11.6899 8.70196 9.38774 10.933 6.54785 10.933C4.35498 10.933 2.48271 9.60274 1.74341 7.72955' :stroke="palette ? 'var(--color4)' : 'var(--color5)'")
      | Shuffle
    v-btn.actionBtn(flat :disabled="!palette" )
      svg.mr-1(width='14' height='13' viewbox='0 0 14 13' fill='none' xmlns='http://www.w3.org/2000/svg')
        path(d='M4.58443 1H13.0588V2H4.58443C4.39235 2.5826 3.87409 3 3.26488 3C2.65568 3 2.13741 2.5826 1.94534 2H0V1H1.94534C2.13741 0.417404 2.65568 0 3.26488 0C3.87409 0 4.39235 0.417404 4.58443 1Z' :fill="palette ? 'var(--color4)' : 'var(--color5)'")
        path(d='M6.19199 11H13.0588V12H6.19199C5.98607 12.5826 5.43045 13 4.77734 13C4.12423 13 3.56861 12.5826 3.3627 12H0V11H3.3627C3.56861 10.4174 4.12423 10 4.77734 10C5.43045 10 5.98607 10.4174 6.19199 11Z' :fill="palette ? 'var(--color4)' : 'var(--color5)'")
        path(d='M6.86685 7L1.43925e-05 7L1.448e-05 6L6.86685 6C7.07277 5.4174 7.62838 5 8.28149 5C8.9346 5 9.49022 5.4174 9.69614 6L13.0588 6L13.0588 7L9.69614 7C9.49022 7.5826 8.9346 8 8.28149 8C7.62838 8 7.07277 7.5826 6.86685 7Z' :fill="palette ? 'var(--color4)' : 'var(--color5)'")
      | Adjust
    div.clickable#extra(@click="togglePreviews")
      svg(xmlns='http://www.w3.org/2000/svg' width='33' height='28' viewbox='0 0 33 32' fill='none')
        circle(cx='16' cy='16' r='16' fill='white')
        circle(cx='2' cy='2' r='2' transform='matrix(-1.19249e-08 1 1 1.19249e-08 14 14)' :fill='showPreviews ? "var(--color1)" : "#D9DBDF"')
        circle(cx='2' cy='2' r='2' transform='matrix(-1.19249e-08 1 1 1.19249e-08 22 14)' :fill='showPreviews ? "var(--color1)" : "#D9DBDF"')
        circle(cx='2' cy='2' r='2' transform='matrix(-1.19249e-08 1 1 1.19249e-08 6 14)' :fill='showPreviews ? "var(--color1)" : "#D9DBDF"')
    div#line(v-if="showPreviews" v-auto-animate)
      svg(height='48' width='2')
        line(x1='5' y1='0' x2='5' y2='48' style='stroke:var(--color4);stroke-width:2')
    div.centered(v-show="showPreviews")
      ExplorePreviews
</template>

<script setup>
const colorStore = useColorStore()
const actions = ref(null)
const filterStore = useFilterStore()
const {preview, showPreviews} = storeToRefs(filterStore)
const { shufflePalette, toggleInfo } = colorStore
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
</script>

<style scoped lang="sass">
#actions
  width: 374px
  display: flex
  flex-direction: row

  padding: 19px 45px 24px 24px
  overflow-x: hidden
  .actionBtn
    :deep(.v-btn__overlay)
      opacity: 0
  .actionBtn
    padding: 0 10px
    margin: 0 5px
  #line
    background: var(--color5)
    margin: -10px 16px -10px 12px
  #extra
    position: absolute
    right: 5px
    z-index: 11
</style>