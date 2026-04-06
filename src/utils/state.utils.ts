import {
  LibrarySetup,
  ReactZoomPanPinchProps,
  ReactZoomPanPinchState,
} from "../models/context.model";
import { initialSetup, initialState } from "../constants/state.constants";
import { boundLimiter } from "core/bounds/bounds.utils";

export const createState = (
  props: ReactZoomPanPinchProps,
): ReactZoomPanPinchState => {
  const minScale = props.minScale ?? initialSetup.minScale;
  const maxScale = props.maxScale ?? initialSetup.maxScale;
  const rawScale = props.initialScale ?? initialState.scale;
  const scale = Math.min(Math.max(rawScale, minScale), maxScale);

  const positionX = boundLimiter(
    props.initialPositionX ?? initialState.positionX,
    props.minPositionX ?? -Infinity,
    props.maxPositionX ?? Infinity,
    props.minPositionX != null || props.maxPositionX != null,
  );

  const positionY = boundLimiter(
    props.initialPositionY ?? initialState.positionY,
    props.minPositionY ?? -Infinity,
    props.maxPositionY ?? Infinity,
    props.minPositionY != null || props.maxPositionY != null,
  );

  return {
    previousScale: scale,
    scale,
    positionX,
    positionY,
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
