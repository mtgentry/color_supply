import { defineStore } from 'pinia'
export const useColorStore = defineStore('color', () =>{
  const selectedColor = ref(null)
  const palette = ref()
  const palettes = ref([])
  const info = ref(false)
  const hue = ref(179)
  const saturation = ref(0)
  const lightness = ref(0)
  // const createColors = ref(['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#1A1A1A'])
  const createColors = ref([])
  const modifiedColors = ref([])
  const boxColors = ref([])
  const selectColor = (index) => {
    if (!index && selectedColor.value !== null) {
      fixSelectedColorHue(selectedColor.value)
    }
    selectedColor.value = index
  }
  const updateSelectedColor = (color) => {
    createColors.value[selectedColor.value] = color
  }

  const fixSelectedColorHue = (index) => {
    hue.value = 179
    saturation.value = 0
    lightness.value = 0
    modifiedColors.value = [...createColors.value]
  }

  const selectPalette = (new_palette) => {
    palette.value = new_palette
  }

  const shufflePalette = () => {
    let oldArray = [...boxColors.value]
    let newArray

    do {
      newArray = [...boxColors.value]
      for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
      }
    } while (JSON.stringify(newArray) === JSON.stringify(oldArray))

    boxColors.value = newArray
  };
  const hueDiff = computed(() => {
    return hue.value - 179
  })

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
    toggleInfo,
    hue,
    saturation,
    lightness,
    hueDiff,
    createColors,
    fixSelectedColorHue,
    boxColors,
    modifiedColors
  }
})