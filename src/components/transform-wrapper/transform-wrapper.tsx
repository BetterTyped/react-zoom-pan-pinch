import React, { useEffect, useImperativeHandle, useRef } from "react";

import { ZoomPanPinch } from "../../core/instance.core";
import {
  ReactZoomPanPinchContentRef,
  ReactZoomPanPinchProps,
} from "../../models";
import { getControls } from "../../utils";

export const Context = React.createContext<ZoomPanPinch>(null as any);

const getContent = (
  children: ReactZoomPanPinchProps["children"],
  ctx: ReactZoomPanPinchContentRef,
) => {
  if (typeof children === "function") {
    return children(ctx);
  }
  return children;
};

export const TransformWrapper = React.forwardRef(
  (
    props: Omit<ReactZoomPanPinchProps, "ref">,
    ref: React.Ref<ReactZoomPanPinchContentRef>,
  ) => {
    const instance = useRef(new ZoomPanPinch(props)).current;

    const content = getContent(props.children, getControls(instance));

    useImperativeHandle(ref, () => getControls(instance), [instance]);

    useEffect(() => {
      instance.update(props);
    }, [instance, props]);

    return <Context.Provider value={instance}>{content}</Context.Provider>;
  },
);
