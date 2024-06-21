import { PositionType, ReactZoomPanPinchContext } from "../../models";
import { isExcludedNode } from "../../utils";
import { checkZoomBounds } from "../zoom/zoom.utils";

export const isPinchStartAllowed = (
  contextInstance: ReactZoomPanPinchContext,
  event: TouchEvent,
): boolean => {
  const { disabled, excluded } = contextInstance.setup.pinch;
  const { isInitialized } = contextInstance;

  const target = event.target as HTMLElement;
  const isAllowed = isInitialized && !disabled && target;

  if (!isAllowed) return false;

  const isExcluded = isExcludedNode(target, excluded);

  if (isExcluded) return false;

  return true;
};

export const isPinchAllowed = (
  contextInstance: ReactZoomPanPinchContext,
): boolean => {
  const { disabled } = contextInstance.setup.pinch;
  const { isInitialized, pinchStartDistance } = contextInstance;

  const isAllowed = isInitialized && !disabled && pinchStartDistance !== null;

  if (!isAllowed) return false;

  return true;
};

export const calculateTouchMidPoint = (
  event: TouchEvent,
  scale: number,
  contentComponent: HTMLDivElement,
): PositionType => {
  const contentRect = contentComponent.getBoundingClientRect();
  const { touches } = event;
  const firstPointX = touches[0].clientX - contentRect.left;
  const firstPointY = touches[0].clientY - contentRect.top;
  const secondPointX = touches[1].clientX - contentRect.left;
  const secondPointY = touches[1].clientY - contentRect.top;

  return {
    x: (firstPointX + secondPointX) / 2 / scale,
    y: (firstPointY + secondPointY) / 2 / scale,
  };
};

export const getTouchDistance = (event: TouchEvent): number => {
  return Math.sqrt(
    (event.touches[0].pageX - event.touches[1].pageX) ** 2 +
      (event.touches[0].pageY - event.touches[1].pageY) ** 2,
  );
};

export const calculatePinchZoom = (
  contextInstance: ReactZoomPanPinchContext,
  currentDistance: number,
): number => {
  const { pinchStartScale, pinchStartDistance, setup } = contextInstance;
  const { maxScale, minScale, zoomAnimation, disablePadding } = setup;
  const { size, disabled } = zoomAnimation;

  if (!pinchStartScale || pinchStartDistance === null) {
    throw new Error("Pinch touches distance was not provided");
  }

  if (currentDistance < 0) {
    return contextInstance.state.scale;
  }

  const touchProportion = currentDistance / pinchStartDistance;
  const scaleDifference = touchProportion * pinchStartScale;

  const scale = scaleDifference === Infinity ? 0 : scaleDifference;

  return checkZoomBounds(
    scale,
    minScale,
    maxScale,
    size,
    !disabled && !disablePadding,
  );
};
