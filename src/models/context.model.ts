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
  ref?: any;
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
  limitToWrapper?: boolean;
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
  velocityAnimation: {
    disabled?: boolean;
    sensitivity?: number;
    animationTime?: number;
    animationType?: keyof typeof animations;
    equalToMove?: boolean;
  };
  children?: React.ReactNode;
  defaultPositionX?: number;
  defaultPositionY?: number;
  defaultScale?: number;
  onWheelStart?: (values: any) => void;
  onWheel?: (values: any) => void;
  onWheelStop?: (values: any) => void;
  onPanningStart?: (values: any) => void;
  onPanning?: (values: any) => void;
  onPanningStop?: (values: any) => void;
  onPinchingStart?: (values: any) => void;
  onPinching?: (values: any) => void;
  onPinchingStop?: (values: any) => void;
  onZoomStart?: (values: any) => void;
  onZoom?: (values: any) => void;
  onZoomStop?: (values: any) => void;
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
