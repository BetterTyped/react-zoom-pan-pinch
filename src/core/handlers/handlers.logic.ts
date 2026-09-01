import { ReactZoomPanPinchContext } from "../../models";
import {
  calculateZoomToNode,
  handleZoomToViewCenter,
  resetTransformations,
} from "./handlers.utils";
import { animations } from "../animations/animations.constants";
import { animate, handleCancelAnimation } from "../animations/animations.utils";
import { getCenterPosition } from "../../utils";

export const zoomIn =
  (contextInstance: ReactZoomPanPinchContext) =>
  (
    step = 0.5,
    animationTime = 300,
    animationType: keyof typeof animations = "easeOut",
  ): void => {
    handleZoomToViewCenter(
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
  ): void => {
    handleZoomToViewCenter(
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
  ): void => {
    const { positionX, positionY, scale } = contextInstance.state;
    const { wrapperComponent, contentComponent } = contextInstance;
    const { disabled } = contextInstance.setup;

    if (disabled || !wrapperComponent || !contentComponent) return;

    const targetState = {
      positionX: Number.isNaN(newPositionX) ? positionX : newPositionX,
      positionY: Number.isNaN(newPositionY) ? positionY : newPositionY,
      scale: Number.isNaN(newScale) ? scale : newScale,
    };

    animate(contextInstance, targetState, animationTime, animationType);
  };

export const resetTransform =
  (contextInstance: ReactZoomPanPinchContext) =>
  (
    animationTime = 200,
    animationType: keyof typeof animations = "easeOut",
  ): void => {
    resetTransformations(contextInstance, animationTime, animationType);
  };

export const centerView =
  (contextInstance: ReactZoomPanPinchContext) =>
  (
    scale?: number,
    animationTime = 200,
    animationType: keyof typeof animations = "easeOut",
  ): void => {
    const { state, wrapperComponent, contentComponent } = contextInstance;
    if (wrapperComponent && contentComponent) {
      const targetState = getCenterPosition(
        scale || state.scale,
        wrapperComponent,
        contentComponent,
      );

      animate(contextInstance, targetState, animationTime, animationType);
    }
  };

export const zoomToElement =
  (contextInstance: ReactZoomPanPinchContext) =>
  (
    node: HTMLElement | string,
    scale?: number,
    animationTime = 600,
    animationType: keyof typeof animations = "easeOut",
    offsetX = 0,
    offsetY = 0,
  ): void => {
    handleCancelAnimation(contextInstance);

    const { wrapperComponent } = contextInstance;

    // Resolve ids in the wrapper's own document so it works inside portal
    // windows and iframes, not only the top-level document (#290).
    const ownerDocument =
      wrapperComponent?.ownerDocument ??
      (typeof document !== "undefined" ? document : null);

    const target: HTMLElement | null =
      typeof node === "string"
        ? ownerDocument?.getElementById(node) ?? null
        : node;

    if (wrapperComponent && target && wrapperComponent.contains(target)) {
      const targetState = calculateZoomToNode(
        contextInstance,
        target,
        scale,
        offsetX,
        offsetY,
      );
      animate(contextInstance, targetState, animationTime, animationType);
    }
  };
