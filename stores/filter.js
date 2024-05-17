import { defineStore } from 'pinia'
export const useFilterStore = defineStore('filter', () =>{
  const mode = ref('illustration')
  const style = ref(['all'])
  const qty = ref([2, 10])
  const harmony = ref()
  const preview = ref(0)

  const changeFilter = (ref, value) => {
    ref.value = value
  }

  return {
    mode,
    style,
    qty,
    harmony,
    preview,
    changeFilter
  }
})