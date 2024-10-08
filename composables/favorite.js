
export const favorite = async (palette) => {
  const { status } = useAuth()
  const dialogStore = useDialogStore()
  const { loginFavorite } = storeToRefs(dialogStore)
  const favoritePost = async (id) => {
    if (palette.favorite) {
      palette.favorite_count -= 1
      palette.favorite = !palette.favorite
      await fetch(`favorites/${id}/`,  'delete')
    } else {
      palette.favorite_count += 1
      palette.favorite = !palette.favorite
      await fetch(`favorites/`, 'post', {
        palette: id
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