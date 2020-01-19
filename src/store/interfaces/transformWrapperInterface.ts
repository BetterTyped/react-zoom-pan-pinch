import { ReactNode } from "react";

export interface TransformWrapperProps {
  children: ReactNode;
  defaultPositionX: number;
  defaultPositionY: number;
  defaultScale: number;
  onWheelStart: any;
  onWheel: any;
  onWheelStop: any;
  onPanningStart: any;
  onPanning: any;
  onPanningStop: any;
  onPinchingStart: any;
  onPinching: any;
  onPinchingStop: any;
  onZoomChange: any;
}
export interface StateContextState {
  wrapperComponent: HTMLDivElement | undefined;
  contentComponent: HTMLDivElement | undefined;
}
