/* eslint-disable no-param-reassign */
import { DeviceType } from "models";
import { ReactZoomPanPinchContext } from "../../models/context.model";
import { animate, handleCancelAnimation } from "../animations/animations.utils";
import { handleCalculateBounds } from "../bounds/bounds.utils";
import {
  getPaddingValue,
  getPanningClientPosition,
  handleNewPosition,
  handlePanningSetup,
  handlePanToBounds,
  handleTouchPanningSetup,
} from "./panning.utils";
import {
  handleVelocityPanning,
  handleCalculateVelocity,
} from "./velocity.logic";

export function handlePanningStart(
  contextInstance: ReactZoomPanPinchContext,
  event: MouseEvent | TouchEvent,
): void {
  const { scale, positionX, positionY } = contextInstance.state;

  contextInstance.panStartPosition = { x: positionX, y: positionY };
  handleCancelAnimation(contextInstance);
  handleCalculateBounds(contextInstance, scale);
  // Duck-typed: a TouchEvent from another window fails `instanceof` (#290).
  if ("touches" in event) {
    handleTouchPanningSetup(contextInstance, event as TouchEvent);
  } else {
    handlePanningSetup(contextInstance, event as MouseEvent);
  }
}

export function handleAlignToBounds(
  contextInstance: ReactZoomPanPinchContext,
  customAnimationTime?: number,
): void {
  const { scale } = contextInstance.state;
  const { minScale, autoAlignment } = contextInstance.setup;
  const { disabled, sizeX, sizeY, animationTime, animationType } =
    autoAlignment;

  const isDisabled = disabled || scale < minScale || (!sizeX && !sizeY);

  if (isDisabled) return;

  // The content or the wrapper changed size during the gesture (the resize
  // observer postpones its bounds refresh, see `handleResizeAlignment`):
  // align against the current limits so this single animation lands right.
  if (contextInstance.isResizeAlignmentPending) {
    handleCalculateBounds(contextInstance, scale);
  }

  const targetState = handlePanToBounds(contextInstance);

  if (!targetState) return;

  // Nothing to align: starting a 200 ms animation towards the current state
  // would only pin the transform and swallow input that arrives meanwhile
  // (#582).
  const { positionX, positionY } = contextInstance.state;
  const isNoop =
    targetState.positionX === positionX && targetState.positionY === positionY;

  if (!isNoop) {
    animate(
      contextInstance,
      targetState,
      customAnimationTime ?? animationTime,
      animationType,
    );
  }
}

export function handlePanning(
  contextInstance: ReactZoomPanPinchContext,
  clientX: number,
  clientY: number,
  device: DeviceType.MOUSE | DeviceType.TOUCH,
): void {
  const { startCoords, setup } = contextInstance;
  const { sizeX, sizeY } = setup.autoAlignment;

  if (!startCoords) return;

  const { x, y } = getPanningClientPosition(contextInstance, clientX, clientY);
  const paddingValueX = getPaddingValue(contextInstance, sizeX);
  const paddingValueY = getPaddingValue(contextInstance, sizeY);

  handleCalculateVelocity(contextInstance, { x, y }, device);
  handleNewPosition(contextInstance, x, y, paddingValueX, paddingValueY);
}

export function handlePanningEnd(
  contextInstance: ReactZoomPanPinchContext,
  velocityDisabled: boolean,
): void {
  if (contextInstance.isPanning) {
    const { velocity, wrapperComponent, contentComponent } = contextInstance;

    contextInstance.isPanning = false;

    const { positionX, positionY, scale } = contextInstance.state;
    const start = contextInstance.panStartPosition;
    contextInstance.panStartPosition = null;

    if (start) {
      const dx = positionX - start.x;
      const dy = positionY - start.y;
      if (dx * dx + dy * dy <= 25) return;
    }

    contextInstance.isAnimating = false;
    contextInstance.animation = null;

    // See `handleAlignToBounds`: the velocity animation clamps against
    // `bounds`, so they must reflect a size change seen during the pan.
    if (contextInstance.isResizeAlignmentPending) {
      handleCalculateBounds(contextInstance, scale);
    }

    const wrapperWidth = wrapperComponent?.clientWidth || 0;
    const wrapperHeight = wrapperComponent?.clientHeight || 0;
    const contentWidth = (contentComponent?.offsetWidth || 0) * scale;
    const contentHeight = (contentComponent?.offsetHeight || 0) * scale;
    const isContentOverflowing =
      !contextInstance.setup.limitToBounds ||
      wrapperWidth < contentWidth ||
      wrapperHeight < contentHeight;

    const shouldAnimate =
      !velocityDisabled &&
      velocity &&
      velocity.total > 0.1 &&
      isContentOverflowing;

    if (shouldAnimate) {
      handleVelocityPanning(contextInstance);
    } else {
      handleAlignToBounds(contextInstance);
    }
  }
}
