import { SET_SCALE, SET_SENSITIVITY, SET_POSITION_X, SET_POSITION_Y } from "./CONSTANTS";

export let initialState = {
  sensitivity: 0.4,
  positionX: 0,
  positionY: 0,
  scale: 1,
  maxScale: 4,
  minScale: 0.8,
  maxPositionX: null,
  minPositionX: null,
  maxPositionY: null,
  minPositionY: null,
  limitToBounds: true,
  disable: false,
};

export let reducer = (state, action) => {
  switch (action.type) {
    case SET_SCALE:
      return { ...state, scale: action.scale };
    case SET_POSITION_X:
      return { ...state, positionX: action.positionX };
    case SET_POSITION_Y:
      return { ...state, positionY: action.positionY };
    case SET_SENSITIVITY:
      return { ...state, sensitivity: action.sensitivity };
  }
};
