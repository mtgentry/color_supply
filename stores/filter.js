import { defineStore } from 'pinia'
export const useFilterStore = defineStore('filter', () =>{
  const mode = ref('illustration')
  const style = ref(['all'])
  const qty = ref([2, 10])
  const harmony = ref()
  const preview = ref(0)
  const color = ref([])

  const changeFilter = (ref, value) => {
    ref.value = value
  }
  const toggleColor = (value) => {
    const index = color.value.indexOf(value)
    if (index === -1) {
      color.value.push(value)
    } else {
      color.value.splice(index, 1)
    }
  }

  return {
    mode,
    style,
    qty,
    harmony,
    preview,
    changeFilter,
    toggleColor,
    color
  }
})