import { animations } from "./animations.constants";

import { AnimationType } from "./animations.types";
import { ReactZoomPanPinchContext } from "../../models/context.model";

const handleCancelAnimationFrame = (animation: AnimationType | null) => {
  if (typeof animation === "number") {
    cancelAnimationFrame(animation);
  }
};

export const handleCancelAnimation = (
  contextInstance: ReactZoomPanPinchContext,
): void => {
  if (!contextInstance.mounted) return;
  handleCancelAnimationFrame(contextInstance.animation);
  // Clear animation state
  contextInstance.animate = null;
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
  contextInstance.animation = () => {
    if (!contextInstance.mounted) {
      return handleCancelAnimationFrame(contextInstance.animation);
    }

    const frameTime = new Date().getTime() - startTime;
    const animationProgress = frameTime / animationTime;
    const animationType = animations[animationName];

    const step = animationType(animationProgress);

    if (frameTime >= animationTime) {
      callback(lastStep);
      contextInstance.animation = null;
    } else if (contextInstance.animation) {
      callback(step);
      requestAnimationFrame(contextInstance.animation);
    }
  };

  requestAnimationFrame(contextInstance.animation);
}

export function animate(
  contextInstance: ReactZoomPanPinchContext,
  targetState: { scale: number; positionX: number; positionY: number },
  animationTime: number,
  animationName: string,
): void {
  if (!contextInstance.mounted) return;
  const { scale, positionX, positionY } = contextInstance.transformState;

  const scaleDiff = targetState.scale - scale;
  const positionXDiff = targetState.positionX - positionX;
  const positionYDiff = targetState.positionY - positionY;

  if (animationTime === 0) {
    contextInstance.transformState.previousScale =
      contextInstance.transformState.scale;
    contextInstance.transformState.scale = targetState.scale;
    contextInstance.transformState.positionX = targetState.positionX;
    contextInstance.transformState.positionY = targetState.positionY;
    contextInstance.handleStylesUpdate();
  } else {
    // animation start timestamp
    handleSetupAnimation(
      contextInstance,
      animationName,
      animationTime,
      (step: number) => {
        contextInstance.transformState.previousScale =
          contextInstance.transformState.scale;
        contextInstance.transformState.scale = scale + scaleDiff * step;
        contextInstance.transformState.positionX =
          positionX + positionXDiff * step;
        contextInstance.transformState.positionY =
          positionY + positionYDiff * step;

        // apply animation changes
        contextInstance.handleStylesUpdate();
      },
    );
  }
}
