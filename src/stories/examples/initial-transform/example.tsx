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

const PRESET_ICONS = ["◎", "⊟", "◤", "◈", "◢"];

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

function PresetButton({
  preset,
  icon,
  active,
  onClick,
}: {
  preset: Preset;
  icon: string;
  active: boolean;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const lit = active || hovered;

  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 7,
        padding: "7px 13px 7px 10px",
        borderRadius: 10,
        border: active
          ? "1px solid rgba(129, 140, 248, 0.45)"
          : "1px solid rgba(255,255,255,0.07)",
        background: active
          ? "linear-gradient(135deg, rgba(99,102,241,0.22), rgba(129,140,248,0.10))"
          : lit
            ? "rgba(255,255,255,0.06)"
            : "transparent",
        color: active ? "#c7d2fe" : lit ? "#d4d4d8" : "rgba(255,255,255,0.50)",
        fontSize: 12,
        fontWeight: 600,
        fontFamily: "inherit",
        cursor: "pointer",
        transition:
          "all 0.2s cubic-bezier(.4,0,.2,1)",
        boxShadow: active
          ? "0 0 12px rgba(99,102,241,0.15), 0 0 0 0.5px rgba(129,140,248,0.12) inset"
          : "none",
      }}
    >
      <span
        style={{
          fontSize: 13,
          opacity: active ? 1 : 0.5,
          transition: "opacity 0.2s ease",
        }}
      >
        {icon}
      </span>
      {preset.label}
    </button>
  );
}

export const Example: React.FC<Record<string, unknown>> = (args) => {
  const normalized = normalizeArgs(args);
  const [presetIdx, setPresetIdx] = useState(0);
  const preset = PRESETS[presetIdx];

  return (
    <div
      style={{
        fontFamily: font,
        padding: 20,
        borderRadius: 16,
        background:
          "linear-gradient(160deg, #0c0c18 0%, #101020 40%, #0e0e1c 100%)",
        border: "1px solid rgba(255,255,255,0.06)",
        maxWidth: 660,
      }}
    >
      {/* Preset selector */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 12,
          padding: "6px 6px",
          borderRadius: 14,
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.05)",
          flexWrap: "wrap",
        }}
      >
        {PRESETS.map((p, i) => (
          <PresetButton
            key={p.label}
            preset={p}
            icon={PRESET_ICONS[i]}
            active={presetIdx === i}
            onClick={() => setPresetIdx(i)}
          />
        ))}
      </div>

      {/* Config display */}
      <div
        style={{
          marginBottom: 14,
          padding: "10px 16px",
          borderRadius: 12,
          background:
            "linear-gradient(135deg, rgba(15,15,25,0.85), rgba(20,20,35,0.65))",
          border: "1px solid rgba(255,255,255,0.06)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          display: "flex",
          flexWrap: "wrap",
          gap: "6px 20px",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: 12,
            color: "rgba(255,255,255,0.45)",
            fontFamily: "'SF Mono', 'Fira Code', ui-monospace, monospace",
            letterSpacing: "0.01em",
          }}
        >
          {preset.description}
        </span>
        <span style={{ flex: 1 }} />
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            padding: "3px 10px",
            borderRadius: 6,
            background: preset.centerOnInit
              ? "rgba(52,211,153,0.08)"
              : "rgba(248,113,113,0.08)",
            border: preset.centerOnInit
              ? "1px solid rgba(52,211,153,0.18)"
              : "1px solid rgba(248,113,113,0.18)",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: preset.centerOnInit ? "#34d399" : "#f87171",
              boxShadow: preset.centerOnInit
                ? "0 0 6px rgba(52,211,153,0.5)"
                : "0 0 6px rgba(248,113,113,0.5)",
            }}
          />
          <code
            style={{
              fontSize: 11,
              color: preset.centerOnInit
                ? "rgba(52,211,153,0.9)"
                : "rgba(248,113,113,0.9)",
              fontFamily: "'SF Mono', 'Fira Code', ui-monospace, monospace",
            }}
          >
            centerOnInit: {preset.centerOnInit ? "true" : "false"}
          </code>
        </span>
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
          margin: "16px 0 0",
          fontSize: 12,
          color: "rgba(148, 163, 184, 0.6)",
          lineHeight: 1.7,
          maxWidth: 600,
          letterSpacing: "0.01em",
        }}
      >
        Switch presets above to remount the wrapper with different{" "}
        <code
          style={{
            color: "#a5b4fc",
            padding: "1px 5px",
            borderRadius: 4,
            background: "rgba(99,102,241,0.1)",
            fontSize: 11,
          }}
        >
          initialScale
        </code>{" "}
        and{" "}
        <code
          style={{
            color: "#a5b4fc",
            padding: "1px 5px",
            borderRadius: 4,
            background: "rgba(99,102,241,0.1)",
            fontSize: 11,
          }}
        >
          initialPositionX/Y
        </code>{" "}
        values. The state badge shows live transform values. Use{" "}
        <strong style={{ color: "#d4d4d8", fontWeight: 600 }}>Reset</strong> to
        return to the initial configuration.
      </p>
    </div>
  );
};
