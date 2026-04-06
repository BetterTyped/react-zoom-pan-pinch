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
  const clampedScale = Math.min(Math.max(rawScale, minScale), maxScale);
  const rawPositionX = props.initialPositionX ?? initialState.positionX;
  const rawPositionY = props.initialPositionY ?? initialState.positionY;
  const hasMinMaxX =
    props.minPositionX != null || props.maxPositionX != null;
  const hasMinMaxY =
    props.minPositionY != null || props.maxPositionY != null;

  return {
    previousScale: clampedScale,
    scale: clampedScale,
    positionX: boundLimiter(
      rawPositionX,
      props.minPositionX ?? -Infinity,
      props.maxPositionX ?? Infinity,
      hasMinMaxX,
    ),
    positionY: boundLimiter(
      rawPositionY,
      props.minPositionY ?? -Infinity,
      props.maxPositionY ?? Infinity,
      hasMinMaxY,
    ),
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
