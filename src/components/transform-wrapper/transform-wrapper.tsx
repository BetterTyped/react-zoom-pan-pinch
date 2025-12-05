import React, {
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

import { ZoomPanPinch } from "../../core/instance.core";
import {
  ReactZoomPanPinchContentRef,
  ReactZoomPanPinchProps,
} from "../../models";
import { getControls } from "../../utils";

export const Context = React.createContext<ZoomPanPinch>(null as any);

// Context pour détecter un TransformWrapper parent
const ParentContext = React.createContext<ZoomPanPinch | null>(null);

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
    // Vérifier s'il y a un TransformWrapper parent via le Context
    const parentContext = useContext(ParentContext);

    const instance = useRef(new ZoomPanPinch(props, parentContext)).current;

    const content = getContent(props.children, getControls(instance));

    useImperativeHandle(ref, () => getControls(instance), [instance]);

    useEffect(() => {
      instance.update(props);
    }, [instance, props]);

    return (
      <ParentContext.Provider value={instance}>
        <Context.Provider value={instance}>{content}</Context.Provider>
      </ParentContext.Provider>
    );
  },
);
