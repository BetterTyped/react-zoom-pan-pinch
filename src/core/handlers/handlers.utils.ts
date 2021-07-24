import { ReactZoomPanPinchContext } from "../../models";
import { animations } from "../animations/animations.constants";
import { handleZoomToPoint } from "../zoom/zoom.logic";
import { animate } from "../animations/animations.utils";
import { createState } from "../../utils/state.utils";
import { checkZoomBounds } from "../zoom/zoom.utils";
import { roundNumber } from "../../utils";
import { initialState } from "../../constants/state.constants";
import { PositionType } from "../../models/calculations.model";
import {
  calculateBounds,
  getMouseBoundedPosition,
} from "core/bounds/bounds.utils";

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

  animate(contextInstance, newState, animationTime, animationType);
}

export function calculateZoomToNode(
  contextInstance: ReactZoomPanPinchContext,
  node: HTMLElement,
  customZoom?: number,
): { positionX: number; positionY: number; scale: number } {
  const { wrapperComponent } = contextInstance;
  const { limitToBounds, minScale, maxScale } = contextInstance.setup;
  if (!wrapperComponent) return initialState;

  const wrapperRect = wrapperComponent.getBoundingClientRect();
  const nodeRect = getOffset(node);

  const nodeLeft = nodeRect.x;
  const nodeTop = nodeRect.y;
  const nodeWidth = node.offsetWidth;
  const nodeHeight = node.offsetHeight;

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

function getOffset(element: HTMLElement): PositionType {
  let el = element;

  let offsetLeft = 0;
  let offsetTop = 0;

  while (el) {
    offsetLeft += el.offsetLeft;
    offsetTop += el.offsetTop;

    el = el.offsetParent as HTMLElement;
  }

  return {
    x: offsetLeft,
    y: offsetTop,
  };
}

export function isValidZoomNode(node: HTMLElement | null): boolean {
  if (!node) {
    console.error("Zoom node not found");
    return false;
  } else if (
    node?.offsetWidth === undefined ||
    node?.offsetHeight === undefined
  ) {
    console.error(
      "Zoom node is not valid - it must contain offsetWidth and offsetHeight",
    );
    return false;
  }
  return true;
}
