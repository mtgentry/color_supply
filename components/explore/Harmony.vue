<template lang="pug">
  div.relative
    img(src="/img/harmony.svg" alt="Harmony" width="100%")
    .dots
      .dot(v-for="(position, index) in positions"
        :key="index" :style="{ left: `${position.x}px`, top: `${position.y}px`, visibility: visible.includes(index) ? 'visible' : 'hidden' }"
        ref="dot"
        @click="visible.includes(index) ? visible.splice(visible.indexOf(index), 1) : visible.push(index)"
        )
  v-carousel(hide-delimiters height="50px" )
    v-carousel-item(v-for="h in harmonies" :key="h")
      div.centered.h-100 {{ capitalized(h) }}

</template>

<script setup>
const harmonies = ['complimentary', 'split-complimentary', 'analogous', 'triad', 'square']
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
  width: 216px
  height: 216px

</style>