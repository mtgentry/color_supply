
export const favorite = async (palette) => {
  const { status } = useAuth()
  const dialogStore = useDialogStore()
  const { loginFavorite } = storeToRefs(dialogStore)
  // The heart flips at once; the shared favorites list (the Recent / Favorites
  // sidebar) changes once the server confirms, and the heart flips back if it fails
  const favoritePost = async (id) => {
    const colorStore = useColorStore()
    const adding = !palette.favorite
    const flip = (on) => {
      palette.favorite = on
      palette.favorite_count = Math.max(0, (palette.favorite_count || 0) + (on ? 1 : -1))
    }
    flip(adding)
    try {
      if (adding) {
        await fetch(`favorites/`, 'post', { palette: id })
        colorStore.addFavorite(palette)
        trackEvent('Palette Favorited', { palette_id: id })
      } else {
        await fetch(`favorites/${id}/`, 'delete')
        colorStore.removeFavorite(palette)
        trackEvent('Palette Unfavorited', { palette_id: id })
      }
    } catch (error) {
      if (adding && error?.status === 400) {
        // Already one of their favorites (this page's heart was out of date): it is one, just not counted twice
        palette.favorite_count = Math.max(0, palette.favorite_count - 1)
        colorStore.addFavorite(palette)
        return
      }
      flip(!adding)
      // Not useSnackbar(): it needs a component's setup, and this runs after an await in a click
      // handler, where it threw "No Snackbar provided!" and the alert never showed.
      // vue3-snackbar also registers itself globally, which works from anywhere.
      useNuxtApp().vueApp.config.globalProperties.$snackbar?.add({
        type: 'error',
        text: adding ? 'The palette could not be saved to your favorites' : 'The palette could not be removed from your favorites'
      })
    }
  }

  const favoriteClick = async (id) => {
    if (status.value === 'unauthenticated') {
      const was_logged = useCookie('was_logged')
      dialogStore.changeSource('favorite')
      loginFavorite.value = palette
      if (was_logged.value) {
        dialogStore.changeLoginForm(true)
        return
      } else {
        dialogStore.changeSignUpForm(true)
        return
      }
    }
    loginFavorite.value = null
    await favoritePost(palette.id)
  }
  return await favoriteClick(palette.id)
}