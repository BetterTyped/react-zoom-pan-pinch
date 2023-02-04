import { ReactZoomPanPinchContext, ReactZoomPanPinchState } from "../../models";
import { animations } from "../animations/animations.constants";
import { handleZoomToPoint } from "../zoom/zoom.logic";
import { animate } from "../animations/animations.utils";
import { createState } from "../../utils/state.utils";
import { checkZoomBounds } from "../zoom/zoom.utils";
import { roundNumber } from "../../utils";
import {
  calculateBounds,
  getMouseBoundedPosition,
} from "../bounds/bounds.utils";

export const handleCalculateButtonZoom = (
  contextInstance: ReactZoomPanPinchContext,
  delta: number,
  step: number,
): number => {
  const { scale } = contextInstance.transformState;
  const { wrapperComponent, setup } = contextInstance;
  const { maxScale, minScale, zoomAnimation } = setup;
  const { size } = zoomAnimation;

  if (!wrapperComponent) {
    throw new Error("Wrapper is not mounted");
  }

  const targetScale = scale * Math.exp(delta * step);

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
  const { scale, positionX, positionY } = contextInstance.transformState;

  if (!wrapperComponent) return console.error("No WrapperComponent found");

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

  animate(contextInstance, targetState, animationTime, animationType);
}

export function resetTransformations(
  contextInstance: ReactZoomPanPinchContext,
  animationTime: number,
  animationType: keyof typeof animations,
  onResetTransformation?: () => void,
): void {
  const { setup, wrapperComponent } = contextInstance;
  const { limitToBounds } = setup;
  const initialTransformation = createState(contextInstance.props);
  const { scale, positionX, positionY } = contextInstance.transformState;

  if (!wrapperComponent) return;

  const newBounds = calculateBounds(
    contextInstance,
    initialTransformation.scale,
  );

  const boundedPositions = getMouseBoundedPosition(
    initialTransformation.positionX,
    initialTransformation.positionY,
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
  animate(contextInstance, newState, animationTime, animationType);
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
): { positionX: number; positionY: number; scale: number } {
  const { wrapperComponent, contentComponent, transformState } =
    contextInstance;
  const { limitToBounds, minScale, maxScale } = contextInstance.setup;
  if (!wrapperComponent || !contentComponent) return transformState;

  const wrapperRect = wrapperComponent.getBoundingClientRect();
  const nodeRect = node.getBoundingClientRect();
  const nodeOffset = getOffset(
    node,
    wrapperComponent,
    contentComponent,
    transformState,
  );

  const nodeLeft = nodeOffset.x;
  const nodeTop = nodeOffset.y;
  const nodeWidth = nodeRect.width / transformState.scale;
  const nodeHeight = nodeRect.height / transformState.scale;

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

  const newPositionX = (wrapperRect.left - nodeLeft) * newScale + offsetX;
  const newPositionY = (wrapperRect.top - nodeTop) * newScale + offsetY;

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
