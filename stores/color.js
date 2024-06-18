import { defineStore } from 'pinia'
export const useColorStore = defineStore('color', () =>{
  const selectedColor = ref(null)
  const palette = ref()
  const palettes = ref([])
  const info = ref(false)
  const selectColor = (index) => {
    selectedColor.value = index
  }
  const updateSelectedColor = (color) => {
    palette.value.colors[selectedColor.value] = color
  }

  const selectPalette = (new_palette) => {
    palette.value = new_palette
  }

  const shufflePalette = () => {
    let oldArray = [...palette.value.colors]
    let newArray

    do {
      newArray = [...palette.value.colors]
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
    } while (JSON.stringify(newArray) === JSON.stringify(oldArray))

    palette.value.colors = newArray
  };

  const toggleInfo = () => {
    info.value = !info.value
  }

  return {
    selectedColor,
    selectColor,
    updateSelectedColor,
    palette,
    selectPalette,
    palettes,
    shufflePalette,
    info,
    toggleInfo
  }
})