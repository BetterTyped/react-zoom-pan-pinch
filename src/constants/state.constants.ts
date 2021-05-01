import { ReactZoomPanPinchProps } from "../models/context.model";
import {
  ReactZoomPanPinchComponentHelpers,
  ReactZoomPanPinchState,
} from "../models/context.model";

export const initialState: ReactZoomPanPinchState = {
  previousScale: 1,
  scale: 1,
  positionX: 0,
  positionY: 0,
};

export const contextInitialState: ReactZoomPanPinchComponentHelpers &
  ReactZoomPanPinchState &
  // ReactZoomPanPinchSetters &
  Pick<ReactZoomPanPinchProps, "wrapperClass" | "contentClass"> = {
  ...initialState,
  wrapperClass: "",
  contentClass: "",
  setComponents: () => undefined,
  // setScale: () => undefined,
  // setPositionX: () => undefined,
  // setPositionY: () => undefined,
  // zoomIn: () => undefined,
  // zoomOut: () => undefined,
  // setTransform: () => undefined,
  // resetTransform: () => undefined,
  // setDefaultState: () => undefined,
};
