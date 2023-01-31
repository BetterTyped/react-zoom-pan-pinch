import React from "react";

import { ReactZoomPanPinchRef } from "../../models/context.model";

import styles from "./styles.module.css";

export const Controls: React.FC<ReactZoomPanPinchRef> = ({
  zoomIn,
  zoomOut,
  resetTransform,
  centerView,
}: ReactZoomPanPinchRef) => (
  <div className={styles.controlPanel}>
    <button
      type="button"
      className={styles.controlBtn}
      onClick={() => zoomIn()}
    >
      Zoom In +
    </button>
    <button
      type="button"
      className={styles.controlBtn}
      onClick={() => zoomOut()}
    >
      Zoom Out -
    </button>
    <button
      type="button"
      className={styles.controlBtn}
      onClick={() => resetTransform()}
    >
      Reset
    </button>
    <button
      type="button"
      className={styles.controlBtn}
      onClick={() => centerView()}
    >
      Center
    </button>
  </div>
);
