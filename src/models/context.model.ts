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
  ref?: any;
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
    mode?: string;
    animation?: boolean;
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
    animationType?: keyof typeof animations;
  };
  velocityAnimation: {
    disabled?: boolean;
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
      | "ref"
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
