/* eslint-disable no-param-reassign */
import {
  PositionType,
  ReactZoomPanPinchContext,
  ReactZoomPanPinchState,
} from "../../models";
import {
  isDraggableTarget,
  isEditableTarget,
  isExcludedNode,
} from "../../utils";
import { getMouseBoundedPosition } from "../bounds/bounds.utils";
import { handleCalculateZoomPositions } from "../zoom/zoom.utils";

export const isPanningStartAllowed = (
  contextInstance: ReactZoomPanPinchContext,
  event: MouseEvent | TouchEvent,
): boolean => {
  const { excluded } = contextInstance.setup.panning;
  const { isInitialized, wrapperComponent } = contextInstance;

  const target = event.target as HTMLElement;
  // `composedPath()` also lists the nodes inside a shadow root (#371) and the
  // real target in another window (portal, popup) whose nodes fail an
  // `instanceof Element` check from this realm (#290, PR #552): only
  // duck-typed node checks are safe here.
  const isElementNode = (node: unknown): node is Element =>
    !!node &&
    typeof node === "object" &&
    (node as Node).nodeType === 1 &&
    typeof (node as Element).contains === "function";
  const isWrapperChild =
    typeof event.composedPath === "function"
      ? event
          .composedPath()
          .some(
            (node) => isElementNode(node) && !!wrapperComponent?.contains(node),
          )
      : !!wrapperComponent?.contains(target);

  const isAllowed = isInitialized && target && isWrapperChild;

  if (!isAllowed) return false;

  const isExcluded = isExcludedNode(target, excluded);

  if (isExcluded) return false;

  if (isDraggableTarget(target) || isEditableTarget(target)) {
    return false;
  }

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
  const { positionX, positionY } = contextInstance.state;

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
  const { positionX, positionY } = contextInstance.state;

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
  const { positionX, positionY, scale } = contextInstance.state;
  const { disabled, limitToBounds, centerZoomedOut } = contextInstance.setup;
  const { wrapperComponent } = contextInstance;

  if (disabled || !wrapperComponent || !contextInstance.bounds) return;

  const { maxPositionX, minPositionX, maxPositionY, minPositionY } =
    contextInstance.bounds;

  const xChanged = positionX > maxPositionX || positionX < minPositionX;
  const yChanged = positionY > maxPositionY || positionY < minPositionY;

  const mousePosX =
    positionX > maxPositionX
      ? wrapperComponent.clientWidth
      : contextInstance.setup.minPositionX || 0;
  const mousePosY =
    positionY > maxPositionY
      ? wrapperComponent.clientHeight
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
  const { scale } = contextInstance.state;
  const { sizeX, sizeY } = contextInstance.setup.autoAlignment;

  if (!sizeX && !sizeY) return;

  contextInstance.setState(scale, positionX, positionY);
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
  const { scale, positionX, positionY } = contextInstance.state;

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

  contextInstance.setState(scale, x, y);
}

export const getPanningClientPosition = (
  contextInstance: ReactZoomPanPinchContext,
  clientX: number,
  clientY: number,
): PositionType => {
  const { startCoords, state } = contextInstance;
  const { panning } = contextInstance.setup;
  const { lockAxisX, lockAxisY } = panning;
  const { positionX, positionY } = state;

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
  explicitScale?: number,
): number => {
  const { setup, state } = contextInstance;
  const { minScale, disablePadding, centerZoomedOut } = setup;

  const scale = explicitScale ?? state.scale;

  if (size > 0 && scale >= minScale && !disablePadding && !centerZoomedOut) {
    return size;
  }

  return 0;
};
