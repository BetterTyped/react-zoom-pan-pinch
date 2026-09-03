import {
  FitToViewOptions,
  PositionType,
  ReactZoomPanPinchContext,
  ZoomToElementOptions,
  ZoomToElementTarget,
} from "../../models";
import {
  calculateFitToView,
  calculateZoomToRect,
  clientToContentPoint,
  contentToClientPoint,
  getUnionRect,
  handleZoomToViewCenter,
  resetTransformations,
  runPanAnimation,
  runZoomAnimation,
} from "./handlers.utils";
import {
  handleCalculateBounds,
  getMouseBoundedPosition,
} from "../bounds/bounds.utils";
import { animations } from "../animations/animations.constants";
import { animate, handleCancelAnimation } from "../animations/animations.utils";
import { handleZoomToPoint } from "../zoom/zoom.logic";
import { getCenterPosition } from "../../utils";

export const zoomIn =
  (contextInstance: ReactZoomPanPinchContext) =>
  (
    step = 0.5,
    animationTime = 300,
    animationType: keyof typeof animations = "easeOut",
  ): Promise<void> => {
    return handleZoomToViewCenter(
      contextInstance,
      1,
      step,
      animationTime,
      animationType,
    );
  };

export const zoomOut =
  (contextInstance: ReactZoomPanPinchContext) =>
  (
    step = 0.5,
    animationTime = 300,
    animationType: keyof typeof animations = "easeOut",
  ): Promise<void> => {
    return handleZoomToViewCenter(
      contextInstance,
      -1,
      step,
      animationTime,
      animationType,
    );
  };

export const setTransform =
  (contextInstance: ReactZoomPanPinchContext) =>
  (
    newPositionX: number,
    newPositionY: number,
    newScale: number,
    animationTime = 300,
    animationType: keyof typeof animations = "easeOut",
  ): Promise<void> => {
    const { positionX, positionY, scale } = contextInstance.state;
    const { wrapperComponent, contentComponent } = contextInstance;
    const { disabled } = contextInstance.setup;

    if (disabled || !wrapperComponent || !contentComponent) {
      return Promise.resolve();
    }

    const targetState = {
      positionX: Number.isNaN(newPositionX) ? positionX : newPositionX,
      positionY: Number.isNaN(newPositionY) ? positionY : newPositionY,
      scale: Number.isNaN(newScale) ? scale : newScale,
    };

    return animate(contextInstance, targetState, animationTime, animationType);
  };

export const resetTransform =
  (contextInstance: ReactZoomPanPinchContext) =>
  (
    animationTime = 200,
    animationType: keyof typeof animations = "easeOut",
  ): Promise<void> => {
    return resetTransformations(contextInstance, animationTime, animationType);
  };

export const centerView =
  (contextInstance: ReactZoomPanPinchContext) =>
  (
    scale?: number,
    animationTime = 200,
    animationType: keyof typeof animations = "easeOut",
  ): Promise<void> => {
    const { state, wrapperComponent, contentComponent } = contextInstance;
    if (wrapperComponent && contentComponent) {
      const targetState = getCenterPosition(
        scale || state.scale,
        wrapperComponent,
        contentComponent,
      );

      return animate(
        contextInstance,
        targetState,
        animationTime,
        animationType,
      );
    }
    return Promise.resolve();
  };

/**
 * Zooms so that the content point currently under the client (viewport)
 * coordinates `clientX`/`clientY` stays fixed on screen — the same anchoring a
 * wheel zoom does at the cursor. Useful for click-to-zoom and focal zooms
 * (#353).
 */
export const zoomToPoint =
  (contextInstance: ReactZoomPanPinchContext) =>
  (
    scale: number,
    clientX: number,
    clientY: number,
    animationTime = 300,
    animationType: keyof typeof animations = "easeOut",
  ): Promise<void> => {
    const { wrapperComponent, contentComponent, setup } = contextInstance;
    if (setup.disabled || !wrapperComponent || !contentComponent) {
      return Promise.resolve();
    }

    const point = clientToContentPoint(contextInstance, clientX, clientY);
    const targetState = handleZoomToPoint(
      contextInstance,
      scale,
      point.x,
      point.y,
    );

    if (!targetState) return Promise.resolve();

    const effectiveAnimationTime = setup.zoomAnimation.disabled
      ? 0
      : animationTime;

    return runZoomAnimation(
      contextInstance,
      targetState,
      effectiveAnimationTime,
      animationType,
    );
  };

/**
 * Converts client (viewport) coordinates — e.g. `event.clientX/Y` — into
 * content coordinates: the unscaled position inside `TransformComponent`
 * regardless of the current pan and zoom (#378).
 */
export const clientToContent =
  (contextInstance: ReactZoomPanPinchContext) =>
  (clientX: number, clientY: number): PositionType => {
    return clientToContentPoint(contextInstance, clientX, clientY);
  };

/**
 * Inverse of `clientToContent`: converts unscaled content coordinates into
 * client (viewport) coordinates for the current transform.
 */
export const contentToClient =
  (contextInstance: ReactZoomPanPinchContext) =>
  (x: number, y: number): PositionType => {
    return contentToClientPoint(contextInstance, x, y);
  };

const resolveTargets = (
  contextInstance: ReactZoomPanPinchContext,
  node: ZoomToElementTarget | ZoomToElementTarget[],
): HTMLElement[] => {
  const { wrapperComponent } = contextInstance;
  if (!wrapperComponent) return [];

  // Ids are resolved in the wrapper's own root so this works inside portal
  // windows and iframes (#290) as well as shadow roots (#371).
  const rootNode = wrapperComponent.getRootNode();
  const root: { getElementById(id: string): Element | null } | null =
    rootNode && "getElementById" in rootNode
      ? (rootNode as unknown as { getElementById(id: string): Element | null })
      : wrapperComponent.ownerDocument ??
        (typeof document !== "undefined" ? document : null);

  const list = Array.isArray(node) ? node : [node];

  return list
    .map((item) =>
      typeof item === "string"
        ? (root?.getElementById(item) as HTMLElement | null)
        : item,
    )
    .filter(
      (element): element is HTMLElement =>
        !!element && wrapperComponent.contains(element),
    );
};

/**
 * Zooms and pans so the target element(s) fill the viewport.
 *
 * - `node` may be an element, an element id, or an array of either; with
 *   several targets the union of their boxes is framed (#388).
 * - The second argument is either the target `scale` (legacy positional
 *   form) or an options object. `minScale`/`maxScale` cap the automatically
 *   computed fit scale (#515).
 */
export const zoomToElement =
  (contextInstance: ReactZoomPanPinchContext) =>
  (
    node: ZoomToElementTarget | ZoomToElementTarget[],
    scaleOrOptions?: number | ZoomToElementOptions,
    animationTime = 600,
    animationType: keyof typeof animations = "easeOut",
    offsetX = 0,
    offsetY = 0,
  ): Promise<void> => {
    handleCancelAnimation(contextInstance);

    const options: ZoomToElementOptions =
      typeof scaleOrOptions === "object" && scaleOrOptions !== null
        ? scaleOrOptions
        : { scale: scaleOrOptions };

    const targets = resolveTargets(contextInstance, node);

    if (!contextInstance.wrapperComponent || targets.length === 0) {
      return Promise.resolve();
    }

    const targetState = calculateZoomToRect(
      contextInstance,
      getUnionRect(targets),
      options.scale,
      options.offsetX ?? offsetX,
      options.offsetY ?? offsetY,
      options.minScale,
      options.maxScale,
    );

    return animate(
      contextInstance,
      targetState,
      options.animationTime ?? animationTime,
      options.animationType ?? animationType,
    );
  };

/**
 * Fits the whole content into the viewport (`contain`, default) or fills the
 * viewport with it (`cover`), centred. Honours the wrapper's
 * `minScale`/`maxScale`; lower `minScale` to let large content shrink (#252).
 */
export const fitToView =
  (contextInstance: ReactZoomPanPinchContext) =>
  (options: FitToViewOptions = {}): Promise<void> => {
    const { wrapperComponent, contentComponent, setup } = contextInstance;
    if (setup.disabled || !wrapperComponent || !contentComponent) {
      return Promise.resolve();
    }

    const targetState = calculateFitToView(
      contextInstance,
      options.mode ?? "contain",
      options.minScale,
      options.maxScale,
    );
    if (!targetState) return Promise.resolve();

    const animationTime = setup.zoomAnimation.disabled
      ? 0
      : options.animationTime ?? 200;

    return runZoomAnimation(
      contextInstance,
      targetState,
      animationTime,
      options.animationType ?? "easeOut",
    );
  };

/**
 * Pans by a pixel delta (positive x moves the content right), limited to the
 * bounds when `limitToBounds` is on. Backs the keyboard arrows and is handy
 * for directional buttons (#254, #527).
 */
export const panBy =
  (contextInstance: ReactZoomPanPinchContext) =>
  (
    deltaX: number,
    deltaY: number,
    animationTime = 200,
    animationType: keyof typeof animations = "easeOut",
  ): Promise<void> => {
    const { wrapperComponent, contentComponent, setup, state } =
      contextInstance;
    if (setup.disabled || !wrapperComponent || !contentComponent) {
      return Promise.resolve();
    }
    if (!Number.isFinite(deltaX) || !Number.isFinite(deltaY)) {
      return Promise.resolve();
    }

    const bounds = handleCalculateBounds(contextInstance, state.scale);
    const { x, y } = getMouseBoundedPosition(
      state.positionX + deltaX,
      state.positionY + deltaY,
      bounds,
      setup.limitToBounds,
      0,
      0,
      wrapperComponent,
    );

    if (x === state.positionX && y === state.positionY) {
      return Promise.resolve();
    }

    return runPanAnimation(
      contextInstance,
      { scale: state.scale, positionX: x, positionY: y },
      animationTime,
      animationType,
    );
  };
