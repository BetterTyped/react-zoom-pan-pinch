import React, { useState } from "react";

import { TransformWrapper, TransformComponent } from "../../../components";
import { Controls, normalizeArgs, viewerChrome } from "../../utils";

const viewer: React.CSSProperties = {
  ...viewerChrome,
  width: "580px",
  height: "460px",
  maxWidth: "92vw",
  maxHeight: "80vh",
};

const font = "system-ui, -apple-system, sans-serif";

function MarbleField() {
  return (
    <div
      style={{
        width: 2200,
        height: 1400,
        position: "relative",
        overflow: "hidden",
        background: "#080b14",
      }}
    >
      {Array.from({ length: 140 }, (_, i) => {
        const x = (i * 127) % 2100;
        const y = Math.floor((i * 83) / 2100) * 140 + (i % 5) * 18;
        const hue = (i * 37) % 360;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              left: x,
              top: y,
              width: 28 + (i % 4) * 10,
              height: 28 + (i % 3) * 8,
              borderRadius: "50%",
              background: `hsla(${hue}, 62%, 58%, 0.42)`,
              boxShadow: `0 0 20px hsla(${hue}, 70%, 50%, 0.25)`,
            }}
          />
        );
      })}
      <p
        style={{
          position: "absolute",
          left: 80,
          top: 80,
          maxWidth: 520,
          margin: 0,
          fontFamily: font,
          fontSize: 16,
          lineHeight: 1.55,
          color: "rgba(226, 232, 240, 0.88)",
        }}
      >
        Drag quickly and <strong>release</strong>: with inertia on, the canvas
        keeps gliding and eases out. Turn inertia <strong>off</strong> and the
        motion stops as soon as you let go.
      </p>
    </div>
  );
}

export const Example: React.FC<Record<string, unknown>> = (args) => {
  const normalized = normalizeArgs(args);
  const [inertiaOn, setInertiaOn] = useState(true);

  const velocityAnimation = {
    ...(normalized.velocityAnimation ?? {}),
    disabled: !inertiaOn,
  };

  return (
    <div style={{ fontFamily: font }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 12,
          alignItems: "center",
        }}
      >
        <button
          type="button"
          onClick={() => setInertiaOn(true)}
          style={{
            fontFamily: font,
            fontSize: 12,
            fontWeight: 600,
            padding: "8px 14px",
            borderRadius: 10,
            border: inertiaOn
              ? "1px solid rgba(52, 211, 153, 0.5)"
              : "1px solid rgba(255,255,255,0.12)",
            background: inertiaOn
              ? "rgba(16, 185, 129, 0.18)"
              : "rgba(255,255,255,0.06)",
            color: inertiaOn ? "rgba(167, 243, 208, 0.95)" : "rgba(255,255,255,0.65)",
            cursor: "pointer",
          }}
        >
          Inertia on
        </button>
        <button
          type="button"
          onClick={() => setInertiaOn(false)}
          style={{
            fontFamily: font,
            fontSize: 12,
            fontWeight: 600,
            padding: "8px 14px",
            borderRadius: 10,
            border: !inertiaOn
              ? "1px solid rgba(248, 113, 113, 0.45)"
              : "1px solid rgba(255,255,255,0.12)",
            background: !inertiaOn
              ? "rgba(239, 68, 68, 0.15)"
              : "rgba(255,255,255,0.06)",
            color: !inertiaOn ? "rgba(254, 202, 202, 0.95)" : "rgba(255,255,255,0.65)",
            cursor: "pointer",
          }}
        >
          Inertia off
        </button>
        <span
          style={{
            fontSize: 12,
            color: "rgba(148, 163, 184, 0.95)",
            marginLeft: 4,
          }}
        >
          <code style={{ color: "#e2e8f0" }}>velocityAnimation.disabled</code>
        </span>
      </div>

      <TransformWrapper
        {...normalized}
        centerOnInit
        velocityAnimation={velocityAnimation}
        doubleClick={{ ...normalized.doubleClick, disabled: true }}
      >
        {(utils) => (
          <div style={{ position: "relative", display: "inline-block" }}>
            <Controls {...utils} />
            <TransformComponent
              wrapperStyle={viewer}
              contentStyle={{ width: 2200, height: 1400 }}
            >
              <MarbleField />
            </TransformComponent>
          </div>
        )}
      </TransformWrapper>
    </div>
  );
};
