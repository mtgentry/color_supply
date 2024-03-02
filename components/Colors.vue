<template lang="pug">
  #draggable
    draggable(:list="colors" tag="transition-group" v-bind="dragOptions" @start="dragStart" @end="dragEnd"
      :component-data="{ name: 'flip-list', type: 'transition' }")
      template(#item="{element}")
        div
          EditorColor(:key="element" :color="element" :dragging="dragging" :class="{'color-hover': !dragging}")

</template>

<script setup>
import draggable from 'vuedraggable'
const colors = ref(['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF'])
const dragOptions = {
  ghostClass: 'ghost',
  animation: 300
}
const dragging = ref(false)
const dragStart = (event) => {
  dragging.value = true
}
const dragEnd = (event) => {
  dragging.value = false
}

</script>

<style scoped lang="sass">
#draggable
  padding: 100px 0
  div
    display: inline-block

.ghost
  opacity: 0.1!important
  border: unset!important
  top: 0!important
  left: 0!important
  transition: none!important

  &::before, &::after, :deep(.top-right::before), :deep(.bottom-left::before)
    display: none!important

:deep(.flip-list-move)
  transition: transform 2s


:deep(.no-move)
  transition: transform 0s

</style>