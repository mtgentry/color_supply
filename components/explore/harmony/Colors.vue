<template lang="pug">
  v-container.pt-5
    v-row.py-1
      v-col(cols="3" v-for="(color, name) in colors")
        ExploreHarmonyColor(:key="color" :color="color" :title="name")

</template>

<script setup>
const colors = {
  'red': '#CC3333',
  'orange': '#E87E30',
  'yellow': '#F6D659',
  'green': '#339966',
  'blue': '#336699',
  'purple': '#663366',
  'pink': '#DC758C',
  'brown': '#9B836C',
  'black': '#000000',
  'gray': '#8C8C8C',
  'silver': '#C0C0C0',
  'white': '#FFFFFF',
}

</script>

<style scoped lang="sass">
#exploreColors
  display: flex
  flex-wrap: wrap

.v-col
  padding: 0 1px 24px 1px
</style>