import React from "react";

import { TransformWrapper, TransformComponent } from "../../../components";
import { Controls, normalizeArgs, viewerChrome } from "../../utils";

const font = 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

const SELECTABLE_CLASS = "selectable";

const codeStyle: React.CSSProperties = {
  padding: "2px 6px",
  borderRadius: 4,
  background: "#e7e5e4",
  color: "#c2410c",
  fontSize: 12,
  fontWeight: 600,
  fontFamily: "'SF Mono', 'Fira Code', ui-monospace, monospace",
};

export const Example: React.FC<Record<string, unknown>> = (args) => {
  const normalized = normalizeArgs(args);

  return (
    <div style={{ fontFamily: font, maxWidth: 720 }}>
      <TransformWrapper
        {...normalized}
        centerOnInit
        centerZoomedOut
        panning={{ ...normalized.panning, excluded: [SELECTABLE_CLASS] }}
        trackPadPanning={{ disabled: false }}
      >
        {(utils) => (
          <div style={{ position: "relative" }}>
            <Controls {...utils} />
            <TransformComponent
              wrapperStyle={{
                ...viewerChrome,
                width: "100%",
                height: "clamp(420px, 65vh, 600px)",
              }}
              contentStyle={{ width: 640 }}
            >
              <article
                className={SELECTABLE_CLASS}
                style={{
                  width: 640,
                  padding: "44px 48px",
                  boxSizing: "border-box",
                  background: "#fafaf9",
                  borderRadius: 12,
                  color: "#1c1917",
                  userSelect: "text",
                  cursor: "text",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    padding: "3px 10px",
                    borderRadius: 5,
                    background: "#e0e7ff",
                    color: "#4338ca",
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    marginBottom: 16,
                  }}
                >
                  Documentation
                </div>

                <h1
                  style={{
                    margin: "0 0 8px",
                    fontSize: 28,
                    fontWeight: 800,
                    letterSpacing: "-0.03em",
                    lineHeight: 1.2,
                    color: "#0c0a09",
                  }}
                >
                  Text Selection
                </h1>

                <p
                  style={{
                    margin: "0 0 24px",
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: "#57534e",
                  }}
                >
                  By default the library disables text selection because
                  click-and-drag is used for panning. To allow text selection
                  inside specific areas, use the{" "}
                  <code style={codeStyle}>panning.excluded</code> option with a
                  CSS class name.
                </p>

                <div
                  style={{
                    padding: "16px 20px",
                    borderRadius: 8,
                    background: "#1e293b",
                    color: "#e2e8f0",
                    fontFamily:
                      "'SF Mono', 'Fira Code', ui-monospace, monospace",
                    fontSize: 12,
                    lineHeight: 1.7,
                    marginBottom: 24,
                    overflowX: "auto",
                    whiteSpace: "pre",
                  }}
                >
                  {`<TransformWrapper
  panning={{ excluded: ["selectable"] }}
>
  <TransformComponent>
    <article className="selectable">
      <p>You can select this text!</p>
    </article>
  </TransformComponent>
</TransformWrapper>`}
                </div>

                <h2
                  style={{
                    margin: "0 0 12px",
                    fontSize: 18,
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    color: "#1c1917",
                  }}
                >
                  How it works
                </h2>

                <p
                  style={{
                    margin: "0 0 16px",
                    fontSize: 14,
                    lineHeight: 1.7,
                    color: "#57534e",
                  }}
                >
                  The <code style={codeStyle}>excluded</code> array accepts CSS
                  class names. Any pointer event that originates on — or inside
                  — an element carrying that class is ignored by the panning
                  handler. This lets native browser text selection work normally
                  while all other areas remain pannable.
                </p>

                <ul
                  style={{
                    margin: "0 0 24px",
                    padding: "0 0 0 20px",
                    fontSize: 14,
                    lineHeight: 1.8,
                    color: "#57534e",
                  }}
                >
                  <li>
                    <strong style={{ color: "#1c1917" }}>Click and drag</strong>{" "}
                    on this text to select it — panning is suppressed.
                  </li>
                  <li>
                    <strong style={{ color: "#1c1917" }}>Scroll wheel</strong>{" "}
                    zooms in/out, and{" "}
                    <strong style={{ color: "#1c1917" }}>
                      trackpad panning
                    </strong>{" "}
                    works normally (only click-drag is excluded).
                  </li>
                  <li>
                    <strong style={{ color: "#1c1917" }}>Ctrl+A / Cmd+A</strong>{" "}
                    selects all text inside the article.
                  </li>
                </ul>

                <div
                  style={{
                    padding: "14px 18px",
                    borderRadius: 8,
                    background: "#fef3c7",
                    border: "1px solid #fde68a",
                    fontSize: 13,
                    lineHeight: 1.6,
                    color: "#92400e",
                  }}
                >
                  <strong>Tip:</strong> You can combine exclusions — add both{" "}
                  <code
                    style={{
                      ...codeStyle,
                      background: "#fde68a",
                      color: "#78350f",
                    }}
                  >
                    panningDisabled
                  </code>{" "}
                  and{" "}
                  <code
                    style={{
                      ...codeStyle,
                      background: "#fde68a",
                      color: "#78350f",
                    }}
                  >
                    wheelDisabled
                  </code>{" "}
                  to block both gestures on the same element.
                </div>
              </article>
            </TransformComponent>
          </div>
        )}
      </TransformWrapper>
    </div>
  );
};
