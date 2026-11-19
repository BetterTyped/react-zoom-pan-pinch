import { useEffect, useRef, useState } from "react";

import { useTransformContext } from "./use-transform-context";
import { getState } from "utils";
import { ReactZoomPanPinchContextState } from "../models";
import {
  StateSnapshot,
  isSameSnapshot,
  takeSnapshot,
} from "./initial-layout.utils";

export function useTransformComponent<T>(
  callback: (state: ReactZoomPanPinchContextState) => T,
): T {
  const libraryContext = useTransformContext();
  const lastSeen = useRef<StateSnapshot | null>(null);

  const [transformRender, setTransformRender] = useState<T>(() => {
    lastSeen.current = takeSnapshot(libraryContext.state);
    return callback(getState(libraryContext));
  });

  useEffect(() => {
    let mounted = true;
    const unmount = libraryContext.onChange((ref) => {
      if (mounted) {
        lastSeen.current = takeSnapshot(ref.instance.state);
        setTransformRender(callback(getState(ref.instance)));
      }
    });

    // The instance initializes in a layout effect, so a transform applied on
    // mount (initialPosition*, centerOnInit, fitOnInit) can land before this
    // subscription exists. Catch up when the state moved since the last
    // render; the snapshot check keeps this from re-rendering in a loop.
    if (!isSameSnapshot(lastSeen.current, libraryContext.state)) {
      lastSeen.current = takeSnapshot(libraryContext.state);
      setTransformRender(callback(getState(libraryContext)));
    }

    return () => {
      unmount();
      mounted = false;
    };
  }, [callback, libraryContext]);

  return transformRender;
}
