<template lang="pug">
  WheelPage
</template>

<script setup>
// Test version of /wheel: the same page, but every slice's palettes come from
// the database, all in one request (GET palettes/wheel/), so curation edits,
// hides and deletes show here. Once it's right, /wheel switches over.
import WheelPage from '~/pages/wheel.vue'

const wheelStore = useWheelStore()
wheelStore.fromDb = true
wheelStore.paletteIndex = 0
onBeforeUnmount(() => {
  wheelStore.fromDb = false
  wheelStore.paletteIndex = 0
})
</script>
