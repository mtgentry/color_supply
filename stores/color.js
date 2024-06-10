import { defineStore } from 'pinia'
export const useColorStore = defineStore('color', () =>{
  const selectedColor = ref(null)
  const colors = ref({
    colors: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#1A1A1A']
  })
  const palette = ref()
  const palettes = ref([])
  const info = ref(false)
  const selectColor = (index) => {
    selectedColor.value = index
  }
  const updateSelectedColor = (color) => {
    colors.value[selectedColor.value] = color
  }

  const selectPalette = (new_palette) => {
    palette.value = new_palette
  }

  const selectRandomPalette = () => {
    const randomIndex = Math.floor(Math.random() * palettes.value.length)
    palette.value = palettes.value[randomIndex]
  }

  const toggleInfo = () => {
    info.value = !info.value
  }

  return {
    selectedColor,
    selectColor,
    colors,
    updateSelectedColor,
    palette,
    selectPalette,
    palettes,
    selectRandomPalette,
    info,
    toggleInfo
  }
})