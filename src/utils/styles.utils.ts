export const getTransformStyles = (
  x: number,
  y: number,
  scale: number,
): string => {
  return `translate3d(${x}px, ${y}px, 0) scale(${scale})`;
};

export const getCenteredTransformStyles = (
  initialPositionX: number | undefined,
  initialPositionY: number | undefined,
  scale: number,
  wrapperComponent: HTMLDivElement,
  contentComponent: HTMLDivElement,
): {
  transform: string;
  positionsState: { positionX: number; positionY: number };
} => {
  const { centerPositionX, centerPositionY } = getCenterPosition(
    wrapperComponent,
    contentComponent,
  );

  const x = initialPositionX ?? centerPositionX;
  const y = initialPositionY ?? centerPositionY;

  return {
    transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
    positionsState: { positionX: x, positionY: y },
  };
};

export const getCenterPosition = (
  wrapperComponent: HTMLDivElement,
  contentComponent: HTMLDivElement,
): { centerPositionX: number; centerPositionY: number } => {
  const wrapperRect = wrapperComponent.getBoundingClientRect();
  const contentRect = contentComponent.getBoundingClientRect();

  const centerPositionX = (wrapperRect.width - contentRect.width) / 2;
  const centerPositionY = (wrapperRect.height - contentRect.height) / 2;

  return { centerPositionX, centerPositionY };
};
