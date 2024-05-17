<template lang="pug">
  v-container#paletteResults(fluid)
    v-row
      v-col(md="12" v-for='(palette, index) in palettes' :key='index')
        ColorsDisplay(:palette='palette')
</template>

<script setup>
const colorStore = useColorStore()
const next = ref('palettes/list/')
const palettes = ref([])

const response = await fetch(next.value, 'get')
palettes.value = [...palettes.value, ...response.results]
if (!colorStore.palette) {
  colorStore.selectPalette(palettes.value[0])
}
</script>

<style scoped lang="sass">
</style>