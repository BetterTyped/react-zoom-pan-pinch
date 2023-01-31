/* eslint-disable no-param-reassign */
import {
  PositionType,
  ReactZoomPanPinchContext,
  ReactZoomPanPinchState,
} from "../../models";
import { isExcludedNode } from "../../utils";
import { getMouseBoundedPosition } from "../bounds/bounds.utils";
import { handleCalculateZoomPositions } from "../zoom/zoom.utils";

export const isPanningStartAllowed = (
  contextInstance: ReactZoomPanPinchContext,
  event: MouseEvent | TouchEvent,
): boolean => {
  const { excluded } = contextInstance.setup.panning;
  const { isInitialized, wrapperComponent } = contextInstance;

  const target = event.target as HTMLElement;
  const isWrapperChild = wrapperComponent?.contains(target);
  const isAllowed = isInitialized && target && isWrapperChild;

  if (!isAllowed) return false;

  const isExcluded = isExcludedNode(target, excluded);

  if (isExcluded) return false;

  return true;
};

export const isPanningAllowed = (
  contextInstance: ReactZoomPanPinchContext,
): boolean => {
  const { isInitialized, isPanning, setup } = contextInstance;
  const { disabled } = setup.panning;

  const isAllowed = isInitialized && isPanning && !disabled;

  if (!isAllowed) return false;

  return true;
};

export const handlePanningSetup = (
  contextInstance: ReactZoomPanPinchContext,
  event: MouseEvent,
): void => {
  const { positionX, positionY } = contextInstance.transformState;

  contextInstance.isPanning = true;

  // Panning with mouse
  const x = event.clientX;
  const y = event.clientY;

  contextInstance.startCoords = { x: x - positionX, y: y - positionY };
};

export const handleTouchPanningSetup = (
  contextInstance: ReactZoomPanPinchContext,
  event: TouchEvent,
): void => {
  const { touches } = event;
  const { positionX, positionY } = contextInstance.transformState;

  contextInstance.isPanning = true;

  // Panning with touch
  const oneFingerTouch = touches.length === 1;
  if (oneFingerTouch) {
    const x = touches[0].clientX;
    const y = touches[0].clientY;
    contextInstance.startCoords = { x: x - positionX, y: y - positionY };
  }
};
export function handlePanToBounds(
  contextInstance: ReactZoomPanPinchContext,
): Omit<ReactZoomPanPinchState, "previousScale"> | undefined {
  const { positionX, positionY, scale } = contextInstance.transformState;
  const { disabled, limitToBounds, centerZoomedOut } = contextInstance.setup;
  const { wrapperComponent } = contextInstance;

  if (disabled || !wrapperComponent || !contextInstance.bounds) return;

  const { maxPositionX, minPositionX, maxPositionY, minPositionY } =
    contextInstance.bounds;

  const xChanged = positionX > maxPositionX || positionX < minPositionX;
  const yChanged = positionY > maxPositionY || positionY < minPositionY;

  const mousePosX =
    positionX > maxPositionX
      ? wrapperComponent.offsetWidth
      : contextInstance.setup.minPositionX || 0;
  const mousePosY =
    positionY > maxPositionY
      ? wrapperComponent.offsetHeight
      : contextInstance.setup.minPositionY || 0;

  const { x, y } = handleCalculateZoomPositions(
    contextInstance,
    mousePosX,
    mousePosY,
    scale,
    contextInstance.bounds,
    limitToBounds || centerZoomedOut,
  );

  return {
    scale,
    positionX: xChanged ? x : positionX,
    positionY: yChanged ? y : positionY,
  };
}

export function handlePaddingAnimation(
  contextInstance: ReactZoomPanPinchContext,
  positionX: number,
  positionY: number,
): void {
  const { scale } = contextInstance.transformState;
  const { sizeX, sizeY } = contextInstance.setup.alignmentAnimation;

  if (!sizeX && !sizeY) return;

  contextInstance.setTransformState(scale, positionX, positionY);
}

export function handleNewPosition(
  contextInstance: ReactZoomPanPinchContext,
  newPositionX: number,
  newPositionY: number,
  paddingValueX: number,
  paddingValueY: number,
): void {
  const { limitToBounds } = contextInstance.setup;
  const { wrapperComponent, bounds } = contextInstance;
  const { scale, positionX, positionY } = contextInstance.transformState;

  if (
    wrapperComponent === null ||
    bounds === null ||
    (newPositionX === positionX && newPositionY === positionY)
  ) {
    return;
  }

  const { x, y } = getMouseBoundedPosition(
    newPositionX,
    newPositionY,
    bounds,
    limitToBounds,
    paddingValueX,
    paddingValueY,
    wrapperComponent,
  );

  contextInstance.setTransformState(scale, x, y);
}

export const getPanningClientPosition = (
  contextInstance: ReactZoomPanPinchContext,
  clientX: number,
  clientY: number,
): PositionType => {
  const { startCoords, transformState } = contextInstance;
  const { panning } = contextInstance.setup;
  const { lockAxisX, lockAxisY } = panning;
  const { positionX, positionY } = transformState;

  if (!startCoords) {
    return { x: positionX, y: positionY };
  }

  const mouseX = clientX - startCoords.x;
  const mouseY = clientY - startCoords.y;
  const newPositionX = lockAxisX ? positionX : mouseX;
  const newPositionY = lockAxisY ? positionY : mouseY;

  return { x: newPositionX, y: newPositionY };
};

export const getPaddingValue = (
  contextInstance: ReactZoomPanPinchContext,
  size: number,
): number => {
  const { setup, transformState } = contextInstance;
  const { scale } = transformState;
  const { minScale, disablePadding } = setup;

  if (size > 0 && scale >= minScale && !disablePadding) {
    return size;
  }

  return 0;
};
