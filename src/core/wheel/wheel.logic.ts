/* eslint-disable no-param-reassign */
import { ReactZoomPanPinchContext } from "../../models";
import { handleCallback } from "../../utils/callback.utils";
import { getContext } from "../../utils/context.utils";
import { cancelTimeout } from "../../utils/helpers.utils";
import { handleCancelAnimation } from "../animations/animations.utils";
import { handleCalculateBounds } from "../bounds/bounds.utils";
import {
  getDelta,
  handleCalculateWheelZoom,
  handleWheelZoomStop,
  getMousePosition,
} from "./wheel.utils";
import { handleAlignToScaleBounds } from "../zoom/zoom.logic";
import { handleCalculateZoomPositions } from "../zoom/zoom.utils";

const wheelStopEventTime = 160;
const wheelAnimationTime = 100;

export const handleWheelStart = (
  contextInstance: ReactZoomPanPinchContext,
  event: WheelEvent,
): void => {
  const { onWheelStart, onZoomStart } = contextInstance.props;

  // Every wheel event must stop a running animation, not only the first one
  // of a gesture. The alignment animation scheduled by `handleWheelStop`
  // starts after `wheelAnimationTime` (100 ms) while `wheelStopEventTimer`
  // (160 ms) is still pending; guarding the cancel on the stop timer let that
  // animation overwrite the zoom of any wheel event arriving in between (#582).
  handleCancelAnimation(contextInstance);

  if (!contextInstance.wheelStopEventTimer) {
    handleCallback(getContext(contextInstance), event, onWheelStart);
    handleCallback(getContext(contextInstance), event, onZoomStart);
  }
};

export const handleWheelZoom = (
  contextInstance: ReactZoomPanPinchContext,
  event: WheelEvent,
): void => {
  const { onWheel, onZoom } = contextInstance.props;

  const { contentComponent, setup, state } = contextInstance;
  const { scale } = state;
  const {
    limitToBounds,
    centerZoomedOut,
    zoomAnimation,
    wheel,
    disablePadding,
    smooth,
  } = setup;
  const { size, disabled } = zoomAnimation;
  const { step } = wheel;

  if (!contentComponent) {
    throw new Error("Component not mounted");
  }

  if (event.cancelable) {
    event.preventDefault();
  }
  event.stopPropagation();

  const delta = getDelta(event, null);
  const zoomStep = smooth ? step * Math.abs(event.deltaY) : step;
  const newScale = handleCalculateWheelZoom(
    contextInstance,
    delta,
    zoomStep,
    !event.ctrlKey,
  );

  // if scale not change
  if (scale === newScale) return;

  const bounds = handleCalculateBounds(contextInstance, newScale);

  const mousePosition = getMousePosition(event, contentComponent, scale);

  const isPaddingDisabled =
    disabled || size === 0 || centerZoomedOut || disablePadding;
  const isLimitedToBounds = limitToBounds && isPaddingDisabled;

  const { x, y } = handleCalculateZoomPositions(
    contextInstance,
    mousePosition.x,
    mousePosition.y,
    newScale,
    bounds,
    isLimitedToBounds,
  );

  contextInstance.previousWheelEvent = event;

  contextInstance.setState(newScale, x, y);

  handleCallback(getContext(contextInstance), event, onWheel);
  handleCallback(getContext(contextInstance), event, onZoom);
};

export const handleWheelStop = (
  contextInstance: ReactZoomPanPinchContext,
  event: WheelEvent,
): void => {
  const { onWheelStop, onZoomStop } = contextInstance.props;

  // fire animation
  cancelTimeout(contextInstance.wheelAnimationTimer);
  contextInstance.wheelAnimationTimer = setTimeout(() => {
    if (!contextInstance.mounted) return;
    handleAlignToScaleBounds(contextInstance, event.x, event.y);
    contextInstance.wheelAnimationTimer = null;
    contextInstance.flushResizeAlignment();
  }, wheelAnimationTime);

  // Wheel stop event
  const hasStoppedZooming = handleWheelZoomStop(contextInstance, event);
  if (hasStoppedZooming) {
    cancelTimeout(contextInstance.wheelStopEventTimer);
    contextInstance.wheelStopEventTimer = setTimeout(() => {
      if (!contextInstance.mounted) return;
      contextInstance.wheelStopEventTimer = null;
      handleCallback(getContext(contextInstance), event, onWheelStop);
      handleCallback(getContext(contextInstance), event, onZoomStop);
      contextInstance.flushResizeAlignment();
    }, wheelStopEventTime);
  }
};

export const handleWheelPanningStart = (
  contextInstance: ReactZoomPanPinchContext,
  event: WheelEvent,
): void => {
  const { onWheelStart, onPanningStart } = contextInstance.props;

  // See `handleWheelStart` (#582): cancel on every event, not only the first.
  handleCancelAnimation(contextInstance);

  if (!contextInstance.wheelStopEventTimer) {
    // Same as a mouse pan start: bounds must reflect the current scale and
    // content size, not the ones measured at mount (#396, #433). Only at the
    // start of a wheel sequence though — mid-sequence the gesture owns them
    // (see `handleResizeAlignment`), otherwise a content resize would make
    // the next event clamp against a new limit and jump.
    if (!contextInstance.wheelAnimationTimer) {
      handleCalculateBounds(contextInstance, contextInstance.state.scale);
    }
    handleCallback(getContext(contextInstance), event, onWheelStart);
    handleCallback(getContext(contextInstance), event, onPanningStart);
  }
};

export const handleWheelPanningStop = (
  contextInstance: ReactZoomPanPinchContext,
  event: WheelEvent,
): void => {
  const { onWheelStop, onPanningStop } = contextInstance.props;

  // fire animation
  cancelTimeout(contextInstance.wheelAnimationTimer);
  contextInstance.wheelAnimationTimer = setTimeout(() => {
    if (!contextInstance.mounted) return;
    handleAlignToScaleBounds(contextInstance, event.x, event.y);
    contextInstance.wheelAnimationTimer = null;
    contextInstance.flushResizeAlignment();
  }, wheelAnimationTime);

  // Wheel stop event
  const hasStoppedZooming = handleWheelZoomStop(contextInstance, event);
  if (hasStoppedZooming) {
    cancelTimeout(contextInstance.wheelStopEventTimer);
    contextInstance.wheelStopEventTimer = setTimeout(() => {
      if (!contextInstance.mounted) return;
      contextInstance.wheelStopEventTimer = null;
      handleCallback(getContext(contextInstance), event, onWheelStop);
      handleCallback(getContext(contextInstance), event, onPanningStop);
      contextInstance.flushResizeAlignment();
    }, wheelStopEventTime);
  }
};
