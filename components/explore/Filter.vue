<template lang="pug">
  v-expansion-panels#panels(static variant="accordion" v-model="activePanel" multiple)
    //ExploreExpansionPanel(title="Mode")
    //  v-radio-group(v-model="mode" hide-details)
    //    div(v-for="m in modes" :key="m")
    //      v-radio.px-5(:key="m" :label="m.title" :value="m.value" v-model="mode")
    //      v-divider(v-if="m !== modes[modes.length - 1]")
    ExploreExpansionPanel(title="Style")
      div(v-for="t in styles" :key="t")
        v-checkbox(v-model="style"  :label="t.title" :value="t.value" hide-details true-icon="mdi-close-box-outline" density="compact" )
        v-divider(v-if="t !== styles[styles.length - 1]")
    ExploreExpansionPanel#slider(title="QTY")
      v-range-slider.pb-5.pl-2(:min="2" :max="5" v-model="qtyLocal" :step="1" @end="changeQty"
        thumb-label="always" show-ticks="always" width="140px"
        hide-details :disabled="colorTab !== 'color'")
    ExploreExpansionPanel#harmony(title="Color" eager)
      ExploreColor
</template>

<script setup>
const filterStore = useFilterStore()
const { mode, style, qty, colorTab } = storeToRefs(filterStore)
const activePanel = ref([0, 1, 2, 3, 4])
const qtyLocal = ref(qty.value)

const modes = [
  { value: 'illustration', title: 'Illustration'},
  { value: 'brand', title: 'Brand'},
  { value: 'ui', title: 'UI'},
  { value: 'visual_design', title: 'Visual Design'},
  { value: '', title: 'Other' },
]
const styles = [
  { value: 'all', title: 'All'},
  { value: 'fresh', title: 'Fresh'},
  { value: 'manga', title: 'Manga'},
  { value: 'nature', title: 'Nature'},
  { value: 'painters', title: 'Painters'},
  { value: 'rich', title: 'Rich'},
  { value: '', title: 'Other' },
]

const changeQty = value => {
  // make the qty slider only execute when user releases the click
  filterStore.changeFilter(qty, value)
}

watch(style, (value, oldValue) => {
  if (value.length === 0) {
    filterStore.changeFilter(style, ['all'])
  }
  else if (value.length === 1 && value[0] === 'all') {}
  else if (oldValue.length === 1 && oldValue[0] === 'all') {
    value = value.filter(v => v !== 'all')
    filterStore.changeFilter(style, value)
  }
  else if (value.includes('all')) {
    filterStore.changeFilter(style, ['all'])
  }
}, { deep: true })
</script>

<style scoped lang="sass">
#panels
  padding-left: 10px

:deep(.v-expansion-panel-title)
  padding: 16px 24px 16px 0
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

:deep(.v-selection-control__input)
  //width: 0px !important
  justify-content: start

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
  --v-slider-track-size: 5px!important
  --v-slider-tick-size: 5px !important

:deep(.v-slider-thumb__label)
  color: var(--color2)!important
  background: none!important
  top: 22px!important

//.v-window-item
//  min-height: 20px

#slider

  :deep(.v-expansion-panel-text)
    min-height: 70px

  :deep(.v-slider.v-input--horizontal)
    margin-inline: unset
:deep(.v-tabs)
  position: absolute
  top: 11px
  left: 75px
  z-index: 1
:deep(.v-tabs--density-default)
  --v-tabs-height: 24px

#harmony
  position: relative

  :deep(.v-expansion-panel-text)
    margin-left: -10px

#panels
  @media (min-width: 2568px)
    padding-left: 24px
</style>