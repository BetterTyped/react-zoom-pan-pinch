import { ReactZoomPanPinchContext } from "../models";

export const handleCallback = (
  context: ReactZoomPanPinchContext,
  callback?: (context: any) => void,
): void => {
  if (callback && typeof callback === "function") {
    callback(context);
  }
};
