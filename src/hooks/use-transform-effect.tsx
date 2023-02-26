import { useEffect } from "react";

import { getState } from "utils";
import { ReactZoomPanPinchContextState } from "../models";
import { useTransformContext } from "./use-transform-context";

export const useTransformEffect = (
  callback: (ref: ReactZoomPanPinchContextState) => void | (() => void),
): void => {
  const libraryContext = useTransformContext();

  useEffect(() => {
    let unmountCallback: void | (() => void);
    const unmount = libraryContext.onChange((ref) => {
      unmountCallback = callback(getState(ref.instance));
    });
    return () => {
      unmount();
      unmountCallback?.();
    };
  }, [callback, libraryContext]);
};
