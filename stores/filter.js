import { defineStore } from 'pinia'
export const useFilterStore = defineStore('filter', () =>{
  const mode = ref('illustration')
  const style = ref(['all'])
  const qty = ref([2, 5])
  const harmonies = ref(['complementary', 'split-complementary', 'analogous', 'triad', 'square'])
  const harmony = ref('complementary')
  const preview = ref(2)
  const previousPreview = ref(0)
  const colors = ref([])
  const wheel_color = ref('#F15957')
  const colorTab = ref('color')
  const showPreviews = ref(false)
  // true after the user closes the preview with its X: clicking palettes then won't reopen it,
  // only the open icon (PreviewOpen) does. Closing it automatically (filter changes) doesn't set this.
  const previewDismissed = ref(false)

  const changeFilter = (ref, value) => {
    ref.value = value
  }
  const toggleColor = (value) => {
    const index = colors.value.indexOf(value)
    let newColors
    if (index === -1) {
      newColors = [...colors.value, value]
    } else {
      newColors = colors.value.filter((color) => color !== value)
    }
    colors.value = newColors
  }

  // "Palettes Filtered": which filters people use on /palettes. Sent 1s after the
  // last change, so dragging the QTY slider or ticking several styles is one event.
  let filterTimer = null
  watch([style, qty, colors, harmony, colorTab, wheel_color], () => {
    clearTimeout(filterTimer)
    filterTimer = setTimeout(() => {
      trackEvent('Palettes Filtered', {
        style: style.value.join(', '),
        qty_min: qty.value[0],
        qty_max: qty.value[1],
        color_tab: colorTab.value,
        // The Color tab filters by picked colors; Wheel and List by a harmony (Wheel around one color)
        colors: colorTab.value === 'color' ? colors.value.length : null,
        harmony: colorTab.value === 'color' ? null : harmony.value,
      })
    }, 1000)
  }, { deep: true })

  return {
    mode,
    style,
    qty,
    harmony,
    preview,
    changeFilter,
    toggleColor,
    colors,
    harmonies,
    wheel_color,
    colorTab,
    showPreviews,
    previousPreview,
    previewDismissed
  }
})