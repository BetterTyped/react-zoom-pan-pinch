import { calculateTransformation, getComponentsSizes, checkZoomBounds } from "./_zoom";
import { getDistance, calculateBoundingArea } from "./utils";

function round(number, decimal) {
  const roundNumber = Math.pow(10, decimal);
  return Math.round(number * roundNumber) / roundNumber;
}

function getCurrentDistance(event) {
  return getDistance(event.touches[0], event.touches[1]);
}

function checkIfInfinite(number) {
  return number === Infinity || number === -Infinity;
}

export function calculatePinchZoom(currentDistance, delta, pinchStartDistance) {
  const { minScale, maxScale } = this.state;
  if (typeof pinchStartDistance !== "number" || typeof currentDistance !== "number")
    return console.error("Pinch touches distance was not provided");

  if (currentDistance < 0) return;
  const touchProportion = currentDistance / pinchStartDistance;
  const scaleDifference = touchProportion * this.pinchStartScale;

  return checkZoomBounds(scaleDifference, minScale, maxScale);
}

export function calculateMidpoint(event, scale, contentComponent) {
  const contentRect = contentComponent.getBoundingClientRect();
  const { touches } = event;
  const firstPointX = round(touches[0].clientX - contentRect.left, 5);
  const firstPointY = round(touches[0].clientY - contentRect.top, 5);
  const secondPointX = round(touches[1].clientX - contentRect.left, 5);
  const secondPointY = round(touches[1].clientY - contentRect.top, 5);

  return {
    mouseX: (firstPointX + secondPointX) / 2 / scale,
    mouseY: (firstPointY + secondPointY) / 2 / scale,
  };
}

export function handleZoomPinch(event) {
  const {
    isDown,
    zoomingEnabled,
    disabled,
    wrapperComponent,
    contentComponent,
    scale,
    limitToWrapperBounds,
  } = this.state;
  if (isDown || !zoomingEnabled || disabled) return;

  event.preventDefault();
  event.stopPropagation();

  // Position transformation
  const { mouseX, mouseY } = calculateMidpoint(event, scale, contentComponent);

  // if touches goes off of the wrapper element
  if (checkIfInfinite(mouseX) || checkIfInfinite(mouseY)) return;

  const currentDistance = getCurrentDistance(event);
  const delta = currentDistance < this.lastDistance ? 1 : -1;

  const newScale = calculatePinchZoom.bind(this, currentDistance, delta, this.pinchStartDistance)();
  if (checkIfInfinite(newScale) || newScale === scale) return;

  const scaleDifference = newScale - scale;

  // Get new element sizes to calculate bounds
  const {
    wrapperWidth,
    wrapperHeight,
    newContentWidth,
    newDiffWidth,
    newContentHeight,
    newDiffHeight,
  } = getComponentsSizes(wrapperComponent, contentComponent, newScale);

  const bounds = calculateBoundingArea(
    wrapperWidth,
    newContentWidth,
    newDiffWidth,
    wrapperHeight,
    newContentHeight,
    newDiffHeight,
    limitToWrapperBounds
  );

  // Save last zoom bounds, to speed up panning function
  this.bounds = bounds;

  // Calculate transformations
  const { newPositionX, newPositionY } = calculateTransformation.bind(
    this,
    mouseX,
    mouseY,
    scaleDifference,
    bounds
  )();

  this.lastDistance = currentDistance;

  this.setState({
    positionX: newPositionX,
    positionY: newPositionY,
    scale: newScale,
    previousScale: scale,
  });
}
