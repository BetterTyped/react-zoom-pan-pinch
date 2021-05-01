import { ReactZoomPanPinchContext } from "../../models";
import { handleCallback } from "../../utils/callback.utils";
import { getContext } from "../../utils/context.utils";
import { cancelTimeout } from "../../utils/helpers.utils";
import { animate, handleCancelAnimation } from "../animations/animations.utils";
import { handleAlignPositionAnimation } from "../pan/pan.logic";
import { handleWheelZoomStop, useWheelZoom } from "./wheel.utils";
import { handleZoomToPoint } from "./zoom.logic";

const wheelStopEventTime = 160;
const wheelAnimationTime = 100;

export const handleWheelStart = (
  contextInstance: ReactZoomPanPinchContext,
): void => {
  const { scale } = contextInstance.transformState;
  const { onWheelStart } = contextInstance.setup;

  if (!contextInstance.wheelStopEventTimer) {
    contextInstance.lastScale = scale;
    handleCancelAnimation(contextInstance);
    handleCallback(onWheelStart, getContext(contextInstance));
  }
};

export const handleWheelZoom = (
  contextInstance: ReactZoomPanPinchContext,
  event: WheelEvent,
): void => {
  const { onWheel } = contextInstance.setup;

  useWheelZoom(contextInstance, event);
  handleCallback(onWheel, getContext(contextInstance));
  contextInstance.handleStylesUpdate();
  contextInstance.previousWheelEvent = event;
  contextInstance.lastScale = contextInstance.transformState.scale;
};

export const handleWheelStop = (
  contextInstance: ReactZoomPanPinchContext,
  event: WheelEvent,
): void => {
  const { onWheelStop } = contextInstance.setup;

  // fire animation
  cancelTimeout(contextInstance.wheelAnimationTimer);
  contextInstance.wheelAnimationTimer = setTimeout(() => {
    if (!contextInstance.mounted) return;
    handleAlignScaleAnimation(contextInstance, event);
    contextInstance.wheelAnimationTimer = null;
  }, wheelAnimationTime);

  // Wheel stop event
  const hasStoppedZooming = handleWheelZoomStop(contextInstance, event);
  if (hasStoppedZooming) {
    cancelTimeout(contextInstance.wheelStopEventTimer);
    contextInstance.wheelStopEventTimer = setTimeout(() => {
      if (!contextInstance.mounted) return;
      handleCallback(onWheelStop, getContext(contextInstance));
      contextInstance.wheelStopEventTimer = null;
    }, wheelStopEventTime);
  }
};

export function handleAlignScaleAnimation(
  contextInstance: ReactZoomPanPinchContext,
  event: WheelEvent,
): void {
  const { scale } = contextInstance.transformState;
  const { wrapperComponent } = contextInstance;
  const { minScale, limitToBounds, scalePadding } = contextInstance.setup;
  const { disabled, animationTime, animationType } = scalePadding;

  const isDisabled = disabled || scale >= minScale;

  if (scale >= 1 || limitToBounds) {
    // fire fit to bounds animation
    handleAlignPositionAnimation(contextInstance);
  }

  if (isDisabled || !wrapperComponent || !contextInstance.mounted) return;

  const mouseX = wrapperComponent.offsetWidth / 2;
  const mouseY = wrapperComponent.offsetHeight / 2;

  const targetState = handleZoomToPoint(
    contextInstance,
    false,
    minScale,
    mouseX,
    mouseY,
    event,
  );

  if (targetState) {
    animate(contextInstance, targetState, animationTime, animationType);
  }
}
