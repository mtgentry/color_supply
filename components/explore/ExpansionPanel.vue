<template lang="pug">
  v-expansion-panel(elevation="0")
    v-expansion-panel-title
      template(v-slot:default="{ expanded }")
        slot(name="title")
          div {{ title }}
      template(v-slot:actions="{ expanded }")
        img(:src="expanded ? '/img/icons/carat_open.svg' : '/img/icons/carat_closed.svg'")
    v-expansion-panel-text
      slot
</template>

<script setup>
const props = defineProps({
  title: String
})
</script>

<style scoped lang="sass">
:deep(.v-expansion-panel-text__wrapper)
  padding: 8px!important

.v-input--density-default
  --v-input-control-height: 25px
  --v-input-padding-top: 0px

:deep(.v-expansion-panel-title--active)
  min-height: unset!important

:deep(.v-expansion-panel-title)
  color: var(--color3)
  font-size: 12px
  font-style: normal
  font-weight: 700
  line-height: 136.5%
  letter-spacing: 0.6px
  text-transform: uppercase

:deep(.v-expansion-panel-title__overlay)
  background-color: unset
</style>