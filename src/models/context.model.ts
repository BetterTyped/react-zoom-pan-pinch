import React from "react";

import { animations } from "../core/animations/animations.constants";
import { DeepNonNullable } from "./helpers.model";
import {
  zoomIn,
  zoomToElement,
  centerView,
  resetTransform,
  setTransform,
  zoomOut,
} from "../core/handlers/handlers.logic";
import { ZoomPanPinch } from "../core/instance.core";

export type ReactZoomPanPinchContext = typeof ZoomPanPinch.prototype;

export type ReactZoomPanPinchRef = {
  instance: ReactZoomPanPinchContext;
  state: ReactZoomPanPinchState;
} & ReactZoomPanPinchHandlers;

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
  children?: React.ReactNode | ((ref: ReactZoomPanPinchRef) => React.ReactNode);
  ref?: React.Ref<ReactZoomPanPinchRef>;
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
  wheel?: {
    step?: number;
    disabled?: boolean;
    wheelDisabled?: boolean;
    touchPadDisabled?: boolean;
    activationKeys?: string[];
    excluded?: string[];
  };
  panning?: {
    disabled?: boolean;
    velocityDisabled?: boolean;
    lockAxisX?: boolean;
    lockAxisY?: boolean;
    activationKeys?: string[];
    excluded?: string[];
  };
  pinch?: {
    step?: number;
    disabled?: boolean;
    excluded?: string[];
  };
  doubleClick?: {
    disabled?: boolean;
    step?: number;
    mode?: "zoomIn" | "zoomOut" | "reset";
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
  alignmentAnimation?: {
    disabled?: boolean;
    sizeX?: number;
    sizeY?: number;
    animationTime?: number;
    velocityAlignmentTime?: number;
    animationType?: keyof typeof animations;
  };
  velocityAnimation?: {
    disabled?: boolean;
    sensitivity?: number;
    animationTime?: number;
    animationType?: keyof typeof animations;
    equalToMove?: boolean;
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
  onPinchingStart?: (ref: ReactZoomPanPinchRef, event: TouchEvent) => void;
  onPinching?: (ref: ReactZoomPanPinchRef, event: TouchEvent) => void;
  onPinchingStop?: (ref: ReactZoomPanPinchRef, event: TouchEvent) => void;
  onZoomStart?: (
    ref: ReactZoomPanPinchRef,
    event: TouchEvent | MouseEvent,
  ) => void;
  onZoom?: (ref: ReactZoomPanPinchRef, event: TouchEvent | MouseEvent) => void;
  onZoomStop?: (
    ref: ReactZoomPanPinchRef,
    event: TouchEvent | MouseEvent,
  ) => void;
  onTransformed?: (
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
      | "onPinchingStart"
      | "onPinching"
      | "onPinchingStop"
      | "onZoomStart"
      | "onZoom"
      | "onZoomStop"
      | "onTransformed"
      | "onInit"
      | "customTransform"
    >
  >;
