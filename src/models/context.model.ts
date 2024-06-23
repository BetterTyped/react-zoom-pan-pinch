import React from "react";

import { animations } from "../core/animations/animations.constants";
import { DeepNonNullable } from "./helpers.model";
import {
  centerView,
  resetTransform,
  setTransform,
  zoomIn,
  zoomOut,
  zoomToElement,
} from "../core/handlers/handlers.logic";
import { ZoomPanPinch } from "../core/instance.core";

export type ReactZoomPanPinchContext = typeof ZoomPanPinch.prototype;

export type ReactZoomPanPinchContextState = {
  instance: ReactZoomPanPinchContext;
  state: ReactZoomPanPinchState;
};

export type ReactZoomPanPinchContentRef = {
  instance: ReactZoomPanPinchContext;
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
  trackPadPanning: {
    disabled: boolean;
    velocityDisabled?: boolean;
    lockAxisX?: boolean;
    lockAxisY?: boolean;
    activationKeys: string[] | ((keys: string[]) => boolean);
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
