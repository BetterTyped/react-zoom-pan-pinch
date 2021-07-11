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
    <button className={styles.controlBtn} onClick={() => zoomIn()}>
      Zoom In +
    </button>
    <button className={styles.controlBtn} onClick={() => zoomOut()}>
      Zoom Out -
    </button>
    <button className={styles.controlBtn} onClick={() => resetTransform()}>
      Reset
    </button>
    <button className={styles.controlBtn} onClick={() => centerView()}>
      Center
    </button>
  </div>
);
