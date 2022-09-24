export const minValue = 0;
export const maxValue = 200;
export const constrain = x => Math.min(maxValue, Math.max(minValue, x));
export const constrainDx = (dx, x) => constrain(x + dx) - x;
