import { ReactNode } from "react";

export interface PropsList {
  scale?: number;
  positionX?: number;
  positionY?: number;
  options?: {
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
  };
  scalePadding?: {
    disabled?: boolean;
    size?: number;
    animationTime?: number;
    animationType?: string;
  };
  wheel?: {
    disabled?: boolean;
    step?: number;
    wheelEnabled?: boolean;
    touchPadEnabled?: boolean;
    limitsOnWheel?: boolean;
  };
  pan?: {
    wheelEnabled?: boolean;
    disabled?: boolean;
    velocity?: boolean;
    panAnimationType?: string;
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
    animationType?: string;
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
    animationType?: string;
  };
  zoomOut?: {
    disabled?: boolean;
    step?: number;
    animation?: boolean;
    animationTime?: number;
    animationType?: string;
  };
  doubleClick?: {
    disabled?: boolean;
    step?: number;
    mode?: string;
    animation?: boolean;
    animationTime?: number;
    animationType?: string;
  };
  reset?: {
    disabled?: boolean;
    step?: number;
    animation?: boolean;
    animationTime?: number;
    animationType?: string;
  };
  children?: ReactNode;
  defaultPositionX?: number;
  defaultPositionY?: number;
  defaultScale?: number;
  onWheelStart?: any;
  onWheel?: any;
  onWheelStop?: any;
  onPanningStart?: any;
  onPanning?: any;
  onPanningStop?: any;
  onPinchingStart?: any;
  onPinching?: any;
  onPinchingStop?: any;
  onZoomChange?: any;
}
