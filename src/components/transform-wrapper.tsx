import React, { useImperativeHandle, useMemo, useRef, useState } from "react";

import { ZoomPanPinch } from "core/instance.core";
import { ReactZoomPanPinchProps, ReactZoomPanPinchRef } from "../models";
import { getContext } from "utils";
import { contextInitialState } from "constants/state.constants";

export const Context = React.createContext(contextInitialState);

export const TransformWrapper = React.forwardRef(
  (
    props: Omit<ReactZoomPanPinchProps, "ref">,
    ref: React.Ref<ReactZoomPanPinchRef>,
  ) => {
    const { children } = props;
    const instance = useRef(new ZoomPanPinch(props)).current;

    const [innerRef, setRef] = useState<ReactZoomPanPinchRef | null>(null);

    const content = useMemo(() => {
      const ctx = getContext(instance);
      setRef(ctx);

      if (typeof children === "function") {
        return children(getContext(instance));
      }
      return children;
    }, [children, instance]);

    const value = useMemo(() => {
      return {
        ...instance.transformState,
        setComponents: instance.setComponents,
        contextInstance: instance,
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(instance.transformState)]);

    useImperativeHandle(ref, () => innerRef as any, [innerRef]);

    return <Context.Provider value={value}>{content}</Context.Provider>;
  },
);

export default TransformWrapper;
