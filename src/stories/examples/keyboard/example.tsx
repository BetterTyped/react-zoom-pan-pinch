import React, { useState } from "react";

import { TransformComponent, TransformWrapper } from "components";
import { Controls, normalizeArgs, viewerChrome } from "stories/utils";
import exampleImg from "../../assets/map.jpg";

const font = 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

const KEYS: Array<[string, string]> = [
  ["← ↑ → ↓", "pan"],
  ["+ / −", "zoom"],
  ["0", "reset"],
];

function KeyHint({ focused }: { focused: boolean }) {
  return (
    <div
      style={{
        position: "absolute",
        left: 16,
        bottom: 16,
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        gap: 10,
        padding: "8px 12px",
        borderRadius: 10,
        background: "rgba(10, 10, 18, 0.78)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: `1px solid ${
          focused ? "rgba(99, 102, 241, 0.9)" : "rgba(255,255,255,0.1)"
        }`,
        color: "rgba(255,255,255,0.8)",
        fontSize: 11,
        fontFamily: font,
        pointerEvents: "none",
        transition: "border-color 120ms ease",
      }}
    >
      <span style={{ fontWeight: 700, opacity: focused ? 1 : 0.6 }}>
        {focused ? "Keyboard active" : "Click the map to focus"}
      </span>
      {KEYS.map(([key, action]) => (
        <span key={key} style={{ display: "inline-flex", gap: 5 }}>
          <kbd
            style={{
              padding: "1px 6px",
              borderRadius: 4,
              background: "rgba(255,255,255,0.12)",
              fontFamily: "inherit",
              fontSize: 11,
            }}
          >
            {key}
          </kbd>
          <span style={{ opacity: 0.6 }}>{action}</span>
        </span>
      ))}
    </div>
  );
}

/**
 * Opt-in keyboard navigation. The wrapper becomes focusable; while it (or
 * anything inside it) has focus, arrows pan, +/- zoom and 0 resets. The
 * toolbar's direction buttons use the same `panBy` control the keys do.
 */
export const Example: React.FC<Record<string, unknown>> = (args) => {
  const normalized = normalizeArgs(args);
  const [focused, setFocused] = useState(false);

  return (
    <TransformWrapper
      {...normalized}
      keyboard={{ disabled: false, panStep: 80, zoomStep: 0.5 }}
      minScale={0.5}
      maxScale={6}
      centerOnInit
    >
      {(utils) => (
        <>
          <Controls
            {...utils}
            extraButtons={[
              { label: "←", onClick: () => utils.panBy(80, 0) },
              { label: "↑", onClick: () => utils.panBy(0, 80) },
              { label: "↓", onClick: () => utils.panBy(0, -80) },
              { label: "→", onClick: () => utils.panBy(-80, 0) },
            ]}
          />
          <KeyHint focused={focused} />
          <TransformComponent
            wrapperStyle={{
              ...viewerChrome,
              width: "100%",
              height: "100%",
              outline: focused ? "2px solid rgba(99, 102, 241, 0.9)" : "none",
              outlineOffset: -2,
            }}
            wrapperProps={{
              onFocus: () => setFocused(true),
              onBlur: () => setFocused(false),
              "aria-label":
                "Map viewer. Use arrow keys to pan, plus and minus to zoom, zero to reset.",
            }}
          >
            <img
              alt="City map"
              src={exampleImg}
              style={{ display: "block", width: 1200 }}
            />
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  );
};
