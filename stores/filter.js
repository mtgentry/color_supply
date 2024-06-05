import { defineStore } from 'pinia'
export const useFilterStore = defineStore('filter', () =>{
  const mode = ref('illustration')
  const style = ref(['all'])
  const qty = ref([2, 10])
  const harmony = ref()
  const preview = ref(0)
  const colors = ref([])

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
    colors
  }
})