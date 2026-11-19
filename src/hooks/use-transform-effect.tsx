import { useEffect, useRef } from "react";

import { getState } from "utils";
import { ReactZoomPanPinchContextState } from "../models";
import { useTransformContext } from "./use-transform-context";
import {
  StateSnapshot,
  isSameSnapshot,
  takeSnapshot,
} from "./initial-layout.utils";

export const useTransformEffect = (
  callback: (ref: ReactZoomPanPinchContextState) => void | (() => void),
): void => {
  const libraryContext = useTransformContext();
  // Starts as the state the consumer rendered with, so a transform applied
  // during mount (initialPosition*, centerOnInit, fitOnInit) — which happens
  // in a layout effect, before this subscription exists — is delivered once.
  const lastSeen = useRef<StateSnapshot | null>(null);
  if (lastSeen.current === null) {
    lastSeen.current = takeSnapshot(libraryContext.state);
  }

  useEffect(() => {
    let unmountCallback: void | (() => void);
    const unmount = libraryContext.onChange((ref) => {
      lastSeen.current = takeSnapshot(ref.instance.state);
      unmountCallback = callback(getState(ref.instance));
    });

    if (!isSameSnapshot(lastSeen.current, libraryContext.state)) {
      lastSeen.current = takeSnapshot(libraryContext.state);
      unmountCallback = callback(getState(libraryContext));
    }

    return () => {
      unmount();
      unmountCallback?.();
    };
  }, [callback, libraryContext]);
};
