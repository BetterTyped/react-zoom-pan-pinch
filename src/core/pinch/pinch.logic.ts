import { ReactZoomPanPinchContext } from "../../models";
import { handleCancelAnimation } from "../animations/animations.utils";
import { handleAlignToScaleBounds } from "../zoom/zoom.logic";
import {
  calculatePinchZoom,
  calculateTouchMidPoint,
  getTouchDistance,
} from "./pinch.utils";
import { handleCalculateBounds } from "../bounds/bounds.utils";
import { handleCalculateZoomPositions } from "../zoom/zoom.utils";

export const handlePinchStart = (
  contextInstance: ReactZoomPanPinchContext,
  event: TouchEvent,
): void => {
  const distance = getTouchDistance(event);

  contextInstance.pinchStartDistance = distance;
  contextInstance.lastDistance = distance;
  contextInstance.pinchStartScale = contextInstance.transformState.scale;
  contextInstance.isPanning = false;

  handleCancelAnimation(contextInstance);
};

export const handlePinchZoom = (
  contextInstance: ReactZoomPanPinchContext,
  event: TouchEvent,
): void => {
  const { contentComponent, pinchStartDistance } = contextInstance;
  const { scale } = contextInstance.transformState;
  const {
    limitToBounds,
    centerZoomedOut,
    zoomAnimation,
  } = contextInstance.setup;
  const { disabled, size } = zoomAnimation;

  // if one finger starts from outside of wrapper
  if (pinchStartDistance === null || !contentComponent) return;

  const midPoint = calculateTouchMidPoint(event, scale, contentComponent);

  // if touches goes off of the wrapper element
  if (!isFinite(midPoint.x) || !isFinite(midPoint.y)) return;

  const currentDistance = getTouchDistance(event);
  const newScale = calculatePinchZoom(contextInstance, currentDistance);

  if (newScale === scale) return;

  const bounds = handleCalculateBounds(contextInstance, newScale);

  const isPaddingDisabled = disabled || size === 0 || centerZoomedOut;
  const isLimitedToBounds = limitToBounds && isPaddingDisabled;

  const { x, y } = handleCalculateZoomPositions(
    contextInstance,
    midPoint.x,
    midPoint.y,
    newScale,
    bounds,
    isLimitedToBounds,
  );

  contextInstance.lastDistance = currentDistance;

  contextInstance.transformState.positionX = x;
  contextInstance.transformState.positionY = y;
  contextInstance.transformState.scale = newScale;
  contextInstance.transformState.previousScale = scale;

  // update component transformation
  contextInstance.applyTransformation();
};

export const handlePinchStop = (
  contextInstance: ReactZoomPanPinchContext,
): void => {
  contextInstance.velocity = null;
  contextInstance.lastDistance = null;
  contextInstance.pinchStartScale = null;
  contextInstance.pinchStartDistance = null;
  handleAlignToScaleBounds(contextInstance);
};
