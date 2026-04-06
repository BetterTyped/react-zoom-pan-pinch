import React from "react";

import { ReactZoomPanPinchContentRef } from "../../models/context.model";

import styles from "./styles.module.css";

/* ── Built-in icons ─────────────────────────────────────────── */

const ZoomInIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M7 5V9M5 7H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ZoomOutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
    <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M5 7H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
    <path d="M8 2V5M8 11V14M2 8H5M11 8H14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/* ── Reusable icons for stories ─────────────────────────────── */

/** Crosshair target — zoom-to-element / focus */
export const TargetIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="5" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="8" cy="8" r="1.5" fill="currentColor" />
    <path d="M8 1.5V4M8 12V14.5M1.5 8H4M12 8H14.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
  </svg>
);

/** Toggle switch — enable/disable a feature */
export const ToggleIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1.5" y="4.5" width="13" height="7" rx="3.5" stroke="currentColor" strokeWidth="1.4" />
    <circle cx="11" cy="8" r="2.2" fill="currentColor" />
  </svg>
);

/** Lock to vertical axis (arrows up/down) */
export const LockVerticalIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 2L8 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M5 4.5L8 2L11 4.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 11.5L8 14L11 11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Lock to horizontal axis (arrows left/right) */
export const LockHorizontalIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M2 8L14 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M4.5 5L2 8L4.5 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M11.5 5L14 8L11.5 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Free movement (4-direction arrows) */
export const FreeMovementIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 2V14M2 8H14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <path d="M6.5 3.5L8 2L9.5 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M6.5 12.5L8 14L9.5 12.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3.5 6.5L2 8L3.5 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12.5 6.5L14 8L12.5 9.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** X / close / deselect */
export const CloseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 4L12 12M12 4L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

/** Numbered target (1, 2, 3…) with a dot in center */
export const NumberedTargetIcon = ({ n }: { n: number }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" />
    <text
      x="8"
      y="8"
      textAnchor="middle"
      dominantBaseline="central"
      fill="currentColor"
      fontSize="8"
      fontWeight="700"
      fontFamily="ui-sans-serif, system-ui, sans-serif"
    >
      {n}
    </text>
  </svg>
);

/* ── Types ──────────────────────────────────────────────────── */

export type ControlButton = {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  active?: boolean;
};

type ControlsProps = ReactZoomPanPinchContentRef & {
  extraButtons?: ControlButton[];
  position?:
    | "top-left"
    | "top-center"
    | "top-right"
    | "bottom-left"
    | "bottom-right";
};

/* ── Component ──────────────────────────────────────────────── */

export const Controls: React.FC<ControlsProps> = ({
  zoomIn,
  zoomOut,
  resetTransform,
  centerView,
  extraButtons,
  position = "top-left",
}) => {
  const positionClass =
    position === "top-center"
      ? styles.controlsTopCenter
      : position === "top-right"
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
            {extraButtons.map((btn) => {
              const base = btn.icon ? styles.controlIcon : styles.controlText;
              const cls = btn.active
                ? `${base} ${styles.controlIconActive}`
                : base;
              return (
                <button
                  key={btn.label}
                  type="button"
                  className={cls}
                  onClick={btn.onClick}
                  data-tooltip={btn.label}
                >
                  {btn.icon ?? btn.label}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};
