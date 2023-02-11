import { StateType } from "models";

export const getTransformStyles = (
  x: number,
  y: number,
  scale: number,
): string => {
  // Standard translate prevents blurry svg on the safari
  return `translate(${x}px, ${y}px) scale(${scale})`;
};

export const getMatrixTransformStyles = (
  x: number,
  y: number,
  scale: number,
): string => {
  // The shorthand for matrix does not work for Safari hence the need to explicitly use matrix3d
  // Refer to https://developer.mozilla.org/en-US/docs/Web/CSS/transform-function/matrix
  const a = scale;
  const b = 0;
  const c = 0;
  const d = scale;
  const tx = x;
  const ty = y;
  return `matrix3d(${a}, ${b}, 0, 0, ${c}, ${d}, 0, 0, 0, 0, 1, 0, ${tx}, ${ty}, 0, 1)`;
};

export const getCenterPosition = (
  scale: number,
  wrapperComponent: HTMLDivElement,
  contentComponent: HTMLDivElement,
): StateType => {
  const contentWidth = contentComponent.offsetWidth * scale;
  const contentHeight = contentComponent.offsetHeight * scale;

  const centerPositionX = (wrapperComponent.offsetWidth - contentWidth) / 2;
  const centerPositionY = (wrapperComponent.offsetHeight - contentHeight) / 2;

  return {
    scale,
    positionX: centerPositionX,
    positionY: centerPositionY,
  };
};
