import { PositionType, ReactZoomPanPinchContext } from "../../models";
import { isExcludedNode, roundNumber } from "../../utils";
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

  const isAllowed = isInitialized && !disabled && pinchStartDistance;

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
  const firstPointX = roundNumber(touches[0].clientX - contentRect.left, 5);
  const firstPointY = roundNumber(touches[0].clientY - contentRect.top, 5);
  const secondPointX = roundNumber(touches[1].clientX - contentRect.left, 5);
  const secondPointY = roundNumber(touches[1].clientY - contentRect.top, 5);

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

  if (!pinchStartScale || pinchStartDistance === null || !currentDistance) {
    throw new Error("Pinch touches distance was not provided");
  }

  if (currentDistance < 0) {
    return contextInstance.transformState.scale;
  }

  const touchProportion = currentDistance / pinchStartDistance;
  const scaleDifference = touchProportion * pinchStartScale;

  return checkZoomBounds(
    roundNumber(scaleDifference, 2),
    minScale,
    maxScale,
    size,
    !disabled && !disablePadding,
  );
};
