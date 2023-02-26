import { ReactZoomPanPinchContentRef } from "models";
import { getControls } from "utils";
import { useTransformContext } from "./use-transform-context";

export const useControls = (): ReactZoomPanPinchContentRef => {
  const libraryContext = useTransformContext();

  return getControls(libraryContext);
};
