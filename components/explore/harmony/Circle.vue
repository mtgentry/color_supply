<template lang="pug">
  circle(:cx="circle_position.x" :cy="circle_position.y" r="7" stroke="#1D1E20" stroke-width="2" ref="circle_svg" fill="transparent"
    @mouseup="stopDrag")
</template>

<script setup>
import gsap from "gsap"
import Draggable from "gsap/Draggable"
const props = defineProps({
  selectedColor: Number
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
  const drag = ref(Draggable.create([circle_svg.value], {
    type: "rotation",
    liveSnap:true,
    onDragEnd: function() {
      let endValue = this.endRotation;
      gsap.to(circle_svg.value, {rotation: Math.round(endValue / 30) * 30, duration: 0.2});
    }
  }))
})
</script>

<style scoped lang="sass">
circle
  cursor: pointer
  transition: matrix 3s ease
</style>