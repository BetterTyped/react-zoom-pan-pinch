import React, { useImperativeHandle, useState } from "react";
import { ReactZoomPanPinchProps, ReactZoomPanPinchContext } from "../models";
import { TransformContext } from "./transform-context";

export const TransformWrapper = React.forwardRef(
  (props: ReactZoomPanPinchProps, ref: any) => {
    const [innerRef, setRef] = useState<ReactZoomPanPinchContext | null>(null);

    useImperativeHandle(ref, () => innerRef, [innerRef]);

    return <TransformContext {...props} setRef={setRef} />;
  },
);

export default TransformWrapper;
