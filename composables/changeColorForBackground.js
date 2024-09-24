import { hexToHSL } from '~/composables/hexToHSL'

export const changeColorForBackground = (background) => {
  let hsl = hexToHSL(background)
  if (hsl.l > 0.5) {
    return 'black'
  } else {
    return '#ffffff'
  }
}