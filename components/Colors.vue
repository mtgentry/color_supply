<template lang="pug">
  #draggable
    transition
      div.delete.centered(v-if="dragging")
        v-icon(color="white" size="large") mdi-delete
    draggable(:list="colors" v-bind="dragOptions" @start="dragStart" @end="dragEnd" @change="change" :item-key="item => item")
      template(#item="{element}")
        div.drag-item
          EditorColor(:key="element" :color="element" :dragging="dragging" :class="{ 'color-hover': !dragging }")
    v-tooltip(text="Revert" location="bottom")
      template(v-slot:activator="{ props }")
        v-icon#undo(v-bind="props" v-show="preDeletionColors.length" @click="revertDelete") mdi-undo
</template>

<script setup>
import draggable from 'vuedraggable'
const colors = ref(['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF'])
const dragOptions = {
  ghostClass: 'ghost',
  animation: 300,
}
const preDeletionColors = ref([])
const dragging = ref(false)
const startOrder = ref()

const storeHistory = () => {
  if (preDeletionColors.value.length > 10) {
    preDeletionColors.value.shift()
  }
  preDeletionColors.value.push([...startOrder.value])
}
const dragStart = (event) => {
  startOrder.value = [...colors.value]
  dragging.value = true
}
const dragEnd = (event) => {
  dragging.value = false
  if (event.originalEvent.offsetY < 0) {
    colors.value.splice(event.newIndex, 1)
    storeHistory()
  }
}

const change = (event) => {
  if (startOrder.value !== colors.value) {
    storeHistory()
  }
}

const revertDelete = () => {
  colors.value = [...preDeletionColors.value[preDeletionColors.value.length - 1]]
  preDeletionColors.value.pop()
}
</script>

<style scoped lang="sass">
$transition-time: 0.8s

#draggable
  position: absolute

  div
    display: flex

.drag-item
  margin: 150px 0
  z-index: 2
  position: relative

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

.delete
  background-color: red
  position: absolute
  top: 0
  left: 0
  height: 50px
  z-index: 0
  width: 100%
  opacity: 0.8

.v-enter-active,
.v-leave-active
  transition: opacity $transition-time ease

.v-enter-from,
.v-leave-to
  opacity: 0

#undo
  position: absolute
  bottom: 120px
  cursor: pointer
</style>