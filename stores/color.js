import { defineStore } from 'pinia'
export const useColorStore = defineStore('plan', () =>{
  const selectedColor = ref(null)
  const colors = ref(['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#FF00FF'])
  const selectColor = (color) => {
    selectedColor.value = color
  }

  return {
    selectedColor,
    selectColor,
    colors
  }
})