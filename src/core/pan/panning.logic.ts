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
  const { scale } = contextInstance.transformState;

  handleCancelAnimation(contextInstance);
  handleCalculateBounds(contextInstance, scale);
  if ((event as any).touches) {
    handleTouchPanningSetup(contextInstance, event as TouchEvent);
  } else {
    handlePanningSetup(contextInstance, event as MouseEvent);
  }
}

export function handlePanning(
  contextInstance: ReactZoomPanPinchContext,
  clientX: number,
  clientY: number,
): void {
  const { startCoords } = contextInstance;

  if (!startCoords) return;

  const { x, y } = getPanningClientPosition(contextInstance, clientX, clientY);
  const paddingValue = getPaddingValue(contextInstance);

  handleCalculateVelocity(contextInstance, { x, y });
  handleNewPosition(contextInstance, x, y, paddingValue);
}

export function handlePanningEnd(
  contextInstance: ReactZoomPanPinchContext,
): void {
  if (contextInstance.isPanning) {
    const { scale } = contextInstance.transformState;
    const { velocityDisabled } = contextInstance.setup.panning;
    const { velocity } = contextInstance;

    contextInstance.isPanning = false;
    contextInstance.animate = false;
    contextInstance.animation = null;
    contextInstance.forceUpdate();

    const isContentBiggerThanWrapper = scale > 1;
    if (
      !velocityDisabled &&
      velocity &&
      velocity.total > 0.1 &&
      isContentBiggerThanWrapper
    ) {
      handleVelocityPanning(contextInstance);
    } else {
      handleAlignToBounds(contextInstance);
    }
  }
}

export function handleAlignToBounds(
  contextInstance: ReactZoomPanPinchContext,
): void {
  const { scale } = contextInstance.transformState;
  const { minScale, alignmentAnimation } = contextInstance.setup;
  const { disabled, size, animationTime, animationType } = alignmentAnimation;

  const isDisabled = disabled || scale < minScale || !size;

  if (isDisabled) return;

  const targetState = handlePanToBounds(contextInstance);

  if (targetState) {
    animate(contextInstance, targetState, animationTime, animationType);
  }
}
