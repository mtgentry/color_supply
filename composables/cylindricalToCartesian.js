import {hexToHsv} from "~/composables/hexToHsv.js";

export const cylindricalToCartesian = (hex) => {
  const hsv = hexToHsv(hex)
  const theta = hsv[0]
  const radius = hsv[1]
  const z = hsv[2]

  const thetaRadian = (theta * Math.PI) / 180;

  const x = radius * Math.cos(thetaRadian);
  const y = radius * Math.sin(thetaRadian);

  return [x, y, z];
}