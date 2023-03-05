import { useEffect } from "react";

import { getState } from "utils";
import { ReactZoomPanPinchContextState } from "../models";
import { useTransformContext } from "./use-transform-context";

export const useTransformInit = (
  callback: (ref: ReactZoomPanPinchContextState) => void | (() => void),
): void => {
  const libraryContext = useTransformContext();

  useEffect(() => {
    let unmountCallback: void | (() => void);
    let unmount: void | (() => void);
    if (libraryContext.contentComponent && libraryContext.wrapperComponent) {
      unmountCallback = callback(getState(libraryContext));
    } else {
      unmount = libraryContext.onInit((ref) => {
        unmountCallback = callback(getState(ref.instance));
      });
    }
    return () => {
      unmount?.();
      unmountCallback?.();
    };
  }, []);
};
