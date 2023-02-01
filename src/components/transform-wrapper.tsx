import React, {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";

import { ZoomPanPinch } from "../core/instance.core";
import { ReactZoomPanPinchProps, ReactZoomPanPinchRef } from "../models";
import { getContext } from "../utils";
import { contextInitialState } from "../constants/state.constants";

export const Context = React.createContext(contextInitialState);

export const TransformWrapper = React.forwardRef(
  (
    props: Omit<ReactZoomPanPinchProps, "ref">,
    ref: React.Ref<ReactZoomPanPinchRef>,
  ) => {
    const [, forceUpdate] = useState(0);
    const { children, performance } = props;
    const instance = useRef(
      new ZoomPanPinch(props, () => {
        if (!performance) {
          forceUpdate((prev) => prev + 1);
        }
      }),
    ).current;

    const content = useMemo(() => {
      if (typeof children === "function") {
        return children(getContext(instance));
      }
      return children;
    }, [children, instance]);

    const value = useMemo(() => {
      return {
        ...instance.transformState,
        setComponents: instance.init,
        contextInstance: instance,
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(instance.transformState)]);

    useImperativeHandle(ref, () => getContext(instance), [instance]);

    useEffect(() => {
      instance.update(props);
    }, [instance, props]);

    return <Context.Provider value={value}>{content}</Context.Provider>;
  },
);

export default TransformWrapper;
