import React from "react";

import { ReactZoomPanPinchContentRef } from "../../src";

export const Controls: React.FC<ReactZoomPanPinchContentRef> = ({
  zoomIn,
  zoomOut,
  resetTransform,
  centerView,
}: ReactZoomPanPinchContentRef) => (
  <div>
    <button type="button" onClick={() => zoomIn()} data-testid="zoom-in">
      Zoom In +
    </button>
    <button type="button" onClick={() => zoomOut()} data-testid="zoom-out">
      Zoom Out -
    </button>
    <button type="button" onClick={() => resetTransform()} data-testid="reset">
      Reset
    </button>
    <button type="button" onClick={() => centerView()} data-testid="center">
      Center
    </button>
  </div>
);
