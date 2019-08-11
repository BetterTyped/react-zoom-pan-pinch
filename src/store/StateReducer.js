import {
  SET_SCALE,
  SET_POSITION_X,
  SET_POSITION_Y,
  SET_WRAPPER,
  SET_CONTENT,
  SET_START_COORDS,
  SET_IS_DOWN,
  SET_DISTANCE,
} from "./CONSTANTS";

const defaultCoords = { x: 0, y: 0 };

export let initialState = {
  sensitivity: 0.5,
  zoomInStep: 3,
  zoomOutStep: 2,
  dbClickStep: 5,
  pinchSensitivity: 0.6,
  positionX: 0,
  positionY: 0,
  scale: 1,
  maxScale: 8,
  minScale: 0.5,
  wheelAnimationSpeed: 0,
  zoomAnimationSpeed: 200,
  pinchAnimationSpeed: 0,
  panAnimationSpeed: 0,
  resetAnimationSpeed: 0,
  maxPositionX: null,
  minPositionX: null,
  maxPositionY: null,
  minPositionY: null,
  limitToBounds: true,
  disabled: false,
  zoomingEnabled: true,
  panningEnabled: true,
  pinchEnabled: true,
  dbClickEnabled: true,
  transformEnabled: true,
  enableZoomedOutPanning: false,
  wrapperComponent: null,
  contentComponent: null,
  startCoords: defaultCoords,
  isDown: null,
  distance: null,
  lastPositionZoomEnabled: false,
  enableZoomThrottling: false,
};

export let reducer = (state, action) => {
  switch (action.type) {
    case SET_SCALE:
      return { ...state, scale: action.scale };
    case SET_POSITION_X:
      return { ...state, positionX: action.positionX };
    case SET_POSITION_Y:
      return { ...state, positionY: action.positionY };
    case SET_WRAPPER:
      return { ...state, wrapperComponent: action.wrapperComponent };
    case SET_CONTENT:
      return { ...state, contentComponent: action.contentComponent };
    case SET_START_COORDS:
      return { ...state, startCoords: action.startCoords };
    case SET_IS_DOWN:
      return { ...state, isDown: action.isDown };
    case SET_DISTANCE:
      return { ...state, distance: action.distance };
  }
};
