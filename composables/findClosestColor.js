import {cylindricalToCartesian} from "~/composables/cylindricalToCartesian.js";

export const findClosestColor = (parent, colors) => {
  let closestColor = null;
  let closestDistance = Infinity;

  const targetCartesian = cylindricalToCartesian(parent);

  colors.forEach((color) => {
    const choiceCartesian = cylindricalToCartesian(color);
    const distance = Math.sqrt(
      Math.pow(targetCartesian[0] - choiceCartesian[0], 2) +
      Math.pow(targetCartesian[1] - choiceCartesian[1], 2) +
      Math.pow(targetCartesian[2] - choiceCartesian[2], 2)
    );

    if (distance < closestDistance) {
      closestDistance = distance;
      closestColor = color;
    }
  });

  return closestColor;
}