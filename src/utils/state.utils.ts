import {
  LibrarySetup,
  ReactZoomPanPinchProps,
  ReactZoomPanPinchState,
} from "../models/context.model";
import { initialSetup, initialState } from "../constants/state.constants";

export const createState = (
  props: ReactZoomPanPinchProps,
): ReactZoomPanPinchState => {
  return {
    previousScale: props.initialScale ?? initialState.scale,
    scale: props.initialScale ?? initialState.scale,
    positionX: props.initialPositionX ?? initialState.positionX,
    positionY: props.initialPositionY ?? initialState.positionY,
  };
};

export const createSetup = (props: ReactZoomPanPinchProps): LibrarySetup => {
  const newSetup = { ...initialSetup };

  Object.keys(props).forEach((key) => {
    const validValue = typeof props[key] !== "undefined";
    const validParameter = typeof initialSetup[key] !== "undefined";
    if (validParameter && validValue) {
      const dataType = Object.prototype.toString.call(initialSetup[key]);
      const isObject = dataType === "[object Object]";
      const isArray = dataType === "[object Array]";
      if (isObject) {
        newSetup[key] = { ...initialSetup[key], ...props[key] };
      } else if (isArray) {
        newSetup[key] = [...initialSetup[key], ...props[key]];
      } else {
        newSetup[key] = props[key];
      }
    }
  });

  return newSetup;
};
