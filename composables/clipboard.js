
export const clipboard = async (text, snackbar) => {
  try {
    snackbar.clear()
    await navigator.clipboard.writeText(text)
    snackbar.add({
      type: 'info',
      text: 'Copied to clipboard.',
      duration: 1000,
    })
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}