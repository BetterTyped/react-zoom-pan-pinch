import { StateType } from "models";

export const getTransformStyles = (
  x: number,
  y: number,
  scale: number,
): string => {
  return `matrix(${scale}, 0,0, ${scale}, ${x}, ${y})`;
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
