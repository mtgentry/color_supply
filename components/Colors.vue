<template lang="pug">
  draggable#draggable(:list="colors" v-bind="dragOptions")
    template(#item="{element}")
      EditorColor(:key="element" :color="element")

</template>

<script setup>
import draggable from 'vuedraggable'
const colors = ref(['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF'])
const dragOptions = {
  ghostClass: 'ghost'
}

</script>

<style scoped lang="sass">
#draggable
  div
    display: inline-block

:deep(.ghost)
  opacity: 0.1

</style>