import { useLayoutEffect, useRef } from "react";

import { initialSetup } from "constants/state.constants";
import { ZoomPanPinch } from "core/instance.core";
import { ReactZoomPanPinchProps, ReactZoomPanPinchRef } from "models";

export const useZoomPanPinch = (props?: ReactZoomPanPinchProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const instance = useRef(new ZoomPanPinch({ ...initialSetup, ...props }));

  const useTransformCallback = useRef<
    (data: {
      positionX: number;
      positionY: number;
      scale: number;
      previousScale: number;
      ref: ReactZoomPanPinchRef;
    }) => void
  >(() => {});

  useLayoutEffect(() => {
    const inst = instance.current;
    if (contentRef.current && wrapperRef.current) {
      inst.init(wrapperRef.current, contentRef.current);
    }
    const unmount = inst.onTransform((data) => {
      useTransformCallback.current(data);
    });

    return () => {
      inst.cleanupWindowEvents();
      unmount();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const useTransform = (callback: typeof useTransformCallback.current) => {
    useTransformCallback.current = callback;
  };

  return {
    contentRef,
    wrapperRef,
    instance,
    useTransform,
  };
};
