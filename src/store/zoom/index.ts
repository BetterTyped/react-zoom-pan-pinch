import { roundNumber, checkIsNumber, calculateBoundingArea } from "../utils";
import { animateComponent } from "../animations";
import { handlePanningAnimation } from "../pan";
import { initialState } from "../InitialState";
import {
  checkZoomBounds,
  getComponentsSizes,
  getDelta,
  wheelMousePosition,
  handleCalculatePositions,
} from "./utils";

function handleCalculateZoom(
  delta,
  step,
  disablePadding,
  getTarget,
  isBtnFunction,
) {
  const {
    scale,
    options: { maxScale, minScale },
    scalePadding: { size, disabled },
    wrapperComponent,
  } = this.stateProvider;

  let targetScale = null;

  if (isBtnFunction) {
    const scaleFactor = window.innerWidth * 0.0001;
    const zoomFactor = delta < 0 ? 30 : 20;
    targetScale =
      scale + (step - step * scaleFactor) * delta * (scale / zoomFactor);
  } else {
    const wrapperToWindowScale =
      2 - window.innerWidth / wrapperComponent.offsetWidth;
    const scaleFactor = Math.max(0.2, Math.min(0.99, wrapperToWindowScale));
    const zoomFactor = 20;
    targetScale =
      scale + step * delta * ((scale - scale * scaleFactor) / zoomFactor);
  }

  if (getTarget) return targetScale;
  const paddingEnabled = disablePadding ? false : !disabled;
  const newScale = checkZoomBounds(
    roundNumber(targetScale, 3),
    minScale,
    maxScale,
    size,
    paddingEnabled,
  );
  return newScale;
}

export function handleCalculateBounds(newScale, limitToWrapper) {
  const { wrapperComponent, contentComponent } = this.stateProvider;

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
    limitToWrapper,
  );

  // Save bounds
  this.bounds = bounds;
  return bounds;
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
    wheel: { step, limitsOnWheel },
  } = this.stateProvider;

  event.preventDefault();
  event.stopPropagation();

  const delta = getDelta(event, null);
  const newScale = handleCalculateZoom.call(this, delta, step, !event.ctrlKey);

  // if scale not change
  if (scale === newScale) return;

  const bounds = handleCalculateBounds.call(this, newScale, !limitsOnWheel);

  const { mouseX, mouseY } = wheelMousePosition(event, contentComponent, scale);

  const isLimitedToBounds =
    limitToBounds && (disabled || size === 0 || limitsOnWheel);

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
  this.applyTransformation();
}

/**
 * Zoom for animations
 */

export function handleZoomToPoint(isDisabled, scale, mouseX, mouseY, event) {
  const {
    contentComponent,
    options: { disabled, minScale, maxScale, limitToBounds, limitToWrapper },
  } = this.stateProvider;
  if (disabled || isDisabled) return;

  const newScale = checkZoomBounds(
    roundNumber(scale, 2),
    minScale,
    maxScale,
    null,
    null,
  );
  const bounds = handleCalculateBounds.call(this, newScale, limitToWrapper);

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
    options: { minScale, limitToBounds },
    scalePadding: { disabled, animationTime, animationType },
  } = this.stateProvider;
  const isDisabled = disabled || scale >= minScale;

  if (scale >= 1 || limitToBounds) {
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
  const newScale = handleCalculateZoom.call(
    this,
    delta,
    step,
    undefined,
    undefined,
    true,
  );

  const { mouseX, mouseY } = wheelMousePosition(event, contentComponent, scale);
  const targetState = handleZoomToPoint.call(
    this,
    disabled,
    newScale,
    mouseX,
    mouseY,
  );

  if (targetState.scale === scale) return;
  const targetScale = handleCalculateZoom.call(
    this,
    delta,
    step,
    true,
    undefined,
    true,
  );
  const time = getButtonAnimationTime(targetScale, newScale, animationTime);

  animateComponent.call(this, {
    targetState,
    speed: time,
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
  const mouseX = (wrapperWidth / 2 - positionX) / scale;
  const mouseY = (wrapperHeight / 2 - positionY) / scale;

  const newScale = handleCalculateZoom.call(
    this,
    customDelta,
    customStep,
    undefined,
    undefined,
    true,
  );
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

  if (targetState.scale === scale) return;
  const targetScale = handleCalculateZoom.call(
    this,
    customDelta,
    customStep,
    true,
    undefined,
    true,
  );
  const time = getButtonAnimationTime(targetScale, newScale, animationSpeed);

  animateComponent.call(this, {
    targetState,
    speed: time,
    type: animationType,
  });
}

export function resetTransformations(animationSpeed) {
  const {
    defaultScale,
    defaultPositionX,
    defaultPositionY,
  } = this.props.defaultValues;
  const {
    scale,
    positionX,
    positionY,
    reset,
    options: { disabled, limitToBounds, centerContent, limitToWrapper },
  } = this.stateProvider;
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
  let newPositionX = checkIsNumber(defaultPositionX, initialState.positionX);
  let newPositionY = checkIsNumber(defaultPositionY, initialState.positionY);

  if ((limitToBounds && !limitToWrapper) || centerContent) {
    const bounds = handleCalculateBounds.call(
      this,
      targetScale,
      limitToWrapper,
    );
    newPositionX = bounds.minPositionX;
    newPositionY = bounds.minPositionY;
  }

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

function getButtonAnimationTime(targetScale, newScale, time) {
  return time * (newScale / targetScale);
}
