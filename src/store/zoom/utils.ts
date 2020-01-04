import { boundLimiter, checkIsNumber } from "../utils";

export function checkZoomBounds(
  zoom,
  minScale,
  maxScale,
  zoomPadding,
  enablePadding,
) {
  const scalePadding = enablePadding ? zoomPadding : 0;
  const minScaleWithPadding = minScale - scalePadding;

  if (!isNaN(maxScale) && zoom >= maxScale) return maxScale;
  if (!isNaN(minScale) && zoom <= minScaleWithPadding)
    return minScaleWithPadding;
  return zoom;
}

export function checkPositionBounds(
  positionX,
  positionY,
  bounds,
  limitToBounds,
  paddingValue,
  wrapperComponent,
) {
  const { minPositionX, minPositionY, maxPositionX, maxPositionY } = bounds;
  const paddingX = wrapperComponent
    ? (paddingValue * wrapperComponent.offsetWidth) / 100
    : 0;
  const paddingY = wrapperComponent
    ? (paddingValue * wrapperComponent.offsetHeight) / 100
    : 0;

  const x = boundLimiter(
    positionX,
    minPositionX - paddingX,
    maxPositionX + paddingX,
    limitToBounds,
  );

  const y = boundLimiter(
    positionY,
    minPositionY - paddingY,
    maxPositionY + paddingY,
    limitToBounds,
  );
  return { x, y };
}

export function getDelta(event, customDelta) {
  const deltaY = event ? (event.deltaY < 0 ? 1 : -1) : 0;
  const delta = checkIsNumber(customDelta, deltaY);
  return delta;
}

export function wheelMousePosition(
  event,
  contentComponent,
  scale,
): { mouseX: number; mouseY: number } {
  const contentRect = contentComponent.getBoundingClientRect();

  // mouse position x, y over wrapper component
  const mouseX = (event.clientX - contentRect.left) / scale;
  const mouseY = (event.clientY - contentRect.top) / scale;

  if (isNaN(mouseX) || isNaN(mouseY))
    console.error("No mouse or touch offset found");

  return {
    mouseX,
    mouseY,
  };
}

export function getComponentsSizes(
  wrapperComponent,
  contentComponent,
  newScale,
) {
  const wrapperWidth = wrapperComponent.offsetWidth;
  const wrapperHeight = wrapperComponent.offsetHeight;

  const contentWidth = contentComponent.offsetWidth;
  const contentHeight = contentComponent.offsetHeight;

  const newContentWidth = contentWidth * newScale;
  const newContentHeight = contentHeight * newScale;
  const newDiffWidth = wrapperWidth - newContentWidth;
  const newDiffHeight = wrapperHeight - newContentHeight;

  return {
    wrapperWidth,
    wrapperHeight,
    newContentWidth,
    newDiffWidth,
    newContentHeight,
    newDiffHeight,
  };
}

export function handleCalculatePositions(
  mouseX,
  mouseY,
  newScale,
  bounds,
  limitToBounds,
) {
  const {
    scale,
    positionX,
    positionY,
    options: { transformEnabled },
  } = this.stateProvider;

  const scaleDifference = newScale - scale;

  if (typeof mouseX !== "number" || typeof mouseY !== "number")
    return console.error("Mouse X and Y position were not provided!");

  if (!transformEnabled)
    return { newPositionX: positionX, newPositionY: positionY };

  const calculatedPositionX = positionX - mouseX * scaleDifference;
  const calculatedPositionY = positionY - mouseY * scaleDifference;

  // do not limit to bounds when there is padding animation,
  // it causes animation strange behaviour

  const newPositions = checkPositionBounds(
    calculatedPositionX,
    calculatedPositionY,
    bounds,
    limitToBounds,
    0,
    null,
  );

  return newPositions;
}
