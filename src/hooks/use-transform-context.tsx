import { useContext } from "react";

import { Context } from "components";

export const useTransformContext = () => {
  const libraryContext = useContext(Context);

  if (!libraryContext) {
    throw new Error("Transform context mus be placed inside TransformWrapper");
  }

  return libraryContext;
};
