import { ReactZoomPanPinchRef } from "../models";

export const handleCallback = (
  context: ReactZoomPanPinchRef,
  callback?: (context: ReactZoomPanPinchRef) => void,
): void => {
  if (callback && typeof callback === "function") {
    callback(context);
  }
};
