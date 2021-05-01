export const getTransformStyles = (
  x: number,
  y: number,
  scale: number,
  unit: "%" | "px" = "px",
): { webkitTransform: string; transform: string } => {
  return {
    webkitTransform: `translate(${x}${unit}, ${y}${unit}) scale(${scale})`,
    transform: `translate3d(${x}${unit}, ${y}${unit}, 0) scale(${scale})`,
  };
};
