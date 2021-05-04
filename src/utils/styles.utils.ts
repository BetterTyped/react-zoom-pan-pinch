export const getTransformStyles = (
  x: number,
  y: number,
  scale: number,
  unit: "%" | "px" = "px",
): string => {
  return `translate3d(${x}${unit}, ${y}${unit}, 0) scale(${scale})`;
};
