import React from "react";

import { ReactZoomPanPinchContentRef } from "../../models/context.model";

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
