import {
  LibrarySetup,
  ReactZoomPanPinchState,
  ReactZoomPanPinchBaseClasses,
} from "../models/context.model";

export const initialState: ReactZoomPanPinchState = {
  previousScale: 1,
  scale: 1,
  positionX: 0,
  positionY: 0,
};

export const initialSetup: LibrarySetup = {
  disabled: false,
  minPositionX: null,
  maxPositionX: null,
  minPositionY: null,
  maxPositionY: null,
  minScale: 1,
  maxScale: 8,
  limitToBounds: true,
  centerZoomedOut: false,
  centerOnInit: false,
  disablePadding: false,
  smooth: true,
  detached: false,
  wheel: {
    step: 0.015,
    disabled: false,
    wheelDisabled: false,
    touchPadDisabled: false,
    activationKeys: [],
    excluded: [],
  },
  trackPadPanning: {
    disabled: true,
    velocityDisabled: false,
    lockAxisX: false,
    lockAxisY: false,
    activationKeys: [],
    excluded: [],
  },
  panning: {
    disabled: false,
    velocityDisabled: false,
    lockAxisX: false,
    lockAxisY: false,
    allowLeftClickPan: true,
    allowMiddleClickPan: true,
    allowRightClickPan: true,
    activationKeys: [],
    excluded: [],
  },
  pinch: {
    step: 5,
    disabled: false,
    allowPanning: true,
    excluded: [],
  },
  doubleClick: {
    disabled: false,
    step: 0.7,
    mode: "zoomIn",
    animationType: "easeOut",
    animationTime: 200,
    excluded: [],
  },
  zoomAnimation: {
    disabled: false,
    size: 0.4,
    animationTime: 200,
    animationType: "easeOut",
  },
  autoAlignment: {
    disabled: false,
    sizeX: 100,
    sizeY: 100,
    animationTime: 200,
    velocityAlignmentTime: 400,
    animationType: "easeOut",
  },
  velocityAnimation: {
    disabled: false,
    sensitivityMouse: 1,
    sensitivityTouch: 1.2,
    maxStrengthMouse: 20,
    maxStrengthTouch: 40,
    inertia: 1,
    animationTime: 300,
    maxAnimationTime: 800,
    animationType: "easeOut",
  },
};

export const baseClasses: ReactZoomPanPinchBaseClasses = {
  wrapperClass: "react-transform-wrapper",
  contentClass: "react-transform-component",
};
