import { useEffect, useState } from "react";

import { useTransformContext } from "./use-transform-context";
import { getState } from "utils";
import { ReactZoomPanPinchContextState } from "../models";

export function useTransformComponent<T>(
  callback: (state: ReactZoomPanPinchContextState) => T,
): T {
  const libraryContext = useTransformContext();

  const [transformRender, setTransformRender] = useState<T>(
    callback(getState(libraryContext)),
  );

  useEffect(() => {
    let mounted = true;
    const unmount = libraryContext.onChange((ref) => {
      if (mounted) {
        setTransformRender(callback(getState(ref.instance)));
      }
    });
    return () => {
      unmount();
      mounted = false;
    };
  }, [callback, libraryContext]);

  return transformRender;
}
