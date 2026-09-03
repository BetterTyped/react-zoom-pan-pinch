import React from "react";

import styles from "./styles.module.css";

/* ── Types ──────────────────────────────────────────────────── */

export type FocusChipItem = {
  id: string;
  label: string;
  /** Small glyph shown before the label (emoji, letter, or an SVG icon). */
  icon?: React.ReactNode;
  /** Accent colour used for the glyph badge and the active state. */
  accent?: string;
  /** Optional secondary text shown under the label in the tooltip. */
  hint?: string;
};

type FocusChipsProps = {
  items: FocusChipItem[];
  onSelect: (id: string) => void;
  activeId?: string | null;
  /** Optional caption rendered before the chips ("Zoom to", "Focus"…). */
  title?: string;
  position?:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-center"
    | "bottom-right";
  /** Inline overrides, e.g. a `top` offset to stack under the controls. */
  style?: React.CSSProperties;
};

const POSITION_CLASS_MAP: Record<string, string> = {
  "top-left": styles.controlsTopLeft,
  "top-right": styles.controlsTopRight,
  "bottom-left": styles.controlsBottomLeft,
  "bottom-center": styles.focusChipsBottomCenter,
  "bottom-right": styles.controlsBottomRight,
};

/* ── Component ──────────────────────────────────────────────── */

/**
 * Floating "jump to" chips that sit on top of the viewer, next to the zoom
 * controls. Use these instead of stuffing `extraButtons` into `Controls`
 * when the actions target content (zoomToElement) rather than the viewport.
 * Render inside the same `position: relative` container as the viewer.
 */
export const FocusChips: React.FC<FocusChipsProps> = ({
  items,
  onSelect,
  activeId = null,
  title,
  position = "bottom-left",
  style,
}) => {
  const positionClass =
    POSITION_CLASS_MAP[position] || styles.controlsBottomLeft;

  return (
    <div
      className={`${styles.focusChips} ${positionClass}`}
      style={style}
      role="group"
      aria-label={title ?? "Zoom to element"}
    >
      {title && <span className={styles.focusChipsTitle}>{title}</span>}
      {items.map((item) => {
        const active = item.id === activeId;
        const accent = item.accent ?? "#818cf8";
        return (
          <button
            key={item.id}
            type="button"
            className={`${styles.focusChip} ${
              active ? styles.focusChipActive : ""
            }`}
            style={{ "--chip-accent": accent } as React.CSSProperties}
            onClick={() => onSelect(item.id)}
            aria-pressed={active}
            data-tooltip={item.hint}
          >
            {item.icon !== undefined && (
              <span className={styles.focusChipIcon}>{item.icon}</span>
            )}
            {item.label}
          </button>
        );
      })}
    </div>
  );
};

FocusChips.defaultProps = {
  activeId: null,
  title: undefined,
  position: "bottom-left",
  style: undefined,
};
