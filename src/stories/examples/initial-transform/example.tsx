import React, { useState } from "react";

import { TransformWrapper, TransformComponent } from "../../../components";
import { Controls, normalizeArgs, viewerChrome } from "../../utils";
import { useTransformComponent } from "../../../hooks";
import exampleImg from "../../assets/medium-image.jpg";

const font = "system-ui, -apple-system, sans-serif";

const viewer: React.CSSProperties = {
  ...viewerChrome,
  width: "600px",
  height: "440px",
  maxWidth: "90vw",
  maxHeight: "75vh",
};

interface Preset {
  label: string;
  description: string;
  initialScale: number;
  initialPositionX: number;
  initialPositionY: number;
  centerOnInit: boolean;
}

const PRESETS: Preset[] = [
  {
    label: "Centered overview",
    description: "centerOnInit: true — scale 1, library auto-centers",
    initialScale: 1,
    initialPositionX: 0,
    initialPositionY: 0,
    centerOnInit: true,
  },
  {
    label: "Zoomed out",
    description: "initialScale: 0.4 — see the whole image with padding",
    initialScale: 0.4,
    initialPositionX: 0,
    initialPositionY: 0,
    centerOnInit: true,
  },
  {
    label: "Top-left corner",
    description: "initialScale: 2.5 — start zoomed into the top-left",
    initialScale: 2.5,
    initialPositionX: 0,
    initialPositionY: 0,
    centerOnInit: false,
  },
  {
    label: "Center detail",
    description: "initialScale: 2 — offset to center the middle region",
    initialScale: 2,
    initialPositionX: -460,
    initialPositionY: -220,
    centerOnInit: false,
  },
  {
    label: "Bottom-right",
    description: "initialScale: 2.2 — panned to the bottom-right corner",
    initialScale: 2.2,
    initialPositionX: -900,
    initialPositionY: -440,
    centerOnInit: false,
  },
];

function StateBadge() {
  return useTransformComponent(({ state }) => (
    <div
      style={{
        position: "absolute",
        bottom: 14,
        left: 14,
        zIndex: 10,
        padding: "8px 12px",
        borderRadius: 10,
        background: "rgba(10, 10, 18, 0.88)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.08)",
        fontFamily: "'SF Mono', 'Fira Code', ui-monospace, monospace",
        fontSize: 11,
        lineHeight: 1.7,
        color: "rgba(255,255,255,0.6)",
        userSelect: "none",
        pointerEvents: "none",
      }}
    >
      <div>
        <span style={{ color: "#818cf8" }}>scale</span>:{" "}
        {state.scale.toFixed(2)}
      </div>
      <div>
        <span style={{ color: "#34d399" }}>positionX</span>:{" "}
        {state.positionX.toFixed(0)}
      </div>
      <div>
        <span style={{ color: "#f9a8d4" }}>positionY</span>:{" "}
        {state.positionY.toFixed(0)}
      </div>
    </div>
  ));
}

export const Example: React.FC<Record<string, unknown>> = (args) => {
  const normalized = normalizeArgs(args);
  const [presetIdx, setPresetIdx] = useState(0);
  const preset = PRESETS[presetIdx];

  return (
    <div style={{ fontFamily: font }}>
      {/* Preset selector */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          marginBottom: 14,
        }}
      >
        {PRESETS.map((p, i) => {
          const on = presetIdx === i;
          return (
            <button
              key={p.label}
              type="button"
              onClick={() => setPresetIdx(i)}
              style={{
                padding: "8px 14px",
                borderRadius: 10,
                border: on
                  ? "1px solid rgba(129, 140, 248, 0.5)"
                  : "1px solid rgba(255,255,255,0.1)",
                background: on
                  ? "rgba(99, 102, 241, 0.18)"
                  : "rgba(255,255,255,0.04)",
                color: on ? "#c7d2fe" : "rgba(255,255,255,0.55)",
                fontSize: 12,
                fontWeight: 600,
                fontFamily: "inherit",
                cursor: "pointer",
                transition: "background 0.15s ease, border-color 0.15s ease",
              }}
            >
              {p.label}
            </button>
          );
        })}
      </div>

      {/* Config display */}
      <div
        style={{
          marginBottom: 14,
          padding: "10px 14px",
          borderRadius: 10,
          background: "rgba(15, 15, 20, 0.6)",
          border: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          flexWrap: "wrap",
          gap: "6px 20px",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.4)",
            fontFamily: "ui-monospace, monospace",
          }}
        >
          {preset.description}
        </span>
        <span style={{ flex: 1 }} />
        <code
          style={{
            fontSize: 11,
            color: preset.centerOnInit ? "#34d399" : "#f87171",
            fontFamily: "ui-monospace, monospace",
          }}
        >
          centerOnInit: {preset.centerOnInit ? "true" : "false"}
        </code>
      </div>

      {/* Viewer — key forces remount on preset change */}
      <TransformWrapper
        key={presetIdx}
        {...normalized}
        initialScale={preset.initialScale}
        initialPositionX={preset.initialPositionX}
        initialPositionY={preset.initialPositionY}
        centerOnInit={preset.centerOnInit}
        minScale={0.2}
        maxScale={5}
      >
        {(utils) => (
          <div style={{ position: "relative", display: "inline-block" }}>
            <Controls {...utils} />
            <StateBadge />
            <TransformComponent wrapperStyle={viewer}>
              <img
                src={exampleImg}
                alt="example"
                style={{ display: "block", width: "100%" }}
              />
            </TransformComponent>
          </div>
        )}
      </TransformWrapper>

      <p
        style={{
          margin: "14px 0 0",
          fontSize: 12,
          color: "rgba(148, 163, 184, 0.8)",
          lineHeight: 1.6,
          maxWidth: 600,
        }}
      >
        Switch presets above to remount the wrapper with different{" "}
        <code style={{ color: "#c7d2fe" }}>initialScale</code> and{" "}
        <code style={{ color: "#c7d2fe" }}>initialPositionX/Y</code> values. The
        state badge shows live transform values. Use{" "}
        <strong style={{ color: "#d4d4d8" }}>Reset</strong> to return to the
        initial configuration.
      </p>
    </div>
  );
};
