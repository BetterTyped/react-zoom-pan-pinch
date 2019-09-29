import {
  roundNumber,
  boundLimiter,
  calculateBoundingArea,
  checkIsNumber,
  handleCallback,
} from "./utils";
import { initialState } from "./InitialState";
import { animateFunction, animatePaddingFunction } from "./_animations";

export function checkZoomBounds(zoom, minScale, maxScale, scaleAnimationPadding) {
  const maxScaleWithPadding = maxScale + scaleAnimationPadding;
  const minScaleWithPadding = minScale - scaleAnimationPadding;

  if (!isNaN(maxScale) && zoom >= maxScaleWithPadding) return maxScaleWithPadding;
  if (!isNaN(minScale) && zoom <= minScaleWithPadding) return minScaleWithPadding;
  return zoom;
}

export function checkPositionBounds(positionX, positionY, bounds, limitToBounds) {
  const { minPositionX, minPositionY, maxPositionX, maxPositionY } = bounds;
  const x = boundLimiter(positionX, minPositionX, maxPositionX, limitToBounds);
  const y = boundLimiter(positionY, minPositionY, maxPositionY, limitToBounds);
  return { x, y };
}

export function getDelta(event, customDelta) {
  const deltaY = event ? (event.deltaY < 0 ? 1 : -1) : 0;
  const delta = checkIsNumber(customDelta, deltaY);
  return delta;
}

export function wheelMousePosition(event, contentComponent, scale) {
  const contentRect = contentComponent.getBoundingClientRect();

  // mouse position x, y over wrapper component
  const mouseX = (event.clientX - contentRect.left) / scale;
  const mouseY = (event.clientY - contentRect.top) / scale;

  if (isNaN(mouseX) || isNaN(mouseY)) return console.warn("No mouse or touch offset found");

  return {
    mouseX,
    mouseY,
  };
}

export function getComponentsSizes(wrapperComponent, newScale) {
  const wrapperRect = wrapperComponent.getBoundingClientRect();

  const wrapperWidth = wrapperRect.width;
  const wrapperHeight = wrapperRect.height;

  const newContentWidth = wrapperWidth * newScale;
  const newContentHeight = wrapperHeight * newScale;
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

export function calculateZoom(zoomStep, delta, customScale, disabledPadding) {
  const { scale, maxScale, minScale, scaleAnimationPadding } = this.stateProvider;
  const padding = disabledPadding ? 0 : scaleAnimationPadding;
  if (typeof customScale === "number" && customScale === scale) return scale;
  if (typeof customScale === "number")
    return checkZoomBounds(customScale, minScale, maxScale, padding);

  const newScale = scale + zoomStep * delta * (scale / 100);

  const calculatedScale = checkZoomBounds(roundNumber(newScale, 2), minScale, maxScale, padding);
  if (scale === calculatedScale) return scale;

  return calculatedScale;
}

export function calculateTransformation(mouseX, mouseY, scaleDifference, bounds) {
  if (typeof mouseX !== "number" || typeof mouseY !== "number")
    return console.error("Mouse X and Y position were not provided!");
  const { positionX, positionY, limitToBounds, transformEnabled } = this.stateProvider;

  if (!transformEnabled) return { newPositionX: positionX, newPositionY: positionY };

  const calculatedPositionX = positionX - mouseX * scaleDifference;
  const calculatedPositionY = positionY - mouseY * scaleDifference;

  const { x, y } = checkPositionBounds(
    calculatedPositionX,
    calculatedPositionY,
    bounds,
    limitToBounds
  );

  return { newPositionX: x, newPositionY: y };
}

export function handleZoom(
  event,
  customMousePosition,
  customDelta,
  customStep,
  animationTime,
  disabledPadding
) {
  const {
    isDown,
    zoomingEnabled,
    disabled,
    scale,
    limitToWrapperBounds,
    wheelStep,
    positionY,
    positionX,
  } = this.stateProvider;
  const { wrapperComponent, contentComponent } = this.state;

  if (isDown || !zoomingEnabled || disabled) return;
  if (disabledPadding && this.zoomPaddingTimer) {
    clearTimeout(this.zoomPaddingTimer);
    this.zoomPaddingTimer = null;
  }
  event.preventDefault();
  event.stopPropagation();
  // Scale transformation
  const delta = getDelta(event, customDelta);
  const targetScale = calculateZoom.bind(
    this,
    customStep || wheelStep,
    delta,
    null,
    disabledPadding
  )();

  if (targetScale === scale) return;

  // Get new element sizes to calculate bounds
  const {
    wrapperWidth,
    wrapperHeight,
    newContentWidth,
    newDiffWidth,
    newContentHeight,
    newDiffHeight,
  } = getComponentsSizes(wrapperComponent, targetScale);

  // Position transformation
  const { mouseX, mouseY } =
    customMousePosition || wheelMousePosition(event, contentComponent, scale);

  const scaleDifference = targetScale - scale;

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
  this.lastDelta = delta;

  // Calculate transformations
  const { newPositionX, newPositionY } = calculateTransformation.bind(
    this,
    mouseX,
    mouseY,
    scaleDifference,
    bounds
  )();
  const speed = checkIsNumber(animationTime, 1);
  if (!animationTime || Math.abs(scaleDifference) < 0.05) {
    this.stateProvider = {
      ...this.stateProvider,
      positionX: newPositionX,
      positionY: newPositionY,
      scale: targetScale,
      previousScale: scale,
    };
    // update component transformation
    this.setContentComponentTransformation();
  } else {
    // animate
    const params = {
      animationType: disabledPadding ? this.zoomPaddingAnimation : this.animate,
      animationTime: speed,
      animationName: "linear",
      callback: step => {
        const newPosX = positionX + (newPositionX - positionX) * step;
        const newPosY = positionY + (newPositionY - positionY) * step;
        const newScale = scale + (targetScale - scale) * step;
        this.stateProvider = {
          ...this.stateProvider,
          positionX: newPosX,
          positionY: newPosY,
          scale: newScale,
          previousScale: scale,
        };
        // update component transformation
        this.setContentComponentTransformation();
      },
      doneCallback: () => {
        if (animationTime !== "wheel") {
          handleCallback(this.props.onZoomChange, this.getCallbackProps());
        }
      },
      cancelCallback: () => {
        if (animationTime !== "wheel") {
          handleCallback(this.props.onZoomChange, this.getCallbackProps());
        }
      },
    };
    if (disabledPadding) {
      animatePaddingFunction.bind(this, params)();
    } else {
      animateFunction.bind(this, params)();
    }
  }
}

export function handleZoomControls(event, customDelta, customStep) {
  const {
    positionX,
    positionY,
    scale,
    zoomInAnimationSpeed,
    zoomOutAnimationSpeed,
  } = this.stateProvider;
  const { wrapperComponent } = this.state;

  // calculate zoom center
  const wrapperWidth = wrapperComponent.offsetWidth;
  const wrapperHeight = wrapperComponent.offsetHeight;
  const mouseX = (Math.abs(positionX) + wrapperWidth / 2) / scale;
  const mouseY = (Math.abs(positionY) + wrapperHeight / 2) / scale;
  const animationSpeed = customDelta ? zoomInAnimationSpeed : zoomOutAnimationSpeed;
  handleZoom.bind(this, event, { mouseX, mouseY }, customDelta, customStep, animationSpeed)();
}

export function handleZoomDbClick(event) {
  const { dbClickMode, dbClickStep, dbClickAnimationSpeed } = this.stateProvider;

  if (dbClickMode === "reset") {
    return resetTransformations.bind(this, event, dbClickAnimationSpeed)();
  }
  const delta = dbClickMode === "zoomOut" ? -1 : 1;
  handleZoom.bind(this, event, null, delta, dbClickStep, dbClickAnimationSpeed)();
}

export function resetTransformations() {
  const { defaultScale, defaultPositionX, defaultPositionY } = this.props.defaultValues;
  const { scale, positionX, positionY, disabled, resetAnimationSpeed } = this.stateProvider;
  if (disabled) return;
  if (scale === defaultScale && positionX === defaultPositionX && positionY === defaultPositionY)
    return;

  const targetScale = checkIsNumber(defaultScale, initialState.scale);
  const newPositionX = checkIsNumber(defaultPositionX, initialState.positionX);
  const newPositionY = checkIsNumber(defaultPositionY, initialState.positionY);

  // animate
  animateFunction.bind(this, {
    animationType: this.animate,
    animationTime: resetAnimationSpeed,
    animationName: "linear",
    callback: step => {
      const newPosX = positionX + (newPositionX - positionX) * step;
      const newPosY = positionY + (newPositionY - positionY) * step;
      const newScale = scale + (targetScale - scale) * step;
      this.stateProvider = {
        ...this.stateProvider,
        scale: newScale,
        positionX: newPosX,
        positionY: newPosY,
        previousScale: this.stateProvider.scale,
      };
      // update component transformation
      this.setContentComponentTransformation();
    },
    doneCallback: () => {
      handleCallback(this.props.onZoomChange, this.getCallbackProps());
    },
    cancelCallback: () => {
      handleCallback(this.props.onZoomChange, this.getCallbackProps());
    },
  })();
}

export function animatePadding(event) {
  const {
    positionX,
    positionY,
    scale,
    scalePaddingAnimationSpeed,
    minScale,
    maxScale,
  } = this.stateProvider;
  if (scale > minScale && scale < maxScale) return;
  const { wrapperComponent } = this.state;

  // calculate zoom center
  const wrapperWidth = wrapperComponent.offsetWidth;
  const wrapperHeight = wrapperComponent.offsetHeight;
  const mouseX = (Math.abs(positionX) + wrapperWidth / 2) / scale;
  const mouseY = (Math.abs(positionY) + wrapperHeight / 2) / scale;
  handleZoom.bind(
    this,
    event,
    { mouseX, mouseY },
    this.lastDelta,
    1,
    scalePaddingAnimationSpeed,
    true
  )();
}
