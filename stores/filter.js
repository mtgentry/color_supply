import { defineStore } from 'pinia'
export const useFilterStore = defineStore('filter', () =>{
  const mode = ref('illustration')
  const style = ref(['all'])
  const qty = ref([2, 5])
  const harmonies = ref(['complementary', 'split-complementary', 'analogous', 'triad', 'square'])
  const harmony = ref('complementary')
  const preview = ref(2)
  const colors = ref([])
  const wheel_color = ref('#F03872')
  const colorTab = ref('color')
  const showPreviews = ref(false)

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
    showPreviews
  }
})