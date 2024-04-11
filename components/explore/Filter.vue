<template lang="pug">
  v-expansion-panels#panels(static variant="accordion")
    ExploreExpansionPanel(title="Mode")
      v-radio-group(v-model="mode" hide-details)
        div(v-for="m in modes" :key="m")
          v-radio.px-5(:key="m" :label="m" :value="m" v-model="mode")
          v-divider(v-if="m !== modes[modes.length - 1]")
    ExploreExpansionPanel(title="Style")
      div(v-for="t in styles" :key="t")
        v-checkbox.px-5(v-model="selectedStyle"  :label="t" :value="t" hide-details true-icon="mdi-close-box-outline")
        v-divider(v-if="t !== styles[styles.length - 1]")
    ExploreExpansionPanel#slider(title="QTY")
      v-range-slider.px-5.pb-5(:max="7" :min="2" v-model="qty" :step="1" thumb-label="always" show-ticks="always" hide-details)
    ExploreExpansionPanel(title="Harmony")
      ExploreHarmony.px-5
    //ExploreExpansionPanel(title="Color Picker")
    //  v-color-picker(hide-inputs width="100%" elevation="0" )
    ExploreExpansionPanel(title="Preview")
</template>

<script setup>
const mode = ref('Illustration')
const modes = ['Illustration', 'Brand', 'UI', 'Visual Design']
const selectedStyle = ref([])
const styles = ['Fresh', 'Manga', 'Nature', 'Painters', 'Rich']
const qty = ref([2,4])
</script>

<style scoped lang="sass">

:deep(.v-slider-thumb__label)
  top: calc(var(--v-slider-thumb-size) * 1.4)!important

:deep(.v-slider-thumb__label::before)
  border-left: 0px solid transparent!important
  border-right: 0px solid transparent!important
  border-bottom: 0px solid currentColor!important
  border-top: 0!important
  top: -0px!important

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

//#panels
//  width: 300px

.v-input--density-default
  --v-input-control-height: 40px

html
  --v-slider-track-size: 20px!important

:deep(.v-slider-thumb)
  color: var(--color1)!important
:deep(.v-slider-track__background)
  height: 1px!important
  background-color: var(--color3)!important
:deep(.v-slider-track__fill)
  height: 1px!important
  background-color: var(--color1)!important

:deep(.v-slider-track__tick)
  background-color: var(--color4)!important

:deep(.v-slider-track__tick--filled)
  background-color: var(--color1)!important
:deep(.v-slider-track)
  --v-slider-track-size: 4px!important
  --v-slider-tick-size: 4px !important

:deep(.v-slider-thumb__label)
  color: var(--color2)!important
  background: none!important
  top: 22px!important
</style>