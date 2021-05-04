import { ReactZoomPanPinchContext } from "../../models/context.model";
import { animate, handleCancelAnimation } from "../animations/animations.utils";
import { handleCalculateBounds } from "../bounds/bounds.utils";
import {
  getPaddingValue,
  getPanningClientPosition,
  handleNewPosition,
  handlePanningSetup,
  handlePanToBounds,
} from "./panning.utils";
import {
  handleVelocityPanning,
  handleCalculateVelocity,
} from "./velocity.logic";

export function handlePanningStart(
  contextInstance: ReactZoomPanPinchContext,
  event: MouseEvent,
): void {
  const { scale } = contextInstance.transformState;

  handleCancelAnimation(contextInstance);
  handleCalculateBounds(contextInstance, scale);
  handlePanningSetup(contextInstance, event);
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
  if (contextInstance.isMouseDown) {
    const { scale } = contextInstance.transformState;
    const { velocityDisabled } = contextInstance.setup.panning;
    const { velocity } = contextInstance;

    contextInstance.isMouseDown = false;
    contextInstance.animate = false;
    contextInstance.animation = null;
    // handleCallback(this.props.onPanningStop, this.getCallbackProps());

    contextInstance.forceUpdate();

    const isContentBiggerThanWrapper = scale > 1;

    if (!velocityDisabled && velocity && isContentBiggerThanWrapper) {
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
