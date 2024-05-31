<template lang="pug">
  g(ref="circle_svg")
    g(transform="translate(92 33)" v-if="false")
      circle(r="7" stroke="#1D1E20" stroke-width="2" fill="transparent")
    g(transform="translate(51 21)" v-else-if="harmony === 'analogous'")
      path(d='M17.199 16.2848C22.5818 13.9827 28.2304 12.4974 33.9563 11.8289' stroke='#1D1E20' stroke-width='2')
      path(d='M65.3193 16.498C59.7991 14.0785 53.9914 12.5233 48.1015 11.8323' stroke='#1D1E20' stroke-width='2')
      circle(cx='11.3137' cy='20.2991' r='7' transform='rotate(135 11.3137 20.2991)' stroke='#1D1E20' stroke-width='2' fill='transparent')
      circle(cx='41.0122' cy='11.8137' r='7' transform='rotate(135 41.0122 11.8137)' stroke='#1D1E20' stroke-width='2' fill='transparent')
      circle(cx='70.7107' cy='20.2991' r='7' transform='rotate(135 70.7107 20.2991)' stroke='#1D1E20' stroke-width='2' fill='transparent')
    g(transform="translate(83 25)" v-else-if="harmony === 'complimentary'")
      circle(cx='8' cy='127.828' r='7' stroke='#1D1E20' stroke-width='2' fill='transparent')
      circle(cx='8' cy='8' r='7' stroke='#1D1E20' stroke-width='2' fill='transparent')
      line(x1='8' y1='15.0527' x2='8' y2='121.413' stroke='#1D1E20' stroke-width='2')
    g(transform="translate(49 24)" v-else-if="harmony === 'split-complimentary'")
      circle(cx='41.5' cy='8.5' r='7' transform='rotate(-90 41.5 8.5)' stroke='#1D1E20' stroke-width='2' fill='transparent')
      circle(cx='11.5' cy='120.088' r='7' transform='rotate(-90 11.5 120.088)' stroke='#1D1E20' stroke-width='2' fill='transparent')
      circle(cx='71.5' cy='120.088' r='7' transform='rotate(-90 71.5 120.088)' stroke='#1D1E20' stroke-width='2' fill='transparent')
      path(d='M40.3364 15.5598L13.4082 113' stroke='#1D1E20' stroke-width='2')
      path(d='M42.6636 15.56L68.5919 113' stroke='#1D1E20' stroke-width='2')
    g(transform="translate(33 24)" v-else-if="harmony === 'triad'")
      path(d='M14.6382 97.8083H103.106' stroke='#1D1E20' stroke-width='2.29787')
      path(d='M11.1922 91.4893L54.8511 14.5107' stroke='#1D1E20' stroke-width='2.29787')
      path(d='M106.553 91.4893L61.7447 14.5105' stroke='#1D1E20' stroke-width='2.29787')
      circle(cx='109' cy='97' r='7' stroke='#1D1E20' stroke-width='2')
      circle(cx='58' cy='8' r='7' stroke='#1D1E20' stroke-width='2')
      circle(cx='8' cy='97' r='7' stroke='#1D1E20' stroke-width='2')

</template>

<script setup>
import gsap from "gsap"
import Draggable from "gsap/Draggable"
import {onBeforeUpdate} from "vue";
import General from "~/pages/manage/general.vue";

const props = defineProps({
  selectedColor: Number,
  harmony: String
})
const circle_svg = ref(null)
const circle_position = ref({x: 92, y: 30})
const drag = ref(null)
watch(() => props.selectedColor, (value) => {
  gsap.to(circle_svg.value, {rotation: `${value * 30}_short`})
})
gsap.registerPlugin(Draggable)
onUpdated(() => {
  if (drag.value) return
  const bounds = circle_svg.value.parentElement.getBBox()
  if (!bounds.height) return
  gsap.set(circle_svg.value, {
    svgOrigin: (bounds.x + bounds.width / 2) + " " + (bounds.y + bounds.height / 2)
  });
  drag.value = Draggable.create([circle_svg.value], {
    type: "rotation",
    liveSnap:true,
    onDragEnd: function() {
      // snap to the nearest 30 degrees
      let endValue = this.endRotation;
      gsap.to(circle_svg.value, {rotation: Math.round(endValue / 30) * 30, duration: 0.2});
    }
  })
})
</script>

<style scoped lang="sass">
circle
  cursor: pointer
  transition: matrix 3s ease
</style>