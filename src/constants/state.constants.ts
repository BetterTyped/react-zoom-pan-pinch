import { ReactZoomPanPinchProps, LibrarySetup } from "../models/context.model";
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

export const initialSetup: LibrarySetup = {
  disabled: false,
  transformEnabled: true,
  minPositionX: null,
  maxPositionX: null,
  minPositionY: null,
  maxPositionY: null,
  minScale: 1,
  maxScale: 8,
  limitToBounds: true,
  limitToWrapper: true,
  centerContent: true,
  wheel: {
    disabled: false,
    step: 5,
    wheelEnabled: true,
    touchPadEnabled: true,
    limitsOnWheel: false,
  },
  pan: {
    disabled: false,
    panAnimationType: "linear",
    lockAxisX: false,
    lockAxisY: false,
    velocity: true,
    velocityEqualToMove: true,
    velocitySensitivity: 2,
    velocityActiveScale: 1,
    velocityMinSpeed: 1,
    velocityBaseTime: 1600,
    padding: true,
    paddingSize: 30,
    animationType: "easeOut",
    animationTime: 200,
  },
  pinch: {
    disabled: false,
    step: 5,
  },
  zoomIn: {
    disabled: false,
    step: 20,
    animation: true,
    animationType: "easeOut",
    animationTime: 200,
  },
  zoomOut: {
    disabled: false,
    step: 20,
    animation: true,
    animationType: "easeOut",
    animationTime: 200,
  },
  doubleClick: {
    disabled: false,
    step: 20,
    mode: "zoomIn",
    animation: true,
    animationType: "easeOut",
    animationTime: 200,
  },
  reset: {
    disabled: false,
    animation: true,
    animationType: "easeOut",
    animationTime: 200,
    step: 5,
  },
  zoomAnimations: {
    disabled: false,
    size: 0.2,
    animationTime: 200,
    animationType: "easeOut",
  },
  scalePadding: {
    disabled: false,
    size: 0.4,
    animationTime: 200,
    animationType: "easeOut",
  },
  onWheelStart: () => undefined,
  onWheel: () => undefined,
  onWheelStop: () => undefined,
  onPanningStart: () => undefined,
  onPanning: () => undefined,
  onPanningStop: () => undefined,
  onPinchingStart: () => undefined,
  onPinching: () => undefined,
  onPinchingStop: () => undefined,
  onZoomChange: () => undefined,
};
