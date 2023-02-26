import React from "react";
import { render, screen } from "@testing-library/react";

import { ReactZoomPanPinchProps } from "../../src";
import { Example } from "../utils/example";

export const renderExample = (props?: ReactZoomPanPinchProps) => {
  let renders = 0;
  let renderPropsValues = {};

  render(
    <Example
      {...props}
      onRender={() => {
        renders += 1;
      }}
      onRenderProps={(ref) => {
        renderPropsValues = ref;
      }}
    />,
  );
  // controls buttons
  const zoomInBtn = screen.getByTestId("zoom-in");
  const zoomOutBtn = screen.getByTestId("zoom-out");
  const resetBtn = screen.getByTestId("reset");
  const center = screen.getByTestId("center");
  // containers
  const content = screen.getByTestId("content");
  const wrapper = screen.getByTestId("wrapper");

  return {
    renders,
    renderPropsValues,
    zoomInBtn,
    zoomOutBtn,
    resetBtn,
    center,
    content,
    wrapper,
  };
};
