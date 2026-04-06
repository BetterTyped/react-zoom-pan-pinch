import React from "react";

import { ReactZoomPanPinchContentRef } from "../../models/context.model";

import styles from "./styles.module.css";

const ZoomInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M11 11L14 14"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M7 5V9M5 7H9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const ZoomOutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M11 11L14 14"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M5 7H9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const ResetIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M2.5 2.5V6H6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2.87 10A6 6 0 1 0 4.05 4.05L2.5 6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CenterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M8 2V5M8 11V14M2 8H5M11 8H14"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export type ControlButton = {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
};

type ControlsProps = ReactZoomPanPinchContentRef & {
  extraButtons?: ControlButton[];
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
};

export const Controls: React.FC<ControlsProps> = ({
  zoomIn,
  zoomOut,
  resetTransform,
  centerView,
  extraButtons,
  position = "top-left",
}: ControlsProps) => {
  const positionClass =
    position === "top-right"
      ? styles.controlsTopRight
      : position === "bottom-left"
        ? styles.controlsBottomLeft
        : position === "bottom-right"
          ? styles.controlsBottomRight
          : styles.controlsTopLeft;

  return (
    <div className={`${styles.controlBar} ${positionClass}`}>
      <div className={styles.controlGroup}>
        <button
          type="button"
          className={styles.controlIcon}
          onClick={() => zoomIn()}
          data-tooltip="Zoom in"
        >
          <ZoomInIcon />
        </button>
        <button
          type="button"
          className={styles.controlIcon}
          onClick={() => zoomOut()}
          data-tooltip="Zoom out"
        >
          <ZoomOutIcon />
        </button>
      </div>

      <span className={styles.controlDivider} />

      <div className={styles.controlGroup}>
        <button
          type="button"
          className={styles.controlIcon}
          onClick={() => resetTransform()}
          data-tooltip="Reset"
        >
          <ResetIcon />
        </button>
        <button
          type="button"
          className={styles.controlIcon}
          onClick={() => centerView()}
          data-tooltip="Center"
        >
          <CenterIcon />
        </button>
      </div>

      {extraButtons && extraButtons.length > 0 && (
        <>
          <span className={styles.controlDivider} />
          <div className={styles.controlGroup}>
            {extraButtons.map((btn) => (
              <button
                key={btn.label}
                type="button"
                className={btn.icon ? styles.controlIcon : styles.controlText}
                onClick={btn.onClick}
                data-tooltip={btn.label}
              >
                {btn.icon ?? btn.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};
