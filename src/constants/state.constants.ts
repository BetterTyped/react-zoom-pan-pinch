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
  limitToWrapper: false,
  centerContent: true,
  wheel: {
    step: 5,
    disabled: false,
    wheelDisabled: false,
    touchPadDisabled: false,
    activationKeys: [],
    excluded: [],
  },
  panning: {
    disabled: false,
    velocityDisabled: false,
    lockAxisX: false,
    lockAxisY: false,
    activationKeys: [],
    excluded: [],
  },
  pinch: {
    step: 5,
    disabled: false,
    excluded: [],
  },
  doubleClick: {
    disabled: false,
    step: 20,
    mode: "zoomIn",
    animation: true,
    animationType: "easeOut",
    animationTime: 200,
  },
  zoomAnimation: {
    disabled: false,
    size: 0.4,
    animationTime: 200,
    animationType: "easeOut",
  },
  alignmentAnimation: {
    disabled: false,
    size: 30,
    animationTime: 200,
    animationType: "easeOut",
  },
  velocityAnimation: {
    disabled: false,
    sensitivity: 1,
    animationTime: 600,
    animationType: "easeOut",
    equalToMove: true,
  },
};
