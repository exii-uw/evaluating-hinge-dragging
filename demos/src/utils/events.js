export const getTouchPos = e => {
  if (e.x && e.y) return { x: e.x, y: e.y };
  return {
    x: e.touches[0].clientX,
    y: e.touches[0].clientY,
  };
};
