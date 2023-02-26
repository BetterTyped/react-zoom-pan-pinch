import React from "react";

import { ReactZoomPanPinchContentRef } from "../..";

import styles from "./styles.module.css";

export const Controls: React.FC<ReactZoomPanPinchContentRef> = ({
  zoomIn,
  zoomOut,
  resetTransform,
  centerView,
}: ReactZoomPanPinchContentRef) => (
  <div className={styles.controlPanel}>
    <button
      type="button"
      className={styles.controlBtn}
      onClick={() => zoomIn()}
      data-testid="zoom-in"
    >
      Zoom In +
    </button>
    <button
      type="button"
      className={styles.controlBtn}
      onClick={() => zoomOut()}
      data-testid="zoom-out"
    >
      Zoom Out -
    </button>
    <button
      type="button"
      className={styles.controlBtn}
      onClick={() => resetTransform()}
      data-testid="reset"
    >
      Reset
    </button>
    <button
      type="button"
      className={styles.controlBtn}
      onClick={() => centerView()}
      data-testid="center"
    >
      Center
    </button>
  </div>
);
