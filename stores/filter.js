import { defineStore } from 'pinia'
export const useFilterStore = defineStore('filter', () =>{
  const mode = ref('illustration')
  const style = ref([])
  const qty = ref([2, 4])
  const harmony = ref()

  const changeFilter = (ref, value) => {
    debugger
    ref.value = value
  }


  return {
    mode,
    style,
    qty,
    harmony,
    changeFilter
  }
})