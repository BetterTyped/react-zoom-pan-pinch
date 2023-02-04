import { useContext, useEffect, useState } from "react";

import { getContext } from "../utils";
import { Context } from "../components/transform-wrapper";
import { ReactZoomPanPinchRef } from "../models";

const useTransformContext = (): ReactZoomPanPinchRef => {
  const libraryContext = useContext(Context);
  const [values, setValues] = useState(getContext(libraryContext || {}));

  if (!libraryContext) {
    throw new Error("Transform context mus be placed inside TransformWrapper");
  }

  useEffect(() => {
    libraryContext.onChange((ref) => {
      setValues(ref);
    });
  }, [libraryContext]);

  return values;
};

export default useTransformContext;
