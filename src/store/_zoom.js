import {
  roundNumber,
  boundLimiter,
  calculateBoundingArea,
  checkIsNumber,
  handleCallback,
} from "./utils";
import { initialState } from "./InitialState";
import { animateFunction } from "./_animations";

export function checkZoomBounds(zoom, minScale, maxScale) {
  if (!isNaN(maxScale) && zoom >= maxScale) return maxScale;
  if (!isNaN(minScale) && zoom <= minScale) return minScale;
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

export function calculateZoom(zoomStep, delta, customScale) {
  const { scale, maxScale, minScale } = this.state;

  if (typeof customScale === "number" && customScale === scale) return scale;
  if (typeof customScale === "number") return checkZoomBounds(customScale, minScale, maxScale);

  const newScale = scale + zoomStep * delta * (scale / 100);

  const calculatedScale = checkZoomBounds(roundNumber(newScale, 2), minScale, maxScale);
  if (scale === calculatedScale) return scale;

  return calculatedScale;
}

export function calculateTransformation(mouseX, mouseY, scaleDifference, bounds) {
  if (typeof mouseX !== "number" || typeof mouseY !== "number")
    return console.error("Mouse X and Y position were not provided!");
  const { positionX, positionY, limitToBounds, transformEnabled } = this.state;

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

export function handleZoom(event, customMousePosition, customDelta, customStep, animationTime) {
  const {
    isDown,
    zoomingEnabled,
    disabled,
    wrapperComponent,
    contentComponent,
    scale,
    limitToWrapperBounds,
    wheelStep,
    positionY,
    positionX,
  } = this.state;

  if (isDown || !zoomingEnabled || disabled) return;
  event.preventDefault();
  event.stopPropagation();

  // Scale transformation
  const delta = getDelta(event, customDelta);
  const targetScale = calculateZoom.bind(this, customStep || wheelStep, delta)();

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

  // Calculate transformations
  const { newPositionX, newPositionY } = calculateTransformation.bind(
    this,
    mouseX,
    mouseY,
    scaleDifference,
    bounds
  )();

  const speed = checkIsNumber(animationTime, 1);

  // animate
  animateFunction.bind(this, {
    animationTime: speed,
    animationName: "linear",
    callback: step => {
      if (!animationTime || Math.abs(scaleDifference) < 0.05) {
        this.setState({
          positionX: newPositionX,
          positionY: newPositionY,
          scale: targetScale,
          previousScale: scale,
        });
      } else {
        const newPosX = positionX + (newPositionX - positionX) * step;
        const newPosY = positionY + (newPositionY - positionY) * step;
        const newScale = scale + (targetScale - scale) * step;
        this.setState({
          positionX: newPosX,
          positionY: newPosY,
          scale: newScale,
          previousScale: scale,
        });
      }
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
  })();
}

export function handleZoomControls(event, customDelta, customStep) {
  const {
    positionX,
    positionY,
    wrapperComponent,
    scale,
    zoomInAnimationSpeed,
    zoomOutAnimationSpeed,
  } = this.state;
  // calculate zoom center
  const wrapperWidth = wrapperComponent.offsetWidth;
  const wrapperHeight = wrapperComponent.offsetHeight;
  const mouseX = (Math.abs(positionX) + wrapperWidth / 2) / scale;
  const mouseY = (Math.abs(positionY) + wrapperHeight / 2) / scale;
  const animationSpeed = customDelta ? zoomInAnimationSpeed : zoomOutAnimationSpeed;
  handleZoom.bind(this, event, { mouseX, mouseY }, customDelta, customStep, animationSpeed)();
}

export function handleZoomDbClick(event) {
  const { dbClickMode, dbClickStep, dbClickAnimationSpeed } = this.state;

  if (dbClickMode === "reset") {
    return resetTransformations.bind(this, event, dbClickAnimationSpeed)();
  }
  const delta = dbClickMode === "zoomOut" ? -1 : 1;
  handleZoom.bind(this, event, null, delta, dbClickStep, dbClickAnimationSpeed)();
}

export function resetTransformations() {
  const { defaultScale, defaultPositionX, defaultPositionY } = this.props.defaultValues;
  const { scale, positionX, positionY, disabled, resetAnimationSpeed } = this.state;
  if (disabled) return;
  if (scale === defaultScale && positionX === defaultPositionX && positionY === defaultPositionY)
    return;

  const targetScale = checkIsNumber(defaultScale, initialState.scale);
  const newPositionX = checkIsNumber(defaultPositionX, initialState.positionX);
  const newPositionY = checkIsNumber(defaultPositionY, initialState.positionY);

  // animate
  animateFunction.bind(this, {
    animationTime: resetAnimationSpeed,
    animationName: "linear",
    callback: step => {
      const newPosX = positionX + (newPositionX - positionX) * step;
      const newPosY = positionY + (newPositionY - positionY) * step;
      const newScale = scale + (targetScale - scale) * step;
      this.setState(p => ({
        scale: newScale,
        positionX: newPosX,
        positionY: newPosY,
        previousScale: p.scale,
      }));
    },
    doneCallback: () => {
      handleCallback(this.props.onZoomChange, this.getCallbackProps());
    },
    cancelCallback: () => {
      handleCallback(this.props.onZoomChange, this.getCallbackProps());
    },
  })();
}
