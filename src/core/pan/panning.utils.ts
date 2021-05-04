import {
  PositionType,
  ReactZoomPanPinchContext,
  ReactZoomPanPinchState,
} from "../../models";
import { getMouseBoundedPosition } from "../bounds/bounds.utils";
import { handleCalculatePositions } from "../zoom/wheel.utils";

export const isPanningStartAllowed = (
  contextInstance: ReactZoomPanPinchContext,
  event: MouseEvent,
): boolean => {
  const { excluded } = contextInstance.setup.panning;
  const { isInitialized, wrapperComponent } = contextInstance;

  const target = event.target as HTMLElement;
  const isWrapperChild = wrapperComponent?.contains(target);
  const isAllowed = isInitialized && target && isWrapperChild;

  if (!isAllowed) return false;

  const targetTagName = target.tagName.toUpperCase();
  const isExcludedTag = excluded.find(
    (tag) => tag.toUpperCase() === targetTagName,
  );

  if (isExcludedTag) return false;

  const isExcludedClassName = excluded.find((tag) =>
    target.classList.contains(tag),
  );

  if (isExcludedClassName) return false;

  return true;
};

export const isPanningAllowed = (
  contextInstance: ReactZoomPanPinchContext,
): boolean => {
  const { isInitialized, isMouseDown, setup } = contextInstance;
  const { disabled } = setup.panning;

  const isAllowed = isInitialized && isMouseDown && !disabled;

  if (!isAllowed) return false;

  return true;
};

export const handlePanningSetup = (
  contextInstance: ReactZoomPanPinchContext,
  event: MouseEvent,
): void => {
  const { positionX, positionY } = contextInstance.transformState;

  contextInstance.isMouseDown = true;

  // Panning with mouse
  const x = event.clientX;
  const y = event.clientY;

  contextInstance.startCoords = { x: x - positionX, y: y - positionY };
};

export const handleTouchPanningSetup = (
  contextInstance: ReactZoomPanPinchContext,
  event: TouchEvent,
): void => {
  const touches = event.touches;
  const { positionX, positionY } = contextInstance.transformState;

  contextInstance.isMouseDown = true;

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
  const { disabled, limitToBounds, limitToWrapper } = contextInstance.setup;
  const { wrapperComponent } = contextInstance;

  if (disabled || !wrapperComponent || !contextInstance.bounds) return;

  const {
    maxPositionX,
    minPositionX,
    maxPositionY,
    minPositionY,
  } = contextInstance.bounds;

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

  const { x, y } = handleCalculatePositions(
    contextInstance,
    mousePosX,
    mousePosY,
    scale,
    contextInstance.bounds,
    limitToBounds || limitToWrapper,
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
  const { size } = contextInstance.setup.alignmentAnimation;

  if (!size) return;

  contextInstance.transformState.positionX = positionX;
  contextInstance.transformState.positionY = positionY;
  contextInstance.applyTransformation();
}

export function handleNewPosition(
  contextInstance: ReactZoomPanPinchContext,
  newPositionX: number,
  newPositionY: number,
  paddingValue: number,
): void {
  const { limitToBounds } = contextInstance.setup;
  const { wrapperComponent, bounds } = contextInstance;
  const { positionX, positionY } = contextInstance.transformState;

  const hasPositionXChanged = newPositionX !== positionX;
  const hasPositionYChanged = newPositionY !== positionY;

  const hasNewPosition = !hasPositionXChanged || !hasPositionYChanged;

  if (!wrapperComponent || hasNewPosition || !bounds) {
    return;
  }

  const { x, y } = getMouseBoundedPosition(
    newPositionX,
    newPositionY,
    bounds,
    limitToBounds,
    paddingValue,
    wrapperComponent,
  );

  contextInstance.transformState.positionX = x;
  contextInstance.transformState.positionY = y;
  contextInstance.applyTransformation();
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
): number => {
  const { setup, transformState } = contextInstance;
  const { scale } = transformState;
  const { minScale, alignmentAnimation } = setup;
  const { size } = alignmentAnimation;

  if (size > 0 && scale >= minScale) {
    return size;
  }

  return 0;
};
