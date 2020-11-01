import { ReactNode } from 'react';
import { StateProvider } from '../StateContext';
import { AnimationType } from './animationType';

export interface TransformWrapperCallbackProps {
  scale: number;
  positionX: number;
  positionY: number;
  previousScale: number;
};

export interface TransformWrapperChildrenFunctionProps extends TransformWrapperCallbackProps {
  setScale: typeof StateProvider.prototype.setPositionX;
  setPositionX: typeof StateProvider.prototype.setPositionX;
  setPositionY: typeof StateProvider.prototype.setPositionY;
  zoomIn: typeof StateProvider.prototype.zoomIn;
  zoomOut: typeof StateProvider.prototype.zoomOut;
  setTransform: typeof StateProvider.prototype.setTransform;
  resetTransform: typeof StateProvider.prototype.resetTransform;
};

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
    animationType?: AnimationType;
  };
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
    panAnimationType?: AnimationType;
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
    animationType?: AnimationType;
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
    animationType?: AnimationType;
  };
  zoomOut?: {
    disabled?: boolean;
    step?: number;
    animation?: boolean;
    animationTime?: number;
    animationType?: AnimationType;
  };
  doubleClick?: {
    disabled?: boolean;
    step?: number;
    mode?: string;
    animation?: boolean;
    animationTime?: number;
    animationType?: AnimationType;
  };
  reset?: {
    disabled?: boolean;
    step?: number;
    animation?: boolean;
    animationTime?: number;
    animationType?: AnimationType;
  };
  children?: ReactNode | ((childrenFunctionProps: TransformWrapperChildrenFunctionProps) => ReactNode);
  defaultPositionX?: number;
  defaultPositionY?: number;
  defaultScale?: number;
  onWheelStart?: (props: TransformWrapperCallbackProps) => void;
  onWheel?: (props: TransformWrapperCallbackProps) => void;
  onWheelStop?: (props: TransformWrapperCallbackProps) => void;
  onPanningStart?: (props: TransformWrapperCallbackProps) => void;
  onPanning?: (props: TransformWrapperCallbackProps) => void;
  onPanningStop?: (props: TransformWrapperCallbackProps) => void;
  onPinchingStart?: (props: TransformWrapperCallbackProps) => void;
  onPinching?: (props: TransformWrapperCallbackProps) => void;
  onPinchingStop?: (props: TransformWrapperCallbackProps) => void;
  onZoomChange?: (props: TransformWrapperCallbackProps) => void;
}
