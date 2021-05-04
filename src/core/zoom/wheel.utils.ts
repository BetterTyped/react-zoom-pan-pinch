import { ReactZoomPanPinchContext } from "../../models";
import { PositionType } from "../../models";

import { checkIsNumber, isExcludedNode, roundNumber } from "../../utils";
import { checkZoomBounds } from "./zoom.utils";

export const isWheelAllowed = (
  contextInstance: ReactZoomPanPinchContext,
  event: WheelEvent,
): boolean => {
  const {
    disabled,
    wheelDisabled,
    touchPadDisabled,
    excluded,
  } = contextInstance.setup.wheel;
  const { isInitialized, isPanning } = contextInstance;

  const target = event.target as HTMLElement;
  const isAllowed = isInitialized && !isPanning && !disabled && target;

  if (!isAllowed) return false;
  // Event ctrlKey detects if touchpad action is executing wheel or pinch gesture
  if (wheelDisabled && !event.ctrlKey) return false;
  if (touchPadDisabled && event.ctrlKey) return false;

  const isExcluded = isExcludedNode(target, excluded);

  if (isExcluded) return false;

  return true;
};

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

export const handleCalculateWheelZoom = (
  contextInstance: ReactZoomPanPinchContext,
  delta: number,
  step: number,
  disablePadding: boolean,
  getTarget?: boolean,
  isBtnFunction?: boolean,
): number => {
  const { scale } = contextInstance.transformState;
  const { wrapperComponent, setup } = contextInstance;
  const { maxScale, minScale, zoomAnimation } = setup;
  const { size, disabled } = zoomAnimation;

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
};

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
