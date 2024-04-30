import { defineStore } from 'pinia'
export const useColorStore = defineStore('color', () =>{
  const selectedColor = ref(null)
  const colors = ref({
    colors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#1A1A1A']
  })
  const palette = ref()
  const selectColor = (index) => {
    selectedColor.value = index
  }
  const updateSelectedColor = (color) => {
    colors.value[selectedColor.value] = color
  }

  const selectPalette = (new_palette) => {
    palette.value = new_palette
  }

  return {
    selectedColor,
    selectColor,
    colors,
    updateSelectedColor,
    palette,
    selectPalette
  }
})