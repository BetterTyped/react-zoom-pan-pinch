import { ReactZoomPanPinchContext, ReactZoomPanPinchState } from "../../models";
import { animations } from "../animations/animations.constants";
import { handleZoomToPoint } from "../zoom/zoom.logic";
import { animate } from "../animations/animations.utils";
import { createState } from "../../utils/state.utils";
import { checkZoomBounds } from "../zoom/zoom.utils";
import {
  getContext,
  getCenterPosition,
  handleCallback,
  roundNumber,
} from "../../utils";
import {
  calculateBounds,
  getMouseBoundedPosition,
} from "../bounds/bounds.utils";

export const handleCalculateButtonZoom = (
  contextInstance: ReactZoomPanPinchContext,
  delta: number,
  step: number,
): number => {
  const { scale } = contextInstance.state;
  const { wrapperComponent, setup } = contextInstance;
  const { maxScale, minScale, zoomAnimation, smooth } = setup;
  const { size } = zoomAnimation;

  if (!wrapperComponent) {
    throw new Error("Wrapper is not mounted");
  }

  const targetScale = smooth
    ? scale * Math.exp(delta * step)
    : scale + delta * step;

  const newScale = checkZoomBounds(
    roundNumber(targetScale, 3),
    minScale,
    maxScale,
    size,
    false,
  );
  return newScale;
};

export function handleZoomToViewCenter(
  contextInstance: ReactZoomPanPinchContext,
  delta: number,
  step: number,
  animationTime: number,
  animationType: keyof typeof animations,
): void {
  const { wrapperComponent } = contextInstance;
  const { scale, positionX, positionY } = contextInstance.state;
  const { zoomAnimation } = contextInstance.setup;

  if (!wrapperComponent) return console.error("No WrapperComponent found");

  const effectiveAnimationTime = zoomAnimation.disabled ? 0 : animationTime;

  const wrapperWidth = wrapperComponent.offsetWidth;
  const wrapperHeight = wrapperComponent.offsetHeight;
  const mouseX = (wrapperWidth / 2 - positionX) / scale;
  const mouseY = (wrapperHeight / 2 - positionY) / scale;

  const newScale = handleCalculateButtonZoom(contextInstance, delta, step);

  const targetState = handleZoomToPoint(
    contextInstance,
    newScale,
    mouseX,
    mouseY,
  );

  if (!targetState) {
    return console.error(
      "Error during zoom event. New transformation state was not calculated.",
    );
  }

  const { onZoomStart, onZoom, onZoomStop } = contextInstance.props;
  const event = new MouseEvent("mousemove", { bubbles: true });
  const ctx = getContext(contextInstance);
  handleCallback(ctx, event, onZoomStart);
  handleCallback(ctx, event, onZoom);
  animate(contextInstance, targetState, effectiveAnimationTime, animationType);
  const win =
    wrapperComponent.ownerDocument?.defaultView ??
    (typeof window !== "undefined" ? window : null);
  if (win) {
    win.setTimeout(() => {
      if (!contextInstance.mounted) return;
      handleCallback(getContext(contextInstance), event, onZoomStop);
    }, effectiveAnimationTime);
  }
}

export function resetTransformations(
  contextInstance: ReactZoomPanPinchContext,
  animationTime: number,
  animationType: keyof typeof animations,
  onResetTransformation?: () => void,
): void {
  const { setup, wrapperComponent, contentComponent } = contextInstance;
  const { limitToBounds, centerOnInit } = setup;
  const initialTransformation = createState(contextInstance.props);
  const { scale, positionX, positionY } = contextInstance.state;

  if (!wrapperComponent) return;

  let targetPositionX = initialTransformation.positionX;
  let targetPositionY = initialTransformation.positionY;

  if (centerOnInit && contentComponent) {
    const centered = getCenterPosition(
      initialTransformation.scale,
      wrapperComponent,
      contentComponent,
    );
    targetPositionX = centered.positionX;
    targetPositionY = centered.positionY;
  }

  const newBounds = calculateBounds(
    contextInstance,
    initialTransformation.scale,
  );

  const boundedPositions = getMouseBoundedPosition(
    targetPositionX,
    targetPositionY,
    newBounds,
    limitToBounds,
    0,
    0,
    wrapperComponent,
  );

  const newState = {
    scale: initialTransformation.scale,
    positionX: boundedPositions.x,
    positionY: boundedPositions.y,
  };

  if (
    scale === initialTransformation.scale &&
    positionX === initialTransformation.positionX &&
    positionY === initialTransformation.positionY
  ) {
    return;
  }

  onResetTransformation?.();

  const { onZoomStart, onZoom, onZoomStop } = contextInstance.props;
  const event = new MouseEvent("mousemove", { bubbles: true });
  const ctx = getContext(contextInstance);
  handleCallback(ctx, event, onZoomStart);
  handleCallback(ctx, event, onZoom);
  animate(contextInstance, newState, animationTime, animationType);
  const win =
    wrapperComponent.ownerDocument?.defaultView ??
    (typeof window !== "undefined" ? window : null);
  if (win) {
    win.setTimeout(() => {
      if (!contextInstance.mounted) return;
      handleCallback(getContext(contextInstance), event, onZoomStop);
    }, animationTime);
  }
}

export function getOffset(
  element: HTMLElement,
  wrapper: HTMLElement,
  content: HTMLElement,
  state: ReactZoomPanPinchState,
) {
  const offset = element.getBoundingClientRect();
  const wrapperOffset = wrapper.getBoundingClientRect();
  const contentOffset = content.getBoundingClientRect();

  const xOff = wrapperOffset.x * state.scale;
  const yOff = wrapperOffset.y * state.scale;

  return {
    x: (offset.x - contentOffset.x + xOff) / state.scale,
    y: (offset.y - contentOffset.y + yOff) / state.scale,
  };
}

export function calculateZoomToNode(
  contextInstance: ReactZoomPanPinchContext,
  node: HTMLElement,
  customZoom?: number,
  customOffsetX = 0,
  customOffsetY = 0,
): { positionX: number; positionY: number; scale: number } {
  const { wrapperComponent, contentComponent, state } = contextInstance;
  const { limitToBounds, minScale, maxScale } = contextInstance.setup;
  if (!wrapperComponent || !contentComponent) return state;

  const wrapperRect = wrapperComponent.getBoundingClientRect();
  const nodeRect = node.getBoundingClientRect();
  const nodeOffset = getOffset(node, wrapperComponent, contentComponent, state);

  const nodeLeft = nodeOffset.x;
  const nodeTop = nodeOffset.y;
  const nodeWidth = nodeRect.width / state.scale;
  const nodeHeight = nodeRect.height / state.scale;

  const scaleX = wrapperComponent.offsetWidth / nodeWidth;
  const scaleY = wrapperComponent.offsetHeight / nodeHeight;

  const newScale = checkZoomBounds(
    customZoom || Math.min(scaleX, scaleY),
    minScale,
    maxScale,
    0,
    false,
  );

  const offsetX = (wrapperRect.width - nodeWidth * newScale) / 2;
  const offsetY = (wrapperRect.height - nodeHeight * newScale) / 2;

  const newPositionX =
    (wrapperRect.left - nodeLeft) * newScale + offsetX + customOffsetX;
  const newPositionY =
    (wrapperRect.top - nodeTop) * newScale + offsetY + customOffsetY;

  const bounds = calculateBounds(contextInstance, newScale);

  const { x, y } = getMouseBoundedPosition(
    newPositionX,
    newPositionY,
    bounds,
    limitToBounds,
    0,
    0,
    wrapperComponent,
  );

  return { positionX: x, positionY: y, scale: newScale };
}
