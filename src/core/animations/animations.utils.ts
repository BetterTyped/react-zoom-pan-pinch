/* eslint-disable no-param-reassign */
import { animations } from "./animations.constants";
import {
  AnimationType,
  ReactZoomPanPinchContext,
  StateType,
} from "../../models";

const settleAnimation = (contextInstance: ReactZoomPanPinchContext): void => {
  const resolve = contextInstance.animationResolve;
  contextInstance.animationResolve = null;
  resolve?.();
};

export const handleCancelAnimation = (
  contextInstance: ReactZoomPanPinchContext,
): void => {
  if (contextInstance.animationFrame !== null) {
    cancelAnimationFrame(contextInstance.animationFrame);
  }
  // Clear animation state
  contextInstance.animationFrame = null;
  contextInstance.isAnimating = false;
  contextInstance.animation = null;
  contextInstance.velocity = null;
  // An interrupted animation still settles its promise so callers awaiting
  // `zoomIn()` & co. are never left hanging (#214).
  settleAnimation(contextInstance);
};

export function handleSetupAnimation(
  contextInstance: ReactZoomPanPinchContext,
  animationName: string,
  animationTime: number,
  callback: (step: number) => void,
  onFinish?: () => void,
): void {
  if (!contextInstance.mounted) {
    onFinish?.();
    return;
  }
  const startTime = new Date().getTime();
  const lastStep = 1;

  // if another animation is active
  handleCancelAnimation(contextInstance);

  // new animation
  const animation: AnimationType = () => {
    // A frame that was already queued when this animation got cancelled or
    // replaced must not run: it would apply a stale target and re-schedule
    // the replacement animation a second time per frame.
    if (!contextInstance.mounted || contextInstance.animation !== animation) {
      return;
    }

    const frameTime = new Date().getTime() - startTime;
    const animationProgress = frameTime / animationTime;
    const animationType = animations[animationName as keyof typeof animations];

    const step = animationType(animationProgress);

    if (frameTime >= animationTime) {
      // Clear before the final step so a callback that starts a new
      // animation (e.g. from onTransform) is not wiped out afterwards.
      contextInstance.animation = null;
      contextInstance.animationFrame = null;
      const resolve = contextInstance.animationResolve;
      contextInstance.animationResolve = null;
      callback(lastStep);
      resolve?.();
      // A resize seen while this animation ran aligns its final state.
      contextInstance.flushResizeAlignment();
    } else {
      callback(step);
      contextInstance.animationFrame = requestAnimationFrame(animation);
    }
  };

  contextInstance.animation = animation;
  contextInstance.animationResolve = onFinish ?? null;
  contextInstance.animationFrame = requestAnimationFrame(animation);
}

function isValidTargetState(targetState: StateType): boolean {
  const { scale, positionX, positionY } = targetState;

  if (
    Number.isNaN(scale) ||
    Number.isNaN(positionX) ||
    Number.isNaN(positionY)
  ) {
    return false;
  }

  return true;
}

/**
 * Animates the transform to `targetState`.
 *
 * Resolves once the final frame has been applied. It also resolves — never
 * rejects — when the animation is interrupted by another animation or a user
 * gesture, when the instance unmounts, or when the target is invalid, so the
 * returned promise is always safe to await (#214).
 */
export function animate(
  contextInstance: ReactZoomPanPinchContext,
  targetState: StateType,
  animationTime: number,
  animationName: string,
): Promise<void> {
  const isValid = isValidTargetState(targetState);
  if (!contextInstance.mounted || !isValid) return Promise.resolve();

  const { setState } = contextInstance;
  const { scale, positionX, positionY } = contextInstance.state;

  const scaleDiff = targetState.scale - scale;
  const positionXDiff = targetState.positionX - positionX;
  const positionYDiff = targetState.positionY - positionY;

  if (animationTime === 0) {
    setState(targetState.scale, targetState.positionX, targetState.positionY);
    return Promise.resolve();
  }

  return new Promise<void>((resolve) => {
    // animation start timestamp
    handleSetupAnimation(
      contextInstance,
      animationName,
      animationTime,
      (step: number) => {
        if (step !== 1) {
          contextInstance.isAnimating = true;
        } else {
          contextInstance.isAnimating = false;
        }
        const newScale = scale + scaleDiff * step;
        const newPositionX = positionX + positionXDiff * step;
        const newPositionY = positionY + positionYDiff * step;

        setState(newScale, newPositionX, newPositionY);
      },
      resolve,
    );
  });
}
