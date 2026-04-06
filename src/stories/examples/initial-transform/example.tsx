import React from "react";

import { TransformWrapper, TransformComponent } from "../../../components";
import { Controls, normalizeArgs, viewerChrome } from "../../utils";

const viewer: React.CSSProperties = {
  ...viewerChrome,
  width: "520px",
  height: "400px",
  maxWidth: "90vw",
  maxHeight: "75vh",
};

const font = "system-ui, -apple-system, sans-serif";

/** Larger than the viewport so initial offset + scale are obvious. */
function LabeledCanvas() {
  return (
    <div
      style={{
        position: "relative",
        width: 1600,
        height: 1000,
        background:
          "radial-gradient(ellipse 80% 60% at 20% 30%, rgba(99, 102, 241, 0.15), transparent 55%), radial-gradient(ellipse 70% 50% at 80% 70%, rgba(236, 72, 153, 0.12), transparent 50%), #0f111c",
        fontFamily: font,
      }}
    >
      {(
        [
          ["NW", 48, 48],
          ["NE", 1600 - 48 - 180, 48],
          ["SW", 48, 1000 - 120],
          ["SE", 1600 - 200, 1000 - 120],
          ["Center", 800 - 90, 500 - 24],
        ] as const
      ).map(([label, x, y]) => (
        <div
          key={label}
          style={{
            position: "absolute",
            left: x,
            top: y,
            padding: "10px 16px",
            borderRadius: 10,
            background: "rgba(15, 23, 42, 0.85)",
            border: "1px solid rgba(148, 163, 184, 0.35)",
            color: "rgba(226, 232, 240, 0.95)",
            fontSize: 14,
            fontWeight: 700,
            letterSpacing: "0.04em",
          }}
        >
          {label}
        </div>
      ))}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(720px, 85%)",
          color: "rgba(148, 163, 184, 0.9)",
          fontSize: 15,
          lineHeight: 1.6,
          textAlign: "center",
        }}
      >
        This board starts <strong style={{ color: "#a5b4fc" }}>zoomed in</strong>{" "}
        and <strong style={{ color: "#f9a8d4" }}>shifted</strong> using{" "}
        <code style={{ color: "#e2e8f0" }}>initialScale</code> and{" "}
        <code style={{ color: "#e2e8f0" }}>initialPositionX/Y</code>.{" "}
        <code style={{ color: "#e2e8f0" }}>centerOnInit</code> is{" "}
        <strong>off</strong> so the library does not re-center on load.
      </div>
    </div>
  );
}

export const Example: React.FC<Record<string, unknown>> = (args) => {
  const normalized = normalizeArgs(args);

  return (
    <div style={{ fontFamily: font }}>
      <TransformWrapper
        {...normalized}
        centerOnInit={false}
        initialScale={1.65}
        initialPositionX={-280}
        initialPositionY={-160}
        minScale={0.35}
        maxScale={4}
      >
        {(utils) => (
          <div style={{ position: "relative", display: "inline-block" }}>
            <Controls {...utils} />
            <TransformComponent
              wrapperStyle={viewer}
              contentStyle={{ width: 1600, height: 1000 }}
            >
              <LabeledCanvas />
            </TransformComponent>
          </div>
        )}
      </TransformWrapper>
    </div>
  );
};
