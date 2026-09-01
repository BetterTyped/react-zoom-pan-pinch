import {
  PositionType,
  ReactZoomPanPinchContext,
  ReactZoomPanPinchState,
  StateType,
} from "../../models";
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

export type RectLike = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const handleCalculateButtonZoom = (
  contextInstance: ReactZoomPanPinchContext,
  delta: number,
  step: number,
): number => {
  const { scale } = contextInstance.state;
  const { wrapperComponent, setup } = contextInstance;
  const { maxScale, minScale, zoomAnimation } = setup;
  const { size } = zoomAnimation;

  if (!wrapperComponent) {
    throw new Error("Wrapper is not mounted");
  }

  // `step` is an absolute scale increment for zoomIn/zoomOut and double
  // click: zoomIn(0.25) from 1 lands on 1.25. The `smooth` option only
  // shapes wheel/trackpad deltas (#545, #431).
  const targetScale = scale + delta * step;

  const newScale = checkZoomBounds(
    roundNumber(targetScale, 3),
    minScale,
    maxScale,
    size,
    false,
  );
  return newScale;
};

/**
 * Runs a programmatic zoom: fires `onZoomStart`/`onZoom`, animates to
 * `targetState` and fires `onZoomStop` once the animation time has elapsed.
 * Resolves when the animation has finished (or was interrupted).
 */
export function runZoomAnimation(
  contextInstance: ReactZoomPanPinchContext,
  targetState: StateType,
  animationTime: number,
  animationType: keyof typeof animations,
): Promise<void> {
  const { wrapperComponent } = contextInstance;
  const { onZoomStart, onZoom, onZoomStop } = contextInstance.props;
  const event = new MouseEvent("mousemove", { bubbles: true });
  const ctx = getContext(contextInstance);
  handleCallback(ctx, event, onZoomStart);
  handleCallback(ctx, event, onZoom);
  const done = animate(
    contextInstance,
    targetState,
    animationTime,
    animationType,
  );
  const win =
    wrapperComponent?.ownerDocument?.defaultView ??
    (typeof window !== "undefined" ? window : null);
  if (win) {
    win.setTimeout(() => {
      if (!contextInstance.mounted) return;
      handleCallback(getContext(contextInstance), event, onZoomStop);
    }, animationTime);
  }
  return done;
}

export function handleZoomToViewCenter(
  contextInstance: ReactZoomPanPinchContext,
  delta: number,
  step: number,
  animationTime: number,
  animationType: keyof typeof animations,
): Promise<void> {
  const { wrapperComponent } = contextInstance;
  const { scale, positionX, positionY } = contextInstance.state;
  const { zoomAnimation } = contextInstance.setup;

  if (!wrapperComponent) {
    console.error("No WrapperComponent found");
    return Promise.resolve();
  }

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
    console.error(
      "Error during zoom event. New transformation state was not calculated.",
    );
    return Promise.resolve();
  }

  return runZoomAnimation(
    contextInstance,
    targetState,
    effectiveAnimationTime,
    animationType,
  );
}

export function resetTransformations(
  contextInstance: ReactZoomPanPinchContext,
  animationTime: number,
  animationType: keyof typeof animations,
  onResetTransformation?: () => void,
): Promise<void> {
  const { setup, wrapperComponent, contentComponent } = contextInstance;
  const { limitToBounds, centerOnInit } = setup;
  const initialTransformation = createState(contextInstance.props);
  const { scale, positionX, positionY } = contextInstance.state;

  if (!wrapperComponent) return Promise.resolve();

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
    return Promise.resolve();
  }

  onResetTransformation?.();

  return runZoomAnimation(
    contextInstance,
    newState,
    animationTime,
    animationType,
  );
}

const toRect = (target: HTMLElement | RectLike): RectLike => {
  if ("getBoundingClientRect" in target) {
    const rect = target.getBoundingClientRect();
    return {
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
    };
  }
  return target;
};

/**
 * Smallest client rect containing every node (#388).
 */
export function getUnionRect(nodes: HTMLElement[]): RectLike {
  const rects = nodes.map(toRect);
  const left = Math.min(...rects.map((r) => r.x));
  const top = Math.min(...rects.map((r) => r.y));
  const right = Math.max(...rects.map((r) => r.x + r.width));
  const bottom = Math.max(...rects.map((r) => r.y + r.height));
  return { x: left, y: top, width: right - left, height: bottom - top };
}

export function getOffset(
  element: HTMLElement | RectLike,
  wrapper: HTMLElement,
  content: HTMLElement,
  state: ReactZoomPanPinchState,
) {
  const offset = toRect(element);
  const wrapperOffset = wrapper.getBoundingClientRect();
  const contentOffset = content.getBoundingClientRect();

  const xOff = wrapperOffset.x * state.scale;
  const yOff = wrapperOffset.y * state.scale;

  return {
    x: (offset.x - contentOffset.x + xOff) / state.scale,
    y: (offset.y - contentOffset.y + yOff) / state.scale,
  };
}

/**
 * Transform that frames the client-space `rect` in the viewport.
 *
 * `customZoom` forces the scale; otherwise the rect is fitted and the fit
 * scale is capped by `minFitScale`/`maxFitScale` (#515) before the wrapper's
 * own `minScale`/`maxScale` apply.
 */
export function calculateZoomToRect(
  contextInstance: ReactZoomPanPinchContext,
  rect: RectLike,
  customZoom?: number,
  customOffsetX = 0,
  customOffsetY = 0,
  minFitScale?: number,
  maxFitScale?: number,
): { positionX: number; positionY: number; scale: number } {
  const { wrapperComponent, contentComponent, state } = contextInstance;
  const { limitToBounds, minScale, maxScale } = contextInstance.setup;
  if (!wrapperComponent || !contentComponent) return state;

  const wrapperRect = wrapperComponent.getBoundingClientRect();
  const nodeOffset = getOffset(rect, wrapperComponent, contentComponent, state);

  const nodeLeft = nodeOffset.x;
  const nodeTop = nodeOffset.y;
  const nodeWidth = rect.width / state.scale;
  const nodeHeight = rect.height / state.scale;

  const scaleX = wrapperComponent.offsetWidth / nodeWidth;
  const scaleY = wrapperComponent.offsetHeight / nodeHeight;

  let targetScale = customZoom || Math.min(scaleX, scaleY);
  if (maxFitScale !== undefined) {
    targetScale = Math.min(targetScale, maxFitScale);
  }
  if (minFitScale !== undefined) {
    targetScale = Math.max(targetScale, minFitScale);
  }

  const newScale = checkZoomBounds(targetScale, minScale, maxScale, 0, false);

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

export function calculateZoomToNode(
  contextInstance: ReactZoomPanPinchContext,
  node: HTMLElement,
  customZoom?: number,
  customOffsetX = 0,
  customOffsetY = 0,
  minFitScale?: number,
  maxFitScale?: number,
): { positionX: number; positionY: number; scale: number } {
  return calculateZoomToRect(
    contextInstance,
    toRect(node),
    customZoom,
    customOffsetX,
    customOffsetY,
    minFitScale,
    maxFitScale,
  );
}

/**
 * Client (viewport) coordinates → unscaled content coordinates (#378).
 * Returns `{ x: 0, y: 0 }` before the wrapper is mounted.
 */
export function clientToContentPoint(
  contextInstance: ReactZoomPanPinchContext,
  clientX: number,
  clientY: number,
): PositionType {
  const { wrapperComponent, state } = contextInstance;
  if (!wrapperComponent) return { x: 0, y: 0 };

  const rect = wrapperComponent.getBoundingClientRect();
  return {
    x: (clientX - rect.left - state.positionX) / state.scale,
    y: (clientY - rect.top - state.positionY) / state.scale,
  };
}

/**
 * Unscaled content coordinates → client (viewport) coordinates.
 * Returns `{ x: 0, y: 0 }` before the wrapper is mounted.
 */
export function contentToClientPoint(
  contextInstance: ReactZoomPanPinchContext,
  x: number,
  y: number,
): PositionType {
  const { wrapperComponent, state } = contextInstance;
  if (!wrapperComponent) return { x: 0, y: 0 };

  const rect = wrapperComponent.getBoundingClientRect();
  return {
    x: rect.left + state.positionX + x * state.scale,
    y: rect.top + state.positionY + y * state.scale,
  };
}
