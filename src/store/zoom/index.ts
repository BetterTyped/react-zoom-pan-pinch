import { roundNumber, checkIsNumber, calculateBoundingArea } from "../utils";
import { animateComponent } from "../animations";
import { handlePanningAnimation } from "../pan";
import { initialState } from "../InitialState";
import {
  checkZoomBounds,
  getComponentsSizes,
  checkPositionBounds,
  getDelta,
  wheelMousePosition,
} from "./utils";

function handleCalculateZoom(delta, step, disablePadding) {
  const {
    scale,
    options: { maxScale, minScale },
    scalePadding: { size, disabled },
  } = this.stateProvider;
  const targetScale = scale + step * delta * (scale / 100);
  const paddingEnabled = disablePadding ? false : !disabled;
  const newScale = checkZoomBounds(
    roundNumber(targetScale, 2),
    minScale,
    maxScale,
    size,
    paddingEnabled,
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
    limitToWrapper,
  );

  // Save bounds
  this.bounds = bounds;
  return bounds;
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
  );

  return newPositions;
}

/**
 * Wheel zoom event
 */
export function handleWheelZoom(event) {
  const {
    scale,
    contentComponent,
    options: { limitToBounds },
    scalePadding: { size, disabled },
    wheel: { step, disableLimitsOnWheel },
  } = this.stateProvider;

  event.preventDefault();
  event.stopPropagation();

  const delta = getDelta(event, null);
  const newScale = handleCalculateZoom.call(this, delta, step, !event.ctrlKey);

  // if scale not change
  if (scale === newScale) return;

  const bounds = handleCalculateBounds.call(
    this,
    newScale,
    disableLimitsOnWheel,
  );

  const { mouseX, mouseY } = wheelMousePosition(event, contentComponent, scale);

  const isLimitedToBounds =
    limitToBounds && (disabled || size === 0 || disableLimitsOnWheel);

  const { x, y } = handleCalculatePositions.call(
    this,
    mouseX,
    mouseY,
    newScale,
    bounds,
    isLimitedToBounds,
  );
  this.bounds = bounds;
  this.stateProvider.previousScale = scale;
  this.stateProvider.scale = newScale;
  this.stateProvider.positionX = x;
  this.stateProvider.positionY = y;
}

/**
 * Zoom for animations
 */

export function handleZoomToPoint(isDisabled, scale, mouseX, mouseY, event) {
  const {
    contentComponent,
    options: { disabled, minScale, maxScale, limitToBounds },
  } = this.stateProvider;
  if (this.isDown || disabled || isDisabled) return;

  const newScale = checkZoomBounds(
    roundNumber(scale, 2),
    minScale,
    maxScale,
    null,
    null,
  );
  const bounds = handleCalculateBounds.call(this, newScale, false);

  let mousePosX = mouseX;
  let mousePosY = mouseY;

  // if event is present - use it's mouse position
  if (event) {
    const mousePosition = wheelMousePosition(event, contentComponent, scale);
    mousePosX = mousePosition.mouseX;
    mousePosY = mousePosition.mouseY;
  }

  const { x, y } = handleCalculatePositions.call(
    this,
    mousePosX,
    mousePosY,
    newScale,
    bounds,
    limitToBounds,
  );

  return { scale: newScale, positionX: x, positionY: y };
}

export function handlePaddingAnimation() {
  const {
    scale,
    wrapperComponent,
    options: { minScale },
    scalePadding: { disabled, animationTime, animationType },
  } = this.stateProvider;
  const isDisabled = disabled || scale > minScale;

  if (scale > minScale) {
    // fire fit to bounds animation
    handlePanningAnimation.call(this);
  }

  if (isDisabled) return;

  let mouseX = wrapperComponent.offsetWidth / 2;
  let mouseY = wrapperComponent.offsetHeight / 2;

  const targetState = handleZoomToPoint.call(
    this,
    false,
    minScale,
    mouseX,
    mouseY,
    null,
  );

  animateComponent.call(this, {
    targetState,
    speed: animationTime,
    type: animationType,
  });
}

/**
 * Button zoom events
 */

export function handleDoubleClick(event) {
  event.preventDefault();
  event.stopPropagation();
  const {
    contentComponent,
    scale,
    doubleClick: { disabled, mode, step, animationTime, animationType },
  } = this.stateProvider;

  if (mode === "reset") {
    return resetTransformations.call(this, event, animationTime);
  }
  const delta = mode === "zoomOut" ? -1 : 1;
  const newScale = handleCalculateZoom.call(this, delta, step);

  const { mouseX, mouseY } = wheelMousePosition(event, contentComponent, scale);

  const targetState = handleZoomToPoint.call(
    this,
    disabled,
    newScale,
    mouseX,
    mouseY,
  );

  animateComponent.call(this, {
    targetState,
    speed: animationTime,
    type: animationType,
  });
}

export function handleZoomControls(customDelta, customStep) {
  const {
    scale,
    positionX,
    positionY,
    wrapperComponent,
    zoomIn,
    zoomOut,
  } = this.stateProvider;

  const wrapperWidth = wrapperComponent.offsetWidth;
  const wrapperHeight = wrapperComponent.offsetHeight;
  const mouseX = (Math.abs(positionX) + wrapperWidth / 2) / scale;
  const mouseY = (Math.abs(positionY) + wrapperHeight / 2) / scale;

  const newScale = handleCalculateZoom.call(this, customDelta, customStep);
  const isZoomIn = newScale > scale;
  const animationSpeed = isZoomIn
    ? zoomIn.animationTime
    : zoomOut.animationTime;
  const animationType = isZoomIn ? zoomIn.animationType : zoomOut.animationType;
  const isDisabled = isZoomIn ? zoomIn.disabled : zoomOut.disabled;

  const targetState = handleZoomToPoint.call(
    this,
    isDisabled,
    newScale,
    mouseX,
    mouseY,
  );

  if (targetState === scale) return;

  animateComponent.call(this, {
    targetState,
    speed: animationSpeed,
    type: animationType,
  });
}

export function resetTransformations(animationSpeed) {
  const {
    defaultScale,
    defaultPositionX,
    defaultPositionY,
  } = this.props.defaultValues;
  const { scale, positionX, positionY, disabled, reset } = this.stateProvider;
  if (disabled || reset.disabled) return;
  if (
    scale === defaultScale &&
    positionX === defaultPositionX &&
    positionY === defaultPositionY
  )
    return;

  const speed =
    typeof animationSpeed === "number" ? animationSpeed : reset.animationTime;

  const targetScale = checkIsNumber(defaultScale, initialState.scale);
  const newPositionX = checkIsNumber(defaultPositionX, initialState.positionX);
  const newPositionY = checkIsNumber(defaultPositionY, initialState.positionY);

  const targetState = {
    scale: targetScale,
    positionX: newPositionX,
    positionY: newPositionY,
  };

  animateComponent.call(this, {
    targetState,
    speed,
    type: reset.animationType,
  });
}
