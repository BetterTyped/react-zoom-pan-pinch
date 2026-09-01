/* eslint-disable no-param-reassign */
import { animations } from "./animations.constants";
import {
  AnimationType,
  ReactZoomPanPinchContext,
  StateType,
} from "../../models";

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
};

export function handleSetupAnimation(
  contextInstance: ReactZoomPanPinchContext,
  animationName: string,
  animationTime: number,
  callback: (step: number) => void,
): void {
  if (!contextInstance.mounted) return;
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
      callback(lastStep);
    } else {
      callback(step);
      contextInstance.animationFrame = requestAnimationFrame(animation);
    }
  };

  contextInstance.animation = animation;
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

export function animate(
  contextInstance: ReactZoomPanPinchContext,
  targetState: StateType,
  animationTime: number,
  animationName: string,
): void {
  const isValid = isValidTargetState(targetState);
  if (!contextInstance.mounted || !isValid) return;

  const { setState } = contextInstance;
  const { scale, positionX, positionY } = contextInstance.state;

  const scaleDiff = targetState.scale - scale;
  const positionXDiff = targetState.positionX - positionX;
  const positionYDiff = targetState.positionY - positionY;

  if (animationTime === 0) {
    setState(targetState.scale, targetState.positionX, targetState.positionY);
  } else {
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
    );
  }
}
