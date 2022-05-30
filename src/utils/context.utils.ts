import {
  centerView,
  resetTransform,
  setTransform,
  zoomIn,
  zoomOut,
  zoomToElement,
} from "../core/handlers/handlers.logic";
import {
  ReactZoomPanPinchContext,
  ReactZoomPanPinchRef,
} from "../models/context.model";

export const getContext = (
  contextInstance: ReactZoomPanPinchContext,
): ReactZoomPanPinchRef => {
  return {
    instance: contextInstance,
    state: contextInstance.transformState,
    zoomIn: zoomIn(contextInstance),
    zoomOut: zoomOut(contextInstance),
    setTransform: setTransform(contextInstance),
    resetTransform: resetTransform(contextInstance),
    centerView: centerView(contextInstance),
    zoomToElement: zoomToElement(contextInstance),
  };
};
