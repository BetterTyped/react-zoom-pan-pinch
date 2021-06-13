import React, { useImperativeHandle, useState } from "react";
import { ReactZoomPanPinchProps, ReactZoomPanPinchRef } from "../models";
import { TransformContext } from "./transform-context";

export const TransformWrapper = React.forwardRef(
  (
    props: Omit<ReactZoomPanPinchProps, "ref">,
    ref: React.Ref<ReactZoomPanPinchRef>,
  ) => {
    const [innerRef, setRef] = useState<ReactZoomPanPinchRef | null>(null);

    useImperativeHandle(ref, () => innerRef as any, [innerRef]);

    return <TransformContext {...props} setRef={setRef as any} />;
  },
);

export default TransformWrapper;
