<template lang="pug">
  v-expansion-panels#panels(multiple static variant="accordion")
    ExploreExpansionPanel(title="Mode")
      v-radio-group(v-model="mode")
        div(v-for="m in modes" :key="m")
          v-radio(:key="m" :label="m" :value="m" v-model="mode")
          v-divider(v-if="m !== modes[modes.length - 1]")
    ExploreExpansionPanel(title="Style")
      div(v-for="t in styles" :key="t")
        v-checkbox(v-model="selectedStyle"  :label="t" :value="t" hide-details true-icon="mdi-close-box-outline")
        v-divider(v-if="t !== styles[styles.length - 1]")
    ExploreExpansionPanel(title="QTY")
      v-range-slider(:max="7" :min="1" :step="1" thumb-label="always" show-ticks="always")
    ExploreExpansionPanel(title="Harmony")
      ExploreHarmony
    //ExploreExpansionPanel(title="Color Picker")
    //  v-color-picker(hide-inputs width="100%" elevation="0" )
    ExploreExpansionPanel(title="Preview")
</template>

<script setup>
const mode = ref('Illustration')
const modes = ['Illustration', 'Brand', 'UI', 'Visual Design']
const selectedStyle = ref([])
const styles = ['Fresh', 'Manga', 'Nature', 'Painters', 'Rich']
</script>

<style scoped lang="sass">

:deep(.v-slider-thumb__label)
    top: calc(var(--v-slider-thumb-size) * 1.4)!important
:deep(.v-slider-thumb__label::before)
  border-left: 6px solid transparent!important
  border-right: 6px solid transparent!important
  border-bottom: 6px solid currentColor!important
  border-top: 0!important
  top: -6px!important

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

:deep(.v-expansion-panel-text__wrapper)
  padding: 0!important

#panels
  width: 300px

.v-input--density-default
  --v-input-control-height: 40px
</style>