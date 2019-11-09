import { roundNumber, checkIsNumber, calculateBoundingArea } from "../utils";
import { animateComponent } from "../animations";
import { initialState } from "../InitialState";
import {
  checkZoomBounds,
  getComponentsSizes,
  checkPositionBounds,
  getDelta,
  wheelMousePosition,
} from "./utils";
import { PropsList } from "../interfaces/propsInterface";

function handleCalculateZoom(delta, step, disablePadding) {
  const {
    scale,
    maxScale,
    minScale,
    zoomPadding,
    enablePadding,
  }: PropsList = this.stateProvider;
  const targetScale = scale + step * delta * (scale / 100);
  const newScale = checkZoomBounds(
    roundNumber(targetScale, 2),
    minScale,
    maxScale,
    zoomPadding,
    disablePadding ? false : enablePadding,
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
  const { scale, positionX, positionY, transformEnabled } = this.stateProvider;

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
  );

  return newPositions;
}

/**
 * Wheel zoom event
 */
export function handleWheelZoom(event) {
  const {
    wheelStep,
    scale,
    contentComponent,
    limitToWrapperOnWheel,
    limitToBounds,
    enablePadding,
    zoomPadding,
  } = this.stateProvider;

  event.preventDefault();
  event.stopPropagation();

  const delta = getDelta(event, null);
  const newScale = handleCalculateZoom.bind(
    this,
    delta,
    wheelStep,
    !event.ctrlKey,
  )();

  if (scale === newScale) return;

  const bounds = handleCalculateBounds.bind(
    this,
    newScale,
    limitToWrapperOnWheel,
  )();

  const { mouseX, mouseY } = wheelMousePosition(event, contentComponent, scale);

  const isLimitedToBounds =
    limitToBounds &&
    (!enablePadding || zoomPadding === 0 || limitToWrapperOnWheel);
  const { x, y } = handleCalculatePositions.bind(
    this,
    mouseX,
    mouseY,
    newScale,
    bounds,
    isLimitedToBounds,
  )();

  this.stateProvider.previousScale = scale;
  this.stateProvider.scale = newScale;
  this.stateProvider.bounds = bounds;
  this.stateProvider.positionX = x;
  this.stateProvider.positionY = y;
}

/**
 * Zoom for animations
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

  const newScale = checkZoomBounds(
    roundNumber(scale, 2),
    minScale,
    maxScale,
    null,
    null,
  );
  const bounds = handleCalculateBounds.bind(this, newScale, false)();

  let mousePosX = mouseX;
  let mousePosY = mouseY;

  // if event is present - use it's mouse position
  if (event) {
    const mousePosition = wheelMousePosition(event, contentComponent, scale);
    mousePosX = mousePosition.mouseX;
    mousePosY = mousePosition.mouseY;
  }

  const { x, y } = handleCalculatePositions.bind(
    this,
    mousePosX,
    mousePosY,
    newScale,
    bounds,
    limitToBounds,
  )();

  return { scale: newScale, positionX: x, positionY: y };
}

export function handlePaddingAnimation() {
  const {
    minScale,
    enablePadding,
    scale,
    wrapperComponent,
    paddingAnimationSpeed,
  } = this.stateProvider;
  const disabled = !enablePadding || scale > minScale;

  if (disabled) return;

  let mouseX = wrapperComponent.offsetWidth / 2;
  let mouseY = wrapperComponent.offsetHeight / 2;

  const targetState = handleZoomToPoint.bind(
    this,
    minScale,
    mouseX,
    mouseY,
    null,
  )();

  animateComponent.bind(this, {
    targetState,
    speed: paddingAnimationSpeed,
    type: "easeOut",
  })();
}

/**
 * Button zoom events
 */

export function handleDoubleClick(event) {
  event.preventDefault();
  event.stopPropagation();
  const {
    dbClickMode,
    dbClickStep,
    dbClickAnimationSpeed,
    contentComponent,
    scale,
  } = this.stateProvider;

  if (dbClickMode === "reset") {
    return resetTransformations.bind(this, event, dbClickAnimationSpeed)();
  }
  const delta = dbClickMode === "zoomOut" ? -1 : 1;
  const newScale = handleCalculateZoom.bind(this, delta, dbClickStep)();

  const { mouseX, mouseY } = wheelMousePosition(event, contentComponent, scale);

  const targetState = handleZoomToPoint.bind(this, newScale, mouseX, mouseY)();

  animateComponent.bind(this, {
    targetState,
    speed: dbClickAnimationSpeed,
    type: "easeOut",
  })();
}

export function handleZoomControls(customDelta, customStep) {
  const {
    positionX,
    positionY,
    scale,
    zoomInAnimationSpeed,
    zoomOutAnimationSpeed,
    wrapperComponent,
  } = this.stateProvider;

  const wrapperWidth = wrapperComponent.offsetWidth;
  const wrapperHeight = wrapperComponent.offsetHeight;
  const mouseX = (Math.abs(positionX) + wrapperWidth / 2) / scale;
  const mouseY = (Math.abs(positionY) + wrapperHeight / 2) / scale;

  const animationSpeed = customDelta
    ? zoomInAnimationSpeed
    : zoomOutAnimationSpeed;

  const newScale = handleCalculateZoom.bind(this, customDelta, customStep)();
  const targetState = handleZoomToPoint.bind(this, newScale, mouseX, mouseY)();

  animateComponent.bind(this, {
    targetState,
    speed: animationSpeed,
    type: "easeOut",
  })();
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
    disabled,
    resetAnimationSpeed,
  } = this.stateProvider;
  if (disabled) return;
  if (
    scale === defaultScale &&
    positionX === defaultPositionX &&
    positionY === defaultPositionY
  )
    return;

  const speed =
    typeof animationSpeed === "number" ? animationSpeed : resetAnimationSpeed;

  const targetScale = checkIsNumber(defaultScale, initialState.scale);
  const newPositionX = checkIsNumber(defaultPositionX, initialState.positionX);
  const newPositionY = checkIsNumber(defaultPositionY, initialState.positionY);

  const targetState = {
    scale: targetScale,
    positionX: newPositionX,
    positionY: newPositionY,
  };

  animateComponent.bind(this, {
    targetState,
    speed,
    type: "easeOut",
  })();
}
