<template lang="pug">
  circle(:cx="circle_position.x" :cy="circle_position.y" r="7" stroke="#1D1E20" stroke-width="2" ref="circle_svg" fill="transparent"
    @mouseup="stopDrag")
</template>

<script setup>
import gsap from "gsap"
import Draggable from "gsap/Draggable"

const circle_svg = ref(null)
const circle_position = ref({x: 92, y: 30})

const stopDrag = () => {
  if (circle_svg.value) {
    console.log(`x: ${circle_svg.value.getAttribute('cx')}, y: ${circle_svg.value.getAttribute('cy')}`);
  }
}

onMounted(() => {
  const bounds = circle_svg.value.parentElement.getBBox();
  gsap.set(circle_svg.value, {
    svgOrigin: (bounds.x + bounds.width / 2) + " " + (bounds.y + bounds.height / 2)
  });
  gsap.registerPlugin(Draggable)
  const drag = ref(Draggable.create([circle_svg.value], {
    type: "rotation",
    liveSnap: {
      rotation: function (value) {
        //snap to the closest increment of 10.
        return Math.round(value / 30) * 30;
      },
    },
    onDragEnd: function (event) {
      let transformString = circle_svg.value.getAttribute('transform')
      let matrixValues = transformString.match(/matrix\((.*),(.*),(.*),(.*),(.*),(.*)\)/);
      let a = parseFloat(matrixValues[1]);
      let b = parseFloat(matrixValues[2]);
      let angle = Math.atan2(b, a);
      let angleInDegrees = angle * (180 / Math.PI);
      console.log(angleInDegrees);
    },
  }))
})
</script>

<style scoped lang="sass">
circle
  cursor: pointer
</style>