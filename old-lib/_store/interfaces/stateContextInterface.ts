import { PropsList } from "./propsInterface";

export interface StateContextProps {
  defaultValues: {
    scale: number;
    positionX: number;
    positionY: number;
  };
  dynamicValues: PropsList;
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
