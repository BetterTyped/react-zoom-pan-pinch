/* eslint-disable no-param-reassign */
import { DeviceType, PositionType } from "../../models";
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

export function getSizeMultiplier(wrapperComponent: HTMLDivElement): number {
  const defaultMultiplier = 1;
  const value = wrapperComponent.offsetWidth / window.innerWidth;

  if (isNaN(value)) {
    return defaultMultiplier;
  }

  return Math.min(defaultMultiplier, value);
}

const getMinMaxVelocity = (
  velocity: number,
  maxStrength: number,
  sensitivity: number,
) => {
  const defaultMultiplier = 0;
  const value = velocity * sensitivity;
  if (isNaN(value)) {
    return defaultMultiplier;
  }
  if (velocity < 0) {
    return Math.max(value, -maxStrength);
  }
  return Math.min(value, maxStrength);
};

export function handleCalculateVelocity(
  contextInstance: ReactZoomPanPinchContext,
  position: PositionType,
  device: DeviceType.MOUSE | DeviceType.TOUCH,
): void {
  const isAllowed = isVelocityCalculationAllowed(contextInstance);

  if (!isAllowed) {
    return;
  }

  const { lastMousePosition, velocityTime, setup } = contextInstance;
  const { wrapperComponent } = contextInstance;
  const {
    maxStrengthMouse,
    maxStrengthTouch,
    sensitivityTouch,
    sensitivityMouse,
  } = setup.velocityAnimation;

  const now = Date.now();
  if (lastMousePosition && velocityTime && wrapperComponent) {
    const sizeMultiplier = getSizeMultiplier(wrapperComponent);
    const sensitivity = {
      [DeviceType.TOUCH]: sensitivityTouch,
      [DeviceType.MOUSE]: sensitivityMouse,
    }[device];
    const maxStrength = {
      [DeviceType.TOUCH]: maxStrengthTouch,
      [DeviceType.MOUSE]: maxStrengthMouse,
    }[device];

    const distanceX = position.x - lastMousePosition.x;
    const distanceY = position.y - lastMousePosition.y;

    const velocityX = getMinMaxVelocity(
      distanceX / sizeMultiplier,
      maxStrength,
      sensitivity,
    );
    const velocityY = getMinMaxVelocity(
      distanceY / sizeMultiplier,
      maxStrength,
      sensitivity,
    );

    const interval = now - velocityTime;
    const speed = distanceX * distanceX + distanceY * distanceY;
    const velocity = getMinMaxVelocity(
      Math.sqrt(speed) / interval,
      maxStrength,
      sensitivity,
    );

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
  const { limitToBounds, autoAlignment } = setup;
  const { zoomAnimation, panning } = setup;
  const { lockAxisY, lockAxisX } = panning;
  const { animationType } = zoomAnimation;
  const { sizeX, sizeY, velocityAlignmentTime } = autoAlignment;

  const alignAnimationTime = velocityAlignmentTime;
  const moveAnimationTime = getVelocityMoveTime(contextInstance, total);
  const finalAnimationTime = Math.max(moveAnimationTime, alignAnimationTime);

  const paddingValueX = getPaddingValue(contextInstance, sizeX);
  const paddingValueY = getPaddingValue(contextInstance, sizeY);
  const paddingX = (paddingValueX * wrapperComponent.offsetWidth) / 100;
  const paddingY = (paddingValueY * wrapperComponent.offsetHeight) / 100;
  const maxTargetX = maxPositionX + paddingX;
  const minTargetX = minPositionX - paddingX;

  const maxTargetY = maxPositionY + paddingY;
  const minTargetY = minPositionY - paddingY;

  const startState = contextInstance.state;

  const startTime = new Date().getTime();
  handleSetupAnimation(
    contextInstance,
    animationType,
    finalAnimationTime,
    (step: number) => {
      const { scale, positionX, positionY } = contextInstance.state;
      const frameTime = new Date().getTime() - startTime;
      const animationProgress = frameTime / alignAnimationTime;
      const alignAnimation = animations[autoAlignment.animationType];
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
        contextInstance.setState(scale, currentPositionX, currentPositionY);
      }
    },
  );
}
