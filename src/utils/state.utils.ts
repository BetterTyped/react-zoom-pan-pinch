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
  const minScale = Math.max(props.minScale ?? initialSetup.minScale, 1e-7);
  const maxScale = props.maxScale ?? initialSetup.maxScale;
  const rawScale = props.initialScale ?? initialState.scale;
  const scale = Math.min(Math.max(rawScale, minScale), maxScale);

  // A named initial position ("center", "right", …) needs the sizes, so it
  // starts at 0 and `applyNamedInitialPosition` places it once laid out.
  const positionX = boundLimiter(
    typeof props.initialPositionX === "number"
      ? props.initialPositionX
      : initialState.positionX,
    props.minPositionX ?? -Infinity,
    props.maxPositionX ?? Infinity,
    props.minPositionX != null || props.maxPositionX != null,
  );

  const positionY = boundLimiter(
    typeof props.initialPositionY === "number"
      ? props.initialPositionY
      : initialState.positionY,
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

  Object.keys(props).forEach((key: string) => {
    const k = key as keyof ReactZoomPanPinchProps & keyof LibrarySetup;
    const validValue =
      typeof (props as Record<string, unknown>)[k] !== "undefined";
    const validParameter =
      typeof (initialSetup as Record<string, unknown>)[k] !== "undefined";
    if (validParameter && validValue) {
      const dataType = Object.prototype.toString.call(
        (initialSetup as Record<string, unknown>)[k],
      );
      const isObject = dataType === "[object Object]";
      const isArray = dataType === "[object Array]";
      if (isObject) {
        (newSetup as Record<string, unknown>)[k] = {
          ...((initialSetup as Record<string, unknown>)[k] as object),
          ...((props as Record<string, unknown>)[k] as object),
        };
      } else if (isArray) {
        (newSetup as Record<string, unknown>)[k] = [
          ...((initialSetup as Record<string, unknown>)[k] as unknown[]),
          ...((props as Record<string, unknown>)[k] as unknown[]),
        ];
      } else {
        (newSetup as Record<string, unknown>)[k] = (
          props as Record<string, unknown>
        )[k];
      }
    }
  });

  if (newSetup.minScale <= 0) {
    newSetup.minScale = 1e-7;
  }

  return newSetup;
};
