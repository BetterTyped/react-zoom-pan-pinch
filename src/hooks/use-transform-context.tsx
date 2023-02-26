import { useContext } from "react";

import { Context } from "../components/transform-wrapper/transform-wrapper";

export const useTransformContext = () => {
  const libraryContext = useContext(Context);

  if (!libraryContext) {
    throw new Error("Transform context mus be placed inside TransformWrapper");
  }

  return libraryContext;
};
