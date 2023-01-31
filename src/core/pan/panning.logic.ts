/* eslint-disable no-param-reassign */
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
  if (window.TouchEvent !== undefined && event instanceof TouchEvent) {
    handleTouchPanningSetup(contextInstance, event as TouchEvent);
  } else {
    handlePanningSetup(contextInstance, event as MouseEvent);
  }
}

export function handleAlignToBounds(
  contextInstance: ReactZoomPanPinchContext,
): void {
  const { scale } = contextInstance.transformState;
  const { minScale, alignmentAnimation } = contextInstance.setup;
  const { disabled, sizeX, sizeY, animationTime, animationType } =
    alignmentAnimation;

  const isDisabled = disabled || scale < minScale || (!sizeX && !sizeY);

  if (isDisabled) return;

  const targetState = handlePanToBounds(contextInstance);

  if (targetState) {
    animate(contextInstance, targetState, animationTime, animationType);
  }
}

export function handlePanning(
  contextInstance: ReactZoomPanPinchContext,
  clientX: number,
  clientY: number,
): void {
  const { startCoords, setup } = contextInstance;
  const { sizeX, sizeY } = setup.alignmentAnimation;

  if (!startCoords) return;

  const { x, y } = getPanningClientPosition(contextInstance, clientX, clientY);
  const paddingValueX = getPaddingValue(contextInstance, sizeX);
  const paddingValueY = getPaddingValue(contextInstance, sizeY);

  handleCalculateVelocity(contextInstance, { x, y });
  handleNewPosition(contextInstance, x, y, paddingValueX, paddingValueY);
}

export function handlePanningEnd(
  contextInstance: ReactZoomPanPinchContext,
): void {
  if (contextInstance.isPanning) {
    const { velocityDisabled } = contextInstance.setup.panning;
    const { velocity, wrapperComponent, contentComponent } = contextInstance;

    contextInstance.isPanning = false;
    contextInstance.animate = false;
    contextInstance.animation = null;

    const wrapperRect = wrapperComponent?.getBoundingClientRect();
    const contentRect = contentComponent?.getBoundingClientRect();

    const wrapperWidth = wrapperRect?.width || 0;
    const wrapperHeight = wrapperRect?.height || 0;
    const contentWidth = contentRect?.width || 0;
    const contentHeight = contentRect?.height || 0;
    const isZoomed =
      wrapperWidth < contentWidth || wrapperHeight < contentHeight;

    const shouldAnimate =
      !velocityDisabled && velocity && velocity?.total > 0.1 && isZoomed;

    if (shouldAnimate) {
      handleVelocityPanning(contextInstance);
    } else {
      handleAlignToBounds(contextInstance);
    }
  }
}
