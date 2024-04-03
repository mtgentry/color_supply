<template lang="pug">
  v-expansion-panels(multiple static variant="accordion")
    v-expansion-panel(title="Mode" expand-icon="mdi-chevron-right" collapse-icon="mdi-chevron-down" elevation="0")
      template(v-slot:text)
        v-radio-group(v-model="mode")
          v-radio(v-for="m in modes" :key="m" :label="m" :value="m")
    v-expansion-panel(title="Style" expand-icon="mdi-chevron-right" collapse-icon="mdi-chevron-down" elevation="0")
      template(v-slot:text)
        v-checkbox(v-for="t in styles" :key="t" :label="t" :value="t" hide-details true-icon="mdi-close-box-outline")
    v-expansion-panel(title="QTY" expand-icon="mdi-chevron-right" collapse-icon="mdi-chevron-down" elevation="0")
      template(v-slot:text)
        v-range-slider(:max="7" :min="1" :step="1" thumb-label="always" show-ticks="always")
    v-expansion-panel(title="Harmony" expand-icon="mdi-chevron-right" collapse-icon="mdi-chevron-down" elevation="0")
      template(v-slot:text)
        ExploreHarmony
    v-expansion-panel(title="Color Picker" expand-icon="mdi-chevron-right" collapse-icon="mdi-chevron-down" elevation="0")
      template(v-slot:text)
        v-color-picker(hide-inputs width="100%" elevation="0" )
    v-expansion-panel(title="Preview" expand-icon="mdi-chevron-right" collapse-icon="mdi-chevron-down" elevation="0")
      template(v-slot:text)
</template>

<script setup>
const mode = ref('Illustration')
const modes = ['Illustration', 'Brand', 'UI', 'Visual Design']
const stype = ref('Flat')
const styles = ['Flat', 'Gradient', '3D', 'Realism']
</script>

<style scoped lang="sass">
:deep(.v-expansion-panel-text__wrapper)
  padding: 8px!important
.v-input--density-default
  --v-input-control-height: 25px
  --v-input-padding-top: 0px

:deep(.v-slider-thumb__label)
    top: calc(var(--v-slider-thumb-size) * 1.4)!important
:deep(.v-slider-thumb__label::before)
  border-left: 6px solid transparent!important
  border-right: 6px solid transparent!important
  border-bottom: 6px solid currentColor!important
  border-top: 0!important
  top: -6px!important

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

:deep(.mdi-radiobox-marked), :deep(.mdi-close-box-outline)
  color: var(--color1)

:deep(.mdi-radiobox-blank), :deep(.mdi-checkbox-blank-outline), :deep(.mdi-chevron-down), :deep(.mdi-chevron-right)
  color: var(--color3)

:deep(.v-label)
  color: var(--color3)
  font-size: 14px
  font-style: normal
  font-weight: 400
  line-height: normal
  letter-spacing: 0.28px
</style>