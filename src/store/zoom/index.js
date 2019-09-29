import { roundNumber, calculateBoundingArea } from "../utils";
import {
  checkZoomBounds,
  getComponentsSizes,
  checkPositionBounds,
  getDelta,
  wheelMousePosition,
} from "./utils";

function handleCalculateZoom(delta, step) {
  const { scale, maxScale, minScale, zoomPadding, enablePaddingAnimation } = this.stateProvider;
  const targetScale = scale + step * delta * (scale / 100);
  const newScale = checkZoomBounds(
    roundNumber(targetScale, 2),
    minScale,
    maxScale,
    zoomPadding,
    enablePaddingAnimation
  );
  return newScale;
}

export function handleCalculateBounds(newScale, limitToWrapper) {
  const { wrapperComponent } = this.stateProvider;

  const {
    wrapperWidth,
    wrapperHeight,
    newContentWidth,
    newDiffWidth,
    newContentHeight,
    newDiffHeight,
  } = getComponentsSizes(wrapperComponent, newScale);

  const bounds = calculateBoundingArea(
    wrapperWidth,
    newContentWidth,
    newDiffWidth,
    wrapperHeight,
    newContentHeight,
    newDiffHeight,
    limitToWrapper
  );

  // Save bounds
  this.bounds = bounds;
  return bounds;
}

function handleCalculatePositions(mouseX, mouseY, newScale, bounds, limitToBounds) {
  const { scale, positionX, positionY, transformEnabled } = this.stateProvider;

  const scaleDifference = newScale - scale;

  if (typeof mouseX !== "number" || typeof mouseY !== "number")
    return console.error("Mouse X and Y position were not provided!");

  if (!transformEnabled) return { newPositionX: positionX, newPositionY: positionY };

  const calculatedPositionX = positionX - mouseX * scaleDifference;
  const calculatedPositionY = positionY - mouseY * scaleDifference;

  // do not limit to bounds when there is padding animation,
  // it causes animation strange behaviour

  const newPositions = checkPositionBounds(
    calculatedPositionX,
    calculatedPositionY,
    bounds,
    limitToBounds
  );

  return newPositions;
}

/**
 * Wheel zoom event
 */
export function handleWheelZoom(event) {
  const {
    isDown,
    zoomingEnabled,
    wheelStep,
    disabled,
    scale,
    contentComponent,
    limitToWrapperOnWheel,
    limitToBounds,
    enablePaddingAnimation,
    zoomPadding,
  } = this.stateProvider;
  if (isDown || !zoomingEnabled || disabled) return;

  event.preventDefault();
  event.stopPropagation();

  const delta = getDelta(event);
  const newScale = handleCalculateZoom.bind(this, delta, wheelStep)();

  if (scale === newScale) return;

  const bounds = handleCalculateBounds.bind(this, newScale, limitToWrapperOnWheel)();

  const { mouseX, mouseY } = wheelMousePosition(event, contentComponent, scale);

  const isLimitedToBounds = limitToBounds && (!enablePaddingAnimation || zoomPadding === 0);
  const { x, y } = handleCalculatePositions.bind(
    this,
    mouseX,
    mouseY,
    newScale,
    bounds,
    isLimitedToBounds
  )();

  this.stateProvider.scale = newScale;
  this.stateProvider.bounds = bounds;
  this.stateProvider.positionX = x;
  this.stateProvider.positionY = y;
}

/**
 * Button zoom events
 */
export function handleZoomToPoint(scale, mouseX, mouseY, event) {
  const {
    isDown,
    zoomingEnabled,
    disabled,
    minScale,
    maxScale,
    contentComponent,
    limitToBounds,
  } = this.stateProvider;
  if (isDown || !zoomingEnabled || disabled) return;

  const newScale = checkZoomBounds(roundNumber(scale, 2), minScale, maxScale, null);
  const bounds = handleCalculateBounds.bind(this, newScale, false)();

  let mousePosX = mouseX;
  let mousePosY = mouseY;

  // if event is present - use it's mouse position
  if (event) {
    const mousePosition = wheelMousePosition(event, contentComponent, scale);
    mousePosX = mousePosition.mouseX;
    mousePosY = mousePosition.mouseY;
  }
  console.log(mousePosX, mousePosY);

  const { x, y } = handleCalculatePositions.bind(
    this,
    mousePosX,
    mousePosY,
    newScale,
    bounds,
    limitToBounds
  )();

  return { scale: newScale, positionX: x, positionY: y };
}

export function handleDoubleClick(event) {
  event.preventDefault();
  event.stopPropagation();
}
