/* eslint-disable no-param-reassign */
import { ReactZoomPanPinchContext } from "../../models";
import { handleCancelAnimation } from "../animations/animations.utils";
import { handleAlignToScaleBounds } from "../zoom/zoom.logic";
import {
  calculatePinchZoom,
  calculateTouchMidPoint,
  getTouchDistance,
} from "./pinch.utils";
import {
  getMouseBoundedPosition,
  handleCalculateBounds,
} from "../bounds/bounds.utils";
import { handleCalculateZoomPositions } from "../zoom/zoom.utils";
import { getPaddingValue } from "core/pan/panning.utils";

const getTouchCenter = (event: TouchEvent) => {
  let totalX = 0;
  let totalY = 0;
  // Sum up the positions of all touches
  for (let i = 0; i < 2; i++) {
    totalX += event.touches[i].clientX;
    totalY += event.touches[i].clientY;
  }

  // Calculate the average position
  const x = totalX / 2;
  const y = totalY / 2;

  return { x, y };
};

export const handlePinchStart = (
  contextInstance: ReactZoomPanPinchContext,
  event: TouchEvent,
): void => {
  const distance = getTouchDistance(event);
  contextInstance.pinchStartDistance = distance;
  contextInstance.lastDistance = distance;
  contextInstance.pinchStartScale = contextInstance.state.scale;
  contextInstance.isPanning = false;

  contextInstance.pinchPreviousCenter = getTouchCenter(event);

  handleCancelAnimation(contextInstance);
};

export const handlePinchZoom = (
  contextInstance: ReactZoomPanPinchContext,
  event: TouchEvent,
): void => {
  const {
    contentComponent,
    pinchStartDistance,
    wrapperComponent,
    pinchPreviousCenter,
  } = contextInstance;
  const { scale } = contextInstance.state;
  const {
    limitToBounds,
    centerZoomedOut,
    zoomAnimation,
    alignmentAnimation,
    pinch,
    panning,
  } = contextInstance.setup;
  const { disabled, size } = zoomAnimation;
  const { allowPanning } = pinch;

  // if one finger starts from outside of wrapper
  if (pinchStartDistance === null || !contentComponent) return;
  const midPoint = calculateTouchMidPoint(event, scale, contentComponent);
  // if touches goes off of the wrapper element
  if (!Number.isFinite(midPoint.x) || !Number.isFinite(midPoint.y)) return;
  const currentDistance = getTouchDistance(event);
  const newScale = calculatePinchZoom(contextInstance, currentDistance);

  const center = getTouchCenter(event);

  // pan should be scale invariant.
  const scaleDiff = scale / newScale;

  const panX = (center.x - (pinchPreviousCenter?.x || 0)) * scaleDiff;
  const panY = (center.y - (pinchPreviousCenter?.y || 0)) * scaleDiff;

  if (newScale === scale && 0 == panX && 0 == panY) return;

  contextInstance.pinchPreviousCenter = center;

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
  contextInstance.pinchMidpoint = midPoint;
  contextInstance.lastDistance = currentDistance;

  if (panning.disabled || !allowPanning) {
    contextInstance.setState(newScale, x, y);
  } else {
    const { sizeX, sizeY } = alignmentAnimation;
    const paddingValueX = getPaddingValue(contextInstance, sizeX, newScale);
    const paddingValueY = getPaddingValue(contextInstance, sizeY, newScale);

    const newPositionX = x + panX;
    const newPositionY = y + panY;
    const { x: finalX, y: finalY } = getMouseBoundedPosition(
      newPositionX,
      newPositionY,
      bounds,
      limitToBounds,
      paddingValueX,
      paddingValueY,
      wrapperComponent,
    );
    contextInstance.setState(newScale, finalX, finalY);
  }
};

export const handlePinchStop = (
  contextInstance: ReactZoomPanPinchContext,
): void => {
  const { pinchMidpoint } = contextInstance;
  contextInstance.velocity = null;
  contextInstance.lastDistance = null;
  contextInstance.pinchMidpoint = null;
  contextInstance.pinchStartScale = null;
  contextInstance.pinchStartDistance = null;
  handleAlignToScaleBounds(contextInstance, pinchMidpoint?.x, pinchMidpoint?.y);
};
