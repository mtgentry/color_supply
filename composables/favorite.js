
export const favorite = async (id) => {
  const { status } = useAuth()
  const dialogStore = useDialogStore()
  const colorStore = useColorStore()
  const { palettes } = storeToRefs(colorStore)
  const favoritePost = async (id) => {
    const palette = palettes.value.find(p => p.id === id)

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
      if (was_logged.value) {
        dialogStore.changeLoginForm(true)
        return
      } else {
        dialogStore.changeSignUpForm(true)
        return
      }
    }
    await favoritePost(id)
  }
  return await favoriteClick(id)
}