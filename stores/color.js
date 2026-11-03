import { defineStore } from 'pinia'
export const useColorStore = defineStore('color', () =>{
  const palettes = ref([])
  const info = ref(false)

  // whether the palette grid should outline (and scroll to) the selected palette.
  // Filter changes turn it off so the old selection isn't re-highlighted in new results,
  // without clearing `palette`, which Visualize also uses.
  const paletteHighlighted = ref(true)
  const clearPaletteHighlight = () => {
    paletteHighlighted.value = false
  }

  const selectPalette = (new_palette) => {
    palette.value = new_palette
    paletteHighlighted.value = true
  }

  const shufflePalette = () => {
    if (boxColors.value.length < 2) return
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
  const toggleInfo = () => {
    info.value = !info.value
  }
  const recentPalettes = ref(JSON.parse(localStorage.getItem('recentPalettes')) || [])
  const addRecentPalette = (color) => {
    if (recentPalettes.value.includes(color)) {
      // move color to the front
      recentPalettes.value = recentPalettes.value.filter(c => c !== color)
    }
    recentPalettes.value = [color, ...recentPalettes.value].slice(0, 20)
    localStorage.setItem('recentPalettes', JSON.stringify(recentPalettes.value))
  }
  const palette = ref(recentPalettes.value[0] || {})
  const boxColors = ref(recentPalettes.value[0]?.colors || [])
  const unfavoritePalettes = () => {
    palettes.value.forEach(palette => palette.favorite = false)
  }
  return {
    palette,
    selectPalette,
    paletteHighlighted,
    clearPaletteHighlight,
    palettes,
    shufflePalette,
    info,
    toggleInfo,
    boxColors,
    recentPalettes,
    addRecentPalette,
    unfavoritePalettes
  }
})