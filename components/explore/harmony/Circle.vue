<template lang="pug">
  g(ref="circle_svg" )
    g(transform="translate(92 33)" v-if="false")
      circle(r="7" stroke="#1D1E20" stroke-width="2"  fill="transparent")
    g(transform="translate(84 25)" v-else-if="harmony === 'complimentary'")
      circle(cx='8' cy='127.828' r='7' stroke='#1D1E20' stroke-width='2' fill='transparent')
      circle(cx='8' cy='8' r='7' stroke='#1D1E20' stroke-width='2' fill='transparent')
      line(x1='8' y1='15.0527' x2='8' y2='121.413' stroke='#1D1E20' stroke-width='2')
    g(transform="translate(38 19)" v-else-if="harmony === 'split-complimentary'")
      circle(cx='53.9732' cy='13.6591' r='7' transform='rotate(-71.9139 53.9732 13.6591)' stroke='#1D1E20' stroke-width='2' fill='transparent')
      circle(cx='21.6507' cy='124.986' r='7' transform='rotate(-71.9139 21.6507 124.986)' stroke='#1D1E20' stroke-width='2' fill='transparent')
      path(d='M52.594 21.0936L23.6657 118.807' stroke='#1D1E20' stroke-width='2')
      circle(cx='8' cy='8' r='7' transform='matrix(-0.257859 -0.966183 -0.966183 0.257859 89.559 132.248)' stroke='#1D1E20' stroke-width='2' fill='transparent')
      path(d='M54.5661 21.1479L78.0933 120.301' stroke='#1D1E20' stroke-width='2')


</template>

<script setup>
import gsap from "gsap"
import Draggable from "gsap/Draggable"

const props = defineProps({
  selectedColor: Number,
  harmony: String
})
const circle_svg = ref(null)
const circle_position = ref({x: 92, y: 30})

watch(() => props.selectedColor, (value) => {
  gsap.to(circle_svg.value, {rotation: `${value * 30}_short`})
})

onMounted(() => {
  const bounds = circle_svg.value.parentElement.getBBox();
  gsap.set(circle_svg.value, {
    svgOrigin: (bounds.x + bounds.width / 2) + " " + (bounds.y + bounds.height / 2)
  });
  gsap.registerPlugin(Draggable)
  Draggable.create([circle_svg.value], {
    type: "rotation",
    liveSnap:true,
    onDragEnd: function() {
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