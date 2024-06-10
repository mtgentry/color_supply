
export const clipboard = async (text, snackbar) => {
  try {
    await navigator.clipboard.writeText(text)
    snackbar.add({
      type: 'success',
      text: 'Copied to clipboard.',
    })
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}