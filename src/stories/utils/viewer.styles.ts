import type React from "react";

/**
 * Checkerboard "transparency grid" background — reusable across stories.
 * Apply to TransformComponent's `wrapperStyle` so zoomed-out content shows
 * a visible canvas boundary instead of a flat dark void.
 */
export const checkerboard: React.CSSProperties = {
  background: "#0a0a14",
  backgroundImage: [
    "linear-gradient(45deg, #0e0e1a 25%, transparent 25%)",
    "linear-gradient(-45deg, #0e0e1a 25%, transparent 25%)",
    "linear-gradient(45deg, transparent 75%, #0e0e1a 75%)",
    "linear-gradient(-45deg, transparent 75%, #0e0e1a 75%)",
  ].join(", "),
  backgroundSize: "20px 20px",
  backgroundPosition: "0 0, 0 10px, 10px -10px, -10px 0px",
};

/** Common glass-panel frame used by most story viewers. */
export const viewerFrame: React.CSSProperties = {
  borderRadius: "12px",
  border: "2px solid rgba(255,255,255,0.08)",
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255,0.03)",
};

/**
 * Full "viewer chrome" — frame + checkerboard.
 * Spread into `wrapperStyle` together with sizing overrides.
 */
export const viewerChrome: React.CSSProperties = {
  ...viewerFrame,
  ...checkerboard,
};
