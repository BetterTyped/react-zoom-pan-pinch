import { ReactZoomPanPinchContext } from "../../models";
import { BoundsType } from "../bounds/bounds.types";
import { PositionType } from "../../models";

import { checkIsNumber, roundNumber } from "../../utils";
import {
  getMouseBoundedPosition,
  handleCalculateBounds,
} from "../bounds/bounds.utils";

export const useWheelZoom = (
  contextInstance: ReactZoomPanPinchContext,
  event: WheelEvent,
): void => {
  const { contentComponent } = contextInstance;
  const { scale } = contextInstance.transformState;
  const {
    limitToBounds,
    scalePadding: { size, disabled },
    wheel: { step, limitsOnWheel },
  } = contextInstance.setup;

  if (!contentComponent) {
    throw new Error("Component not mounted");
  }

  event.preventDefault();
  event.stopPropagation();

  const delta = getDelta(event, null);
  const newScale = handleCalculateZoom(
    contextInstance,
    delta,
    step,
    !event.ctrlKey,
  );

  // if scale not change
  if (scale === newScale) return;

  const bounds = handleCalculateBounds(contextInstance, newScale);

  const mousePosition = wheelMousePosition(event, contentComponent, scale);

  const isLimitedToBounds =
    limitToBounds && (disabled || size === 0 || limitsOnWheel);

  const { x, y } = handleCalculatePositions(
    contextInstance,
    mousePosition.x,
    mousePosition.y,
    newScale,
    bounds,
    isLimitedToBounds,
  );

  contextInstance.bounds = bounds;
  contextInstance.transformState.previousScale = scale;
  contextInstance.transformState.scale = newScale;
  contextInstance.transformState.positionX = x;
  contextInstance.transformState.positionY = y;
  contextInstance.handleStylesUpdate();
};

export const isWheelAllowed = (
  contextInstance: ReactZoomPanPinchContext,
  event: WheelEvent,
): boolean => {
  const {
    disabled,
    wheelEnabled,
    touchPadEnabled,
  } = contextInstance.setup.wheel;
  const { isInitialized, isMouseDown } = contextInstance;

  const isDisabled = disabled;
  const isAllowed = !isInitialized || isMouseDown || !isDisabled;

  // Check if it's possible to perform wheel event
  if (!isAllowed) return false;
  // Event ctrlKey detects if touchpad action is executing wheel or pinch gesture
  if (!wheelEnabled && !event.ctrlKey) return false;
  if (!touchPadEnabled && event.ctrlKey) return false;

  return true;
};

export function checkZoomBounds(
  zoom: number,
  minScale: number,
  maxScale: number,
  zoomPadding: number,
  enablePadding: boolean,
): number {
  const scalePadding = enablePadding ? zoomPadding : 0;
  const minScaleWithPadding = minScale - scalePadding;

  if (!isNaN(maxScale) && zoom >= maxScale) return maxScale;
  if (!isNaN(minScale) && zoom <= minScaleWithPadding)
    return minScaleWithPadding;
  return zoom;
}

export function getDelta(
  event: WheelEvent,
  customDelta?: number | null,
): number {
  const deltaY = event ? (event.deltaY < 0 ? 1 : -1) : 0;
  const delta = checkIsNumber(customDelta, deltaY);
  return delta;
}

export function wheelMousePosition(
  event: WheelEvent,
  contentComponent: HTMLDivElement,
  scale: number,
): PositionType {
  const contentRect = contentComponent.getBoundingClientRect();

  // mouse position x, y over wrapper component
  const mouseX = (event.clientX - contentRect.left) / scale;
  const mouseY = (event.clientY - contentRect.top) / scale;

  if (isNaN(mouseX) || isNaN(mouseY))
    console.error("No mouse or touch offset found");

  return {
    x: mouseX,
    y: mouseY,
  };
}

export function handleCalculatePositions(
  contextInstance: ReactZoomPanPinchContext,
  mouseX: number,
  mouseY: number,
  newScale: number,
  bounds: BoundsType,
  limitToBounds: boolean,
): PositionType {
  const { scale, positionX, positionY } = contextInstance.transformState;
  const { transformEnabled } = contextInstance.setup;

  const scaleDifference = newScale - scale;

  if (typeof mouseX !== "number" || typeof mouseY !== "number") {
    console.error("Mouse X and Y position were not provided!");
    return { x: positionX, y: positionY };
  }

  if (!transformEnabled) {
    return { x: positionX, y: positionY };
  }

  const calculatedPositionX = positionX - mouseX * scaleDifference;
  const calculatedPositionY = positionY - mouseY * scaleDifference;

  // do not limit to bounds when there is padding animation,
  // it causes animation strange behaviour

  const newPositions = getMouseBoundedPosition(
    calculatedPositionX,
    calculatedPositionY,
    bounds,
    limitToBounds,
    0,
    null,
  );

  return newPositions;
}

function handleCalculateZoom(
  contextInstance: ReactZoomPanPinchContext,
  delta: number,
  step: number,
  disablePadding: boolean,
  getTarget?: boolean,
  isBtnFunction?: boolean,
): number {
  const { scale } = contextInstance.transformState;
  const { wrapperComponent } = contextInstance;
  const {
    maxScale,
    minScale,
    scalePadding: { size, disabled },
  } = contextInstance.setup;

  if (!wrapperComponent) {
    throw new Error("Wrapper is not mounted");
  }

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

export const handleWheelZoomStop = (
  contextInstance: ReactZoomPanPinchContext,
  event: WheelEvent,
): boolean => {
  const { previousWheelEvent } = contextInstance;
  const { scale } = contextInstance.transformState;
  const { maxScale, minScale } = contextInstance.setup;

  if (!previousWheelEvent) return false;
  if (scale < maxScale || scale > minScale) return true;
  if (Math.sign(previousWheelEvent.deltaY) !== Math.sign(event.deltaY))
    return true;
  if (previousWheelEvent.deltaY > 0 && previousWheelEvent.deltaY < event.deltaY)
    return true;
  if (previousWheelEvent.deltaY < 0 && previousWheelEvent.deltaY > event.deltaY)
    return true;
  if (Math.sign(previousWheelEvent.deltaY) !== Math.sign(event.deltaY))
    return true;
  return false;
};
