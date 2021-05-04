import { PositionType } from "../../models";
import { ReactZoomPanPinchContext } from "../../models/context.model";
import { animations } from "../animations/animations.constants";
import { handleSetupAnimation } from "../animations/animations.utils";
import { getPaddingValue } from "./panning.utils";
import {
  getVelocityPosition,
  getVelocityMoveTime,
  isVelocityAllowed,
  isVelocityCalculationAllowed,
} from "./velocity.utils";

export function handleCalculateVelocity(
  contextInstance: ReactZoomPanPinchContext,
  position: PositionType,
): void {
  const isAllowed = isVelocityCalculationAllowed(contextInstance);

  if (!isAllowed) {
    return;
  }

  const { lastMousePosition, velocityTime } = contextInstance;
  const { wrapperComponent } = contextInstance;

  const now = Date.now();
  if (lastMousePosition && velocityTime && wrapperComponent) {
    const distanceX = position.x - lastMousePosition.x;
    const distanceY = position.y - lastMousePosition.y;

    const velocityX = distanceX;
    const velocityY = distanceY;

    const interval = now - velocityTime;
    const speed = distanceX * distanceX + distanceY * distanceY;
    const velocity = Math.sqrt(speed) / interval;

    contextInstance.velocity = { velocityX, velocityY, total: velocity };
  }
  contextInstance.lastMousePosition = position;
  contextInstance.velocityTime = now;
}

export function handleVelocityPanning(
  contextInstance: ReactZoomPanPinchContext,
): void {
  const { velocity, bounds, setup, wrapperComponent } = contextInstance;
  const isAllowed = isVelocityAllowed(contextInstance);

  if (!isAllowed || !velocity || !bounds || !wrapperComponent) {
    return;
  }

  const { velocityX, velocityY, total } = velocity;
  const { maxPositionX, minPositionX, maxPositionY, minPositionY } = bounds;
  const { limitToBounds, alignmentAnimation } = setup;
  const { zoomAnimation, panning } = setup;
  const { lockAxisY, lockAxisX } = panning;
  const { animationType } = zoomAnimation;

  const alignAnimationTime = alignmentAnimation.animationTime * 2;
  const moveAnimationTime = getVelocityMoveTime(contextInstance, total);
  const finalAnimationTime = Math.max(moveAnimationTime, alignAnimationTime);

  const paddingValue = getPaddingValue(contextInstance);
  const paddingX = (paddingValue * wrapperComponent.offsetWidth) / 100;
  const paddingY = (paddingValue * wrapperComponent.offsetHeight) / 100;
  const maxTargetX = maxPositionX + paddingX;
  const minTargetX = minPositionX - paddingX;

  const maxTargetY = maxPositionY + paddingY;
  const minTargetY = minPositionY - paddingY;

  const startState = contextInstance.transformState;

  const startTime = new Date().getTime();
  handleSetupAnimation(
    contextInstance,
    animationType,
    finalAnimationTime,
    (step: number) => {
      const { positionX, positionY } = contextInstance.transformState;
      const frameTime = new Date().getTime() - startTime;
      const animationProgress = frameTime / alignAnimationTime;
      const alignAnimation = animations[alignmentAnimation.animationType];
      const alignStep = 1 - alignAnimation(Math.min(1, animationProgress));

      const customStep = 1 - step;

      const newPositionX = positionX + velocityX * customStep;
      const newPositionY = positionY + velocityY * customStep;

      const currentPositionX = getVelocityPosition(
        newPositionX,
        startState.positionX,
        positionX,
        lockAxisX,
        limitToBounds,
        minPositionX,
        maxPositionX,
        minTargetX,
        maxTargetX,
        alignStep,
      );
      const currentPositionY = getVelocityPosition(
        newPositionY,
        startState.positionY,
        positionY,
        lockAxisY,
        limitToBounds,
        minPositionY,
        maxPositionY,
        minTargetY,
        maxTargetY,
        alignStep,
      );

      if (positionX !== newPositionX || positionY !== newPositionY) {
        contextInstance.transformState.positionX = currentPositionX;
        contextInstance.transformState.positionY = currentPositionY;
        contextInstance.applyTransformation();
      }
    },
  );
}