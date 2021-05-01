import React from "react";
import { TransformContext } from "../components/transform-context";
import { animations } from "../core/animations/animations.constants";
import { DeepNonNullable } from "./helpers.model";

export type ReactZoomPanPinchContext = typeof TransformContext.prototype;

export type ReactZoomPanPinchState = {
  previousScale: number;
  scale: number;
  positionX: number;
  positionY: number;
};

export type ReactZoomPanPinchSetters = {
  setScale: () => void;
  setPositionX: () => void;
  setPositionY: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  setTransform: () => void;
  resetTransform: () => void;
  setDefaultState: () => void;
};

export type ReactZoomPanPinchProps = {
  scale?: number;
  positionX?: number;
  positionY?: number;
  disabled?: boolean;
  transformEnabled?: boolean;
  minPositionX?: null | number;
  maxPositionX?: null | number;
  minPositionY?: null | number;
  maxPositionY?: null | number;
  minScale?: number;
  maxScale?: number;
  limitToBounds?: boolean;
  centerContent?: boolean;
  limitToWrapper?: boolean;
  wrapperClass?: string;
  contentClass?: string;
  wheel?: {
    disabled?: boolean;
    step?: number;
    wheelEnabled?: boolean;
    touchPadEnabled?: boolean;
    limitsOnWheel?: boolean;
  };
  pan?: {
    disabled?: boolean;
    velocity?: boolean;
    panAnimationType?: keyof typeof animations;
    velocityEqualToMove?: boolean;
    velocitySensitivity?: number;
    velocityActiveScale?: number;
    velocityMinSpeed?: number;
    velocityBaseTime?: number;
    lockAxisX?: boolean;
    lockAxisY?: boolean;
    padding?: boolean;
    paddingSize?: number;
    animationTime?: number;
    animationType?: keyof typeof animations;
  };
  pinch?: {
    disabled?: boolean;
    step?: number;
  };
  zoomIn?: {
    disabled?: boolean;
    step?: number;
    animation?: boolean;
    animationTime?: number;
    animationType?: keyof typeof animations;
  };
  zoomOut?: {
    disabled?: boolean;
    step?: number;
    animation?: boolean;
    animationTime?: number;
    animationType?: keyof typeof animations;
  };
  doubleClick?: {
    disabled?: boolean;
    step?: number;
    mode?: string;
    animation?: boolean;
    animationTime?: number;
    animationType?: keyof typeof animations;
  };
  reset?: {
    disabled?: boolean;
    step?: number;
    animation?: boolean;
    animationTime?: number;
    animationType?: keyof typeof animations;
  };
  zoomAnimations?: {
    disabled?: boolean;
    size?: number;
    animationTime?: number;
    animationType?: keyof typeof animations;
  };
  scalePadding?: {
    disabled?: boolean;
    size?: number;
    animationTime?: number;
    animationType?: keyof typeof animations;
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
  onZoomChange?: (values: any) => void;
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
      | "scale"
      | "positionX"
      | "positionY"
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
    >
  >;
