export const wifiOptions = [null, "Coffee Shop", "Home Network", "Other"];
export const optionsWidth = 150;
export const optionsMargin = 4; // .25rem * 16px/rem
const ordinaryWidth = 88; // 5.5rem * 16px/rem (includes margin of .25 each side)

export const getLeftSide = nOptions =>
  -(nOptions - 1) * (optionsWidth + optionsMargin * 2);
export const getOptionIdx = (offset, nOptions) => {
  const initPos =
    (nOptions - 1) * (optionsWidth + 2 * optionsMargin) + 0.5 * ordinaryWidth;
  const currPos = initPos + offset;
  const idx = Math.floor(currPos / (2 * optionsMargin + optionsWidth));
  return Math.min(nOptions - 1, Math.max(0, idx));
};
