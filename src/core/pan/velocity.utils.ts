import { ReactZoomPanPinchContext } from "../../models/context.model";
import { boundLimiter } from "../bounds/bounds.utils";

export const isVelocityCalculationAllowed = (
  contextInstance: ReactZoomPanPinchContext,
): boolean => {
  const { mounted } = contextInstance;
  const { disabled, velocityAnimation } = contextInstance.setup;
  const { scale } = contextInstance.transformState;
  const { disabled: disabledVelocity } = velocityAnimation;

  const isAllowed = !disabledVelocity || scale > 1 || !disabled || mounted;

  if (!isAllowed) return false;

  return true;
};

export const isVelocityAllowed = (
  contextInstance: ReactZoomPanPinchContext,
): boolean => {
  const { mounted, velocity, bounds } = contextInstance;
  const { disabled, velocityAnimation } = contextInstance.setup;
  const { scale } = contextInstance.transformState;
  const { disabled: disabledVelocity } = velocityAnimation;

  const isAllowed = !disabledVelocity || scale > 1 || !disabled || mounted;

  if (!isAllowed) return false;
  if (!velocity || !bounds) return false;

  return true;
};

export function getVelocityMoveTime(
  contextInstance: ReactZoomPanPinchContext,
  velocity: number,
): number {
  const { velocityAnimation } = contextInstance.setup;
  const { equalToMove, animationTime, sensitivity } = velocityAnimation;

  if (equalToMove) {
    return animationTime * velocity * sensitivity;
  }
  return animationTime;
}

export function getVelocityPosition(
  newPosition: number,
  startPosition: number,
  currentPosition: number,
  isLocked: boolean,
  limitToBounds: boolean,
  minPosition: number,
  maxPosition: number,
  minTarget: number,
  maxTarget: number,
  step: number,
): number {
  if (limitToBounds) {
    if (startPosition > maxPosition && currentPosition > maxPosition) {
      const calculatedPosition =
        maxPosition + (newPosition - maxPosition) * step;

      if (calculatedPosition > maxTarget) return maxTarget;
      if (calculatedPosition < maxPosition) return maxPosition;
      return calculatedPosition;
    }
    if (startPosition < minPosition && currentPosition < minPosition) {
      const calculatedPosition =
        minPosition + (newPosition - minPosition) * step;
      if (calculatedPosition < minTarget) return minTarget;
      if (calculatedPosition > minPosition) return minPosition;
      return calculatedPosition;
    }
  }
  if (isLocked) return startPosition;
  return boundLimiter(newPosition, minPosition, maxPosition, limitToBounds);
}
