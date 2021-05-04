import { PositionType } from "../../models";
import { ReactZoomPanPinchContext } from "../../models/context.model";
import { animations } from "../animations/animations.constants";
import {
  handleCancelAnimation,
  handleSetupAnimation,
} from "../animations/animations.utils";
import { getPaddingValue } from "./panning.utils";
import {
  getVelocityPosition,
  getVelocityMoveTime,
  isVelocityAllowed,
  isVelocityCalculationAllowed,
} from "./velocity.utils";

const velocityMinSpeed = 100;
const throttleTime = 30;
var FRICTION_COEFF = 0.95;
var BOUNCE = 0.2;

export function handleCalculateVelocity(
  contextInstance: ReactZoomPanPinchContext,
  position: PositionType,
): void {
  const isAllowed = isVelocityCalculationAllowed(contextInstance);

  if (!isAllowed) {
    return;
  }

  const { lastMousePosition, velocityTime } = contextInstance;
  const { transformState, wrapperComponent } = contextInstance;
  const { scale } = transformState;

  const now = Date.now();
  if (lastMousePosition && velocityTime && wrapperComponent) {
    const distanceX = position.x - lastMousePosition.x;
    const distanceY = position.y - lastMousePosition.y;

    const velocityX = distanceX * scale;
    const velocityY = distanceY * scale;

    const interval = now - velocityTime;
    const speed = distanceX * distanceX + distanceY * distanceY;
    const velocity = Math.sqrt(speed) / interval / scale;

    contextInstance.velocity = { velocityX, velocityY, total: velocity };
  }
  contextInstance.lastMousePosition = position;
  contextInstance.velocityTime = now;
}

export function handleVelocityPanning(
  contextInstance: ReactZoomPanPinchContext,
): void {
  const { velocity, bounds, setup, wrapperComponent } = contextInstance;
  const { positionX, positionY } = contextInstance.transformState;
  const isAllowed = isVelocityAllowed(contextInstance);

  if (!isAllowed || !velocity || !bounds || !wrapperComponent) {
    return;
  }

  const { velocityX, velocityY, total } = velocity;
  const { maxPositionX, minPositionX, maxPositionY, minPositionY } = bounds;
  const { limitToBounds } = setup;
  const { zoomAnimation, velocityAnimation, panning } = setup;
  const { animationTime } = velocityAnimation;
  const { lockAxisY, lockAxisX } = panning;
  const { animationType } = zoomAnimation;

  const moveAnimationTime = getVelocityMoveTime(contextInstance, total);
  // const paddingValue = getPaddingValue(contextInstance);

  // const paddingX = (paddingValue * wrapperComponent.offsetWidth) / 100;
  // const paddingY = (paddingValue * wrapperComponent.offsetHeight) / 100;
  // const maxTargetX = maxPositionX + paddingX;
  // const minTargetX = minPositionX - paddingX;

  // const maxTargetY = maxPositionY + paddingY;
  // const minTargetY = minPositionY - paddingY;

  // const startTime = new Date().getTime();

  handleSetupAnimation(
    contextInstance,
    animationType,
    moveAnimationTime,
    (step: number) => {
      const { positionX, positionY } = contextInstance.transformState;

      const newPositionX = positionX + velocityX * (1 - step);
      const newPositionY = positionY + velocityY * (1 - step);

      if (positionX !== newPositionX || positionY !== newPositionY) {
        contextInstance.transformState.positionX = newPositionX;
        contextInstance.transformState.positionY = newPositionY;
        contextInstance.applyTransformation();
      }
    },
  );
}
