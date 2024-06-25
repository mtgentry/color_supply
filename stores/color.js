import { defineStore } from 'pinia'
export const useColorStore = defineStore('color', () =>{
  const selectedColor = ref(null)
  const palette = ref()
  const palettes = ref([])
  const info = ref(false)
  const hue = ref(179)
  const saturation = ref(50)
  const createColors = ref(['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#00FFFF', '#1A1A1A'])
  // const createColors = ref(['#FF0000', ])
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
    if (palette.value.colors[index] === createColors.value[index]) return
    let hsl = hexToHSL(createColors.value[index])
    let h = (hsl.h - hueDiff.value) % 360
    if (h < 0) h += 360
    palette.value.colors[index] = HSLToHex(
      h,
      hsl.s,
      hsl.l
    )
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
  const saturationDiff = computed(() => {
    return saturation.value - 50
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
    hueDiff,
    saturationDiff,
    createColors,
    fixSelectedColorHue,
    boxColors
  }
})