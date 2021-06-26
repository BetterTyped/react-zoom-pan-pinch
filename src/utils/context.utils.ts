import {
  ReactZoomPanPinchContext,
  ReactZoomPanPinchRef,
} from "../models/context.model";
import {
  zoomIn,
  zoomOut,
  setTransform,
  resetTransform,
  zoomToElement,
  centerView,
} from "../core/handlers/handlers.logic";

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
