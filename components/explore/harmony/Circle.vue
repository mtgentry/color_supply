<template lang="pug">
  g(ref="circle_svg")
    g(transform="translate(91 31)" v-if="true")
      circle(r="7" stroke="#1D1E20" stroke-width="2" fill="transparent")
    g(transform="translate(53 23)" v-if="harmony === 'analogous'")
      path(d='M14.199 12.7848C19.5818 10.4827 25.2304 8.99743 30.9563 8.32886' stroke='#1D1E20' stroke-width='2')
      path(d='M62.3193 12.998C56.7991 10.5785 50.9914 9.02328 45.1015 8.33231' stroke='#1D1E20' stroke-width='2')
      circle(cx='8' cy='17' r='7' transform='rotate(-180 8 17)' stroke='#1D1E20' stroke-width='2')
      circle(cx='38' cy='8' r='7' transform='rotate(-180 38 8)' stroke='#1D1E20' stroke-width='2')
      circle(cx='68' cy='17' r='7' transform='rotate(-180 68 17)' stroke='#1D1E20' stroke-width='2')
    g(transform="translate(83 23)" v-else-if="harmony === 'complimentary'")
      circle(cx='8' cy='127.828' r='7' stroke='#1D1E20' stroke-width='2')
      circle(cx='8' cy='8' r='7' stroke='#1D1E20' stroke-width='2')
      line(x1='8' y1='15.0527' x2='8' y2='121.413' stroke='#1D1E20' stroke-width='2')
    g(transform="translate(52 23)" v-else-if="harmony === 'split-complimentary'")
      circle(cx='38.5' cy='8.5' r='7' transform='rotate(-90 38.5 8)' stroke='#1D1E20' stroke-width='2')
      circle(cx='8.5' cy='120.5' r='7' transform='rotate(-90 8 120)' stroke='#1D1E20' stroke-width='2')
      circle(cx='68.5' cy='120.5' r='7' transform='rotate(-90 68 120)' stroke='#1D1E20' stroke-width='2')
      path(d='M37.3364 15.5598L10.4082 113' stroke='#1D1E20' stroke-width='2')
      path(d='M39.6636 15.56L65.5919 113' stroke='#1D1E20' stroke-width='2')
    g(transform="translate(33 23)" v-else-if="harmony === 'triad'")
      path(d='M15.6382 97.8083H102.106' stroke='#1D1E20' stroke-width='2.29787')
      path(d='M12.1922 90.4892L54.8509 14.5106' stroke='#1D1E20' stroke-width='2.29787')
      path(d='M105.553 90.4892L61.7447 14.5104' stroke='#1D1E20' stroke-width='2.29787')
      circle(cx='109' cy='97' r='7' stroke='#1D1E20' stroke-width='2')
      circle(cx='58' cy='8' r='7' stroke='#1D1E20' stroke-width='2')
      circle(cx='8' cy='97' r='7' stroke='#1D1E20' stroke-width='2')
    g(transform="translate(23 23)" v-else-if="harmony === 'square'")
      circle(cx='68' cy='128' r='7' stroke='#1D1E20' stroke-width='2')
      circle(cx='68' cy='8' r='7' stroke='#1D1E20' stroke-width='2')
      circle(cx='8' cy='68' r='7' transform='rotate(-90 8 68)' stroke='#1D1E20' stroke-width='2')
      circle(cx='128' cy='68' r='7' transform='rotate(-90 128 68)' stroke='#1D1E20' stroke-width='2')
      path(d='M123.095 73.6305L73.0396 123.92M123.342 63.2377L73.283 13.1789M63.4992 13.3968L12.924 63.972M12.6811 72.7851L63.3734 123.477' stroke='#1D1E20' stroke-width='2')


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