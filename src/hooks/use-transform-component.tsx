import { useMemo } from "react";

import { useTransformContext } from "./use-transform-context";
import { getState } from "utils";
import { ReactZoomPanPinchContextState } from "../models";

export function useTransformComponent<T>(
  callback: (state: ReactZoomPanPinchContextState) => T,
): T {
  const libraryContext = useTransformContext();

  return useMemo(
    () => callback(getState(libraryContext)),
    [libraryContext, callback],
  );
}
