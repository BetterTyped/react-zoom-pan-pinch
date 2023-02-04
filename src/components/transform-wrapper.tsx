import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

import { ZoomPanPinch } from "../core/instance.core";
import { ReactZoomPanPinchProps, ReactZoomPanPinchRef } from "../models";
import { getContext } from "../utils";

export const Context = React.createContext<ZoomPanPinch>(null as any);

const getContent = (
  children: ReactZoomPanPinchProps["children"],
  ctx: ReactZoomPanPinchRef,
) => {
  if (typeof children === "function") {
    return children(ctx);
  }
  return children;
};

export const TransformWrapper = React.forwardRef(
  (
    props: Omit<ReactZoomPanPinchProps, "ref">,
    ref: React.Ref<ReactZoomPanPinchRef>,
  ) => {
    const [, forceUpdate] = useState(0);
    const { children } = props;
    const instance = useRef(new ZoomPanPinch(props)).current;

    const content = getContent(props.children, getContext(instance));

    const handleOnChange = useCallback(() => {
      if (typeof children === "function") {
        forceUpdate((prev) => prev + 1);
      }
    }, [children]);

    useImperativeHandle(ref, () => getContext(instance), [instance]);

    useEffect(() => {
      instance.update(props);
    }, [instance, props]);

    useEffect(() => {
      return instance.onChange(handleOnChange);
    }, [instance, props, handleOnChange]);

    return <Context.Provider value={instance}>{content}</Context.Provider>;
  },
);

export default TransformWrapper;
