import React from "react";

import { TransformContext } from "../components/transform-context";
import { animations } from "../core/animations/animations.constants";
import { DeepNonNullable } from "./helpers.model";

export type ReactZoomPanPinchContext = typeof TransformContext.prototype;

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
  zoomIn: (
    step: number,
    animationTime: number,
    animationName: keyof typeof animations,
  ) => void;
  zoomOut: (
    step: number,
    animationTime: number,
    animationName: keyof typeof animations,
  ) => void;
  setTransform: (
    positionX: number,
    positionY: number,
    scale: number,
    animationTime: number,
    animationName: keyof typeof animations,
  ) => void;
  resetTransform: () => void;
};

export type ReactZoomPanPinchProps = {
  children?: React.ReactNode;
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
    size?: number;
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
  onWheelStart?: (ref: ReactZoomPanPinchRef) => void;
  onWheel?: (ref: ReactZoomPanPinchRef) => void;
  onWheelStop?: (ref: ReactZoomPanPinchRef) => void;
  onPanningStart?: (ref: ReactZoomPanPinchRef) => void;
  onPanning?: (ref: ReactZoomPanPinchRef) => void;
  onPanningStop?: (ref: ReactZoomPanPinchRef) => void;
  onPinchingStart?: (ref: ReactZoomPanPinchRef) => void;
  onPinching?: (ref: ReactZoomPanPinchRef) => void;
  onPinchingStop?: (ref: ReactZoomPanPinchRef) => void;
  onZoomStart?: (ref: ReactZoomPanPinchRef) => void;
  onZoom?: (ref: ReactZoomPanPinchRef) => void;
  onZoomStop?: (ref: ReactZoomPanPinchRef) => void;
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
    >
  >;
