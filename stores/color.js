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
    // move it to the front (matched by id: the same palette can come from different lists as different objects)
    const same = (c) => c === color || (color?.id && c?.id === color.id)
    recentPalettes.value = [color, ...recentPalettes.value.filter(c => !same(c))].slice(0, 20)
    localStorage.setItem('recentPalettes', JSON.stringify(recentPalettes.value))
  }
  const palette = ref(recentPalettes.value[0] || {})
  const boxColors = ref(recentPalettes.value[0]?.colors || [])
  const unfavoritePalettes = () => {
    palettes.value.forEach(palette => palette.favorite = false)
    favoritePalettes.value = null
  }

  // The signed-in user's favorites, most recently favorited first: the first page
  // of palettes/list/?toggle=favorites, or null until loaded (and after logout).
  // A heart anywhere in the app updates it as soon as the server confirms
  // (addFavorite / removeFavorite), so lists showing it never need a reload;
  // loadFavorites() syncs it with the server again.
  const favoritePalettes = ref(null)
  let favoritesVersion = 0 // Bumped by every change, so a load that started before one is dropped
  const loadFavorites = async () => {
    const version = ++favoritesVersion
    const response = await fetch('palettes/list/', 'get', { toggle: 'favorites' }).catch(() => null)
    if (version !== favoritesVersion) {
      // A favorite changed while this was loading, so it may be out of date. Nothing is
      // shown yet, so load again (an already-shown list has the change applied to it).
      if (!favoritePalettes.value) return loadFavorites()
      return
    }
    if (response) favoritePalettes.value = response.results
    else if (!favoritePalettes.value) favoritePalettes.value = [] // Failed: an empty list, not an endless spinner
  }
  const addFavorite = (palette) => {
    if (!palette?.id) return
    favoritesVersion += 1
    if (!favoritePalettes.value) return // Not loaded yet: the first load will include it
    const index = favoritePalettes.value.findIndex(p => p.id === palette.id)
    if (index === -1) {
      favoritePalettes.value = [palette, ...favoritePalettes.value]
    } else {
      // Already a favorite (re-saving the same colors): stays where it is, as on the server
      favoritePalettes.value = favoritePalettes.value.map((p, i) => i === index ? palette : p)
    }
  }
  const removeFavorite = (palette) => {
    if (!palette?.id) return
    favoritesVersion += 1
    if (!favoritePalettes.value) return
    favoritePalettes.value = favoritePalettes.value.filter(p => p.id !== palette.id)
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
    unfavoritePalettes,
    favoritePalettes,
    loadFavorites,
    addFavorite,
    removeFavorite
  }
})