import { useContext } from "react";
import { Context } from "../components/transform-context";
import { ReactZoomPanPinchContext } from "../models";

const useTransformContext = (): ReactZoomPanPinchContext => {
  const libraryContext = useContext(Context);

  if (!libraryContext.contextInstance) {
    throw new Error("Transform context mus be placed inside TransformWrapper");
  }

  return libraryContext.contextInstance;
};

export default useTransformContext;
