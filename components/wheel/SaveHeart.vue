<template lang="pug">
  .save-heart(:class="{ saved: !!saved }")
    button(
      type="button"
      :title="saved ? 'Remove from your favorites' : 'Save this palette to your favorites'"
      :aria-label="saved ? 'Remove from your favorites' : 'Save this palette to your favorites'"
      :aria-pressed="!!saved"
      :disabled="saving"
      @click="toggle")
      IconsHeart(:stroke="saved ? 'var(--color9)' : 'var(--color3)'" :fill="saved ? 'var(--color9)' : 'transparent'")
</template>

<script setup>
// The heart under the selected wheel palette. Wheel palettes come from
// lib/wheel/schemes.json and aren't in the database, so this saves by colors
// (POST palettes/, the same endpoint as Mix's heart): the server creates the
// palette as the user's own, or returns the one they already have with those
// colors, and favorites it. Logged out, it opens the same sign up / log in
// dialog as the hearts elsewhere and saves once the user is in.
const props = defineProps({
  colors: { type: Array, required: true },
})

const { status } = useAuth()
const colorStore = useColorStore()
const dialogStore = useDialogStore()
const wheelStore = useWheelStore()
const snackbar = useSnackbar()

const saving = ref(false)
const colorKey = (hexes) => hexes.map((h) => h.toUpperCase()).join(',')

// Saved or removed on this page, by colors (null once removed): the favorites
// list only holds the first page, so this keeps the heart right after a click
const changedHere = ref({})

// The user's favorite palette with exactly these colors, if any
const saved = computed(() => {
  const key = colorKey(props.colors)
  if (key in changedHere.value) return changedHere.value[key]
  return (colorStore.favoritePalettes || []).find((p) => p.favorite !== false && colorKey(p.colors || []) === key) || null
})

const save = async (hexes) => {
  saving.value = true
  try {
    const palette = await fetch('palettes/', 'post', { colors: hexes })
    if (!palette?.id) throw new Error('No palette in the response')
    changedHere.value = { ...changedHere.value, [colorKey(hexes)]: palette }
    colorStore.addFavorite(palette) // Shows up in Favorites without a reload
    trackEvent('Palette Favorited', { palette_id: palette.id, from: 'wheel', scheme: wheelStore.scheme.name })
  } catch (error) {
    snackbar.add({ type: 'error', text: 'The palette could not be saved' })
  }
  saving.value = false
}

const unfavorite = async (palette) => {
  saving.value = true
  try {
    await fetch(`favorites/${palette.id}/`, 'delete')
    changedHere.value = { ...changedHere.value, [colorKey(palette.colors)]: null }
    colorStore.removeFavorite(palette)
    trackEvent('Palette Unfavorited', { palette_id: palette.id, from: 'wheel' })
  } catch (error) {
    snackbar.add({ type: 'error', text: 'The palette could not be removed' })
  }
  saving.value = false
}

let pendingSave = null // Colors to save once the user has signed up or logged in

const toggle = () => {
  if (saving.value || !props.colors.length) return
  if (status.value !== 'authenticated') {
    pendingSave = [...props.colors]
    dialogStore.loginFavorite = null // No palette in the database yet; saved by the watch below
    dialogStore.changeSource('favorite')
    if (useCookie('was_logged').value) dialogStore.changeLoginForm(true)
    else dialogStore.changeSignUpForm(true)
    return
  }
  if (saved.value) unfavorite(saved.value)
  else save([...props.colors])
}

// Know which wheel palettes are already favorites (the wheel page has no
// sidebar that would load them)
const loadFavorites = () => {
  if (status.value === 'authenticated' && !colorStore.favoritePalettes) colorStore.loadFavorites()
}
onMounted(loadFavorites)

watch(status, (value) => {
  if (value !== 'authenticated') return
  loadFavorites()
  if (pendingSave) {
    const hexes = pendingSave
    pendingSave = null
    save(hexes)
  }
})
</script>

<style scoped lang="sass">
.save-heart
  display: flex
  justify-content: flex-end
  margin-top: 1px

  button
    display: flex
    align-items: center
    justify-content: center
    width: 28px
    height: 28px
    margin-right: -6px // The icon, not the button's padding, lines up with the bar's right edge
    padding: 0
    border: none
    border-radius: 50%
    background: none
    cursor: pointer
    transition: transform 0.1s ease-in-out
    &:hover:not(:disabled)
      transform: scale(1.15)
    &:disabled
      cursor: default
      opacity: 0.6
    &:focus-visible
      outline: 2px solid var(--color1)
      outline-offset: 1px
</style>
