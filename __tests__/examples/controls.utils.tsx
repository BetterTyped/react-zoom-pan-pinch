import React from "react";

import { useControls } from "../../src";

export const Controls: React.FC = () => {
  const { zoomIn, zoomOut, resetTransform, centerView } = useControls();

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          zoomIn();
          console.log("zoomIn");
        }}
        data-testid="zoom-in"
      >
        Zoom In +
      </button>
      <button
        type="button"
        onClick={() => {
          zoomOut();
          console.log("zoomOut");
        }}
        data-testid="zoom-out"
      >
        Zoom Out -
      </button>
      <button
        type="button"
        onClick={() => {
          resetTransform();
          console.log("resetTransform");
        }}
        data-testid="reset"
      >
        Reset
      </button>
      <button
        type="button"
        onClick={() => {
          centerView();
          console.log("centerView");
        }}
        data-testid="center"
      >
        Center
      </button>
    </div>
  );
};
