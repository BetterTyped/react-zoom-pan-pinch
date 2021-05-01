import { ReactZoomPanPinchContext } from "../new-models/context.model";

export const handleCallback = (
  callback: (context: ReactZoomPanPinchContext) => void,
  context: ReactZoomPanPinchContext,
) => {
  if (callback && typeof callback === "function") {
    callback(context);
  }
};
