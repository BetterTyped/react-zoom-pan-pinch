import React from "react";

import { animations } from "../core/animations/animations.constants";
import { DeepNonNullable } from "./helpers.model";
import {
  centerView,
  clientToContent,
  contentToClient,
  fitToView,
  panBy,
  resetTransform,
  setTransform,
  zoomIn,
  zoomOut,
  zoomToElement,
  zoomToPoint,
} from "../core/handlers/handlers.logic";
import { ZoomPanPinch } from "../core/instance.core";

export type ZoomToElementTarget = HTMLElement | string;

export type ZoomToElementOptions = {
  /** Explicit target scale; when omitted the element(s) are fitted to the viewport. */
  scale?: number;
  /** Lower cap for the automatically computed fit scale. */
  minScale?: number;
  /** Upper cap for the automatically computed fit scale (e.g. stop tiny elements from over-zooming). */
  maxScale?: number;
  animationTime?: number;
  animationType?: keyof typeof animations;
  offsetX?: number;
  offsetY?: number;
};

export type FitToViewMode = "contain" | "cover";

export type FitToViewOptions = {
  /** `contain` (default) shows the whole content, `cover` fills the viewport. */
  mode?: FitToViewMode;
  /** Lower cap for the computed fit scale. */
  minScale?: number;
  /** Upper cap for the computed fit scale. */
  maxScale?: number;
  animationTime?: number;
  animationType?: keyof typeof animations;
};

export type ReactZoomPanPinchContext = typeof ZoomPanPinch.prototype;

export type ReactZoomPanPinchContextState = {
  instance: ReactZoomPanPinchContext;
  state: ReactZoomPanPinchState;
};

export type ReactZoomPanPinchContentRef = {
  instance: ReactZoomPanPinchContext;
  state: ReactZoomPanPinchState;
} & ReactZoomPanPinchHandlers;

export type ReactZoomPanPinchRef = ReactZoomPanPinchContextState &
  ReactZoomPanPinchHandlers;

export type ReactZoomPanPinchState = {
  previousScale: number;
  scale: number;
  positionX: number;
  positionY: number;
};

export type ReactZoomPanPinchHandlers = {
  zoomIn: ReturnType<typeof zoomIn>;
  zoomOut: ReturnType<typeof zoomOut>;
  setTransform: ReturnType<typeof setTransform>;
  resetTransform: ReturnType<typeof resetTransform>;
  centerView: ReturnType<typeof centerView>;
  zoomToElement: ReturnType<typeof zoomToElement>;
  zoomToPoint: ReturnType<typeof zoomToPoint>;
  clientToContent: ReturnType<typeof clientToContent>;
  contentToClient: ReturnType<typeof contentToClient>;
  fitToView: ReturnType<typeof fitToView>;
  panBy: ReturnType<typeof panBy>;
};

export type ReactZoomPanPinchRefProps = {
  setRef: (context: ReactZoomPanPinchRef) => void;
} & Omit<ReactZoomPanPinchProps, "ref">;

export type ReactZoomPanPinchProps = {
  children?:
    | React.ReactNode
    | ((ref: ReactZoomPanPinchContentRef) => React.ReactNode);
  ref?: React.Ref<ReactZoomPanPinchRef>;
  detached?: boolean;
  initialScale?: number;
  initialPositionX?: number;
  initialPositionY?: number;
  disabled?: boolean;
  minPositionX?: null | number;
  maxPositionX?: null | number;
  minPositionY?: null | number;
  maxPositionY?: null | number;
  minScale?: number;
  maxScale?: number;
  limitToBounds?: boolean;
  centerZoomedOut?: boolean;
  centerOnInit?: boolean;
  /**
   * Fit the content to the wrapper on init (and again when the content gets
   * its size, e.g. after an image loads). `true`/`"contain"` shows the whole
   * content, `"cover"` fills the wrapper. Honours `minScale`/`maxScale`.
   */
  fitOnInit?: boolean | FitToViewMode;
  disablePadding?: boolean;
  customTransform?: (x: number, y: number, scale: number) => string;
  smooth?: boolean;
  wheel?: {
    step?: number;
    disabled?: boolean;
    wheelDisabled?: boolean;
    touchPadDisabled?: boolean;
    activationKeys?: string[] | ((keys: string[]) => boolean);
    excluded?: string[];
  };
  panning?: {
    disabled?: boolean;
    velocityDisabled?: boolean;
    lockAxisX?: boolean;
    lockAxisY?: boolean;
    allowLeftClickPan?: boolean;
    allowMiddleClickPan?: boolean;
    allowRightClickPan?: boolean;
    activationKeys?: string[] | ((keys: string[]) => boolean);
    excluded?: string[];
  };
  pinch?: {
    step?: number;
    disabled?: boolean;
    allowPanning?: boolean;
    excluded?: string[];
  };
  trackPadPanning?: {
    disabled?: boolean;
    velocityDisabled?: boolean;
    lockAxisX?: boolean;
    lockAxisY?: boolean;
    activationKeys?: string[] | ((keys: string[]) => boolean);
    excluded?: string[];
  };
  keyboard?: {
    /** Keyboard navigation is opt-in. */
    disabled?: boolean;
    /** Pixels moved per arrow key press. */
    panStep?: number;
    /** Scale added/removed per +/- press. */
    zoomStep?: number;
    animationTime?: number;
    animationType?: keyof typeof animations;
    excluded?: string[];
  };
  doubleClick?: {
    disabled?: boolean;
    step?: number;
    mode?: "zoomIn" | "zoomOut" | "reset" | "toggle";
    animationTime?: number;
    animationType?: keyof typeof animations;
    excluded?: string[];
  };
  zoomAnimation?: {
    disabled?: boolean;
    size?: number;
    animationTime?: number;
    animationType?: keyof typeof animations;
  };
  autoAlignment?: {
    disabled?: boolean;
    sizeX?: number;
    sizeY?: number;
    animationTime?: number;
    velocityAlignmentTime?: number;
    animationType?: keyof typeof animations;
  };
  velocityAnimation?: {
    disabled?: boolean;
    sensitivityTouch?: number;
    sensitivityMouse?: number;
    maxStrengthMouse?: number;
    maxStrengthTouch?: number;
    inertia?: number;
    animationTime?: number;
    maxAnimationTime?: number;
    animationType?: keyof typeof animations;
  };
  onWheelStart?: (ref: ReactZoomPanPinchRef, event: WheelEvent) => void;
  onWheel?: (ref: ReactZoomPanPinchRef, event: WheelEvent) => void;
  onWheelStop?: (ref: ReactZoomPanPinchRef, event: WheelEvent) => void;
  onPanningStart?: (
    ref: ReactZoomPanPinchRef,
    event: TouchEvent | MouseEvent,
  ) => void;
  onPanning?: (
    ref: ReactZoomPanPinchRef,
    event: TouchEvent | MouseEvent,
  ) => void;
  onPanningStop?: (
    ref: ReactZoomPanPinchRef,
    event: TouchEvent | MouseEvent,
  ) => void;
  onPinchStart?: (ref: ReactZoomPanPinchRef, event: TouchEvent) => void;
  onPinch?: (ref: ReactZoomPanPinchRef, event: TouchEvent) => void;
  onPinchStop?: (ref: ReactZoomPanPinchRef, event: TouchEvent) => void;
  onZoomStart?: (
    ref: ReactZoomPanPinchRef,
    event: TouchEvent | MouseEvent,
  ) => void;
  onZoom?: (ref: ReactZoomPanPinchRef, event: TouchEvent | MouseEvent) => void;
  onZoomStop?: (
    ref: ReactZoomPanPinchRef,
    event: TouchEvent | MouseEvent,
  ) => void;
  onTransform?: (
    ref: ReactZoomPanPinchRef,
    state: { scale: number; positionX: number; positionY: number },
  ) => void;
  onInit?: (ref: ReactZoomPanPinchRef) => void;
};

export type ReactZoomPanPinchComponentHelpers = {
  setComponents: (wrapper: HTMLDivElement, content: HTMLDivElement) => void;
};

export type LibrarySetup = Pick<
  ReactZoomPanPinchProps,
  "minPositionX" | "maxPositionX" | "minPositionY" | "maxPositionY"
> &
  DeepNonNullable<
    Omit<
      ReactZoomPanPinchProps,
      | "ref"
      | "initialScale"
      | "initialPositionX"
      | "initialPositionY"
      | "minPositionX"
      | "maxPositionX"
      | "minPositionY"
      | "maxPositionY"
      | "children"
      | "defaultPositionX"
      | "defaultPositionY"
      | "defaultScale"
      | "wrapperClass"
      | "contentClass"
      | "onWheelStart"
      | "onWheel"
      | "onWheelStop"
      | "onPanningStart"
      | "onPanning"
      | "onPanningStop"
      | "onPinchStart"
      | "onPinch"
      | "onPinchStop"
      | "onZoomStart"
      | "onZoom"
      | "onZoomStop"
      | "onTransform"
      | "onInit"
      | "customTransform"
    >
  >;

export type ReactZoomPanPinchBaseClasses = {
  wrapperClass: string;
  contentClass: string;
};
