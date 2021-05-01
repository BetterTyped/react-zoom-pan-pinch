import {
  ReactZoomPanPinchContext,
  ReactZoomPanPinchState,
} from "../../models/context.model";
import { animate } from "../animations/animations.utils";
import { handleCalculatePositions } from "../zoom/wheel.utils";

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

export function handleAlignPositionAnimation(
  contextInstance: ReactZoomPanPinchContext,
): void {
  const { scale } = contextInstance.transformState;
  const { minScale, pan } = contextInstance.setup;
  const { disabled, padding, animationTime, animationType } = pan;

  const isDisabled = disabled || scale < minScale || !padding;

  if (isDisabled) return;

  const targetState = handlePanToBounds(contextInstance);

  if (targetState) {
    animate(contextInstance, targetState, animationTime, animationType);
  }
}
