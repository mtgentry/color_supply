import { defineStore } from 'pinia'
export const useFilterStore = defineStore('filter', () =>{
  const mode = ref('illustration')
  const style = ref(['all'])
  const qty = ref([2, 10])
  const harmonies = ref(['complimentary', 'split-complimentary', 'analogous', 'triad', 'square'])
  const harmony = ref('complimentary')
  const preview = ref(0)
  const colors = ref([])
  const wheel_color = ref('#CC3333')
  const colorTab = ref('color')

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
    colorTab
  }
})