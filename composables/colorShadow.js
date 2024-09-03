import { hexToHSL } from '~/composables/hexToHSL'
export const colorShadow = (rgb) => {
  function rgbStringToArray(rgbString) {
    // Use a regular expression to match the numbers inside the string
    const result = rgbString.match(/\d+/g);
    // Convert the result to an array of numbers
    return result ? result.map(Number) : [];
}
  function rgbToHex(rgb) {
    return "#" + ((1 << 24) + (rgb[0] << 16) + (rgb[1] << 8) + rgb[2]).toString(16).slice(1).toUpperCase();
  }
  const { h, s, l } = hexToHSL(rgbToHex(rgbStringToArray(rgb)))
  return `hsl(${h}, 10%, 85%)`
}