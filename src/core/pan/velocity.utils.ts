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
  const { equalToMove, animationTime } = velocityAnimation;

  if (equalToMove) {
    return animationTime / (velocity / 2);
  }
  return animationTime;
}

export function getVelocityPosition(
  newPosition: number,
  position: number,
  minPosition: number,
  maxPosition: number,
  minTarget: number,
  maxTarget: number,
  limitToBounds: boolean,
  lockAxis: boolean,
  velocity: number,
): number {
  if (limitToBounds) {
    if (newPosition > minPosition && newPosition > maxPosition) {
      const calculatedPosition = position * velocity;
      if (calculatedPosition > maxTarget) return maxTarget;
      if (calculatedPosition < maxPosition) return maxPosition;
      return calculatedPosition;
    }
    if (position < minPosition && newPosition < minPosition) {
      const calculatedPosition = position * velocity;
      if (calculatedPosition < minTarget) return minTarget;
      if (calculatedPosition > minPosition) return minPosition;
      return calculatedPosition;
    }
  }
  if (lockAxis) return position;
  const offsetPosition = position * velocity;
  return boundLimiter(
    position - offsetPosition,
    minPosition,
    maxPosition,
    limitToBounds,
  );
}
