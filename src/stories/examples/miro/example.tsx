import React from "react";

import { TransformWrapper, TransformComponent } from "../../../components";
import { normalizeArgs } from "../../utils";

const CANVAS_W = 4800;
const CANVAS_H = 3200;

const font =
  'Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

const canvasBase: React.CSSProperties = {
  position: "relative",
  width: CANVAS_W,
  height: CANVAS_H,
  backgroundColor: "#f5f4f1",
  backgroundImage:
    "radial-gradient(rgba(0, 0, 0, 0.07) 1.25px, transparent 1.25px)",
  backgroundSize: "20px 20px",
  fontFamily: font,
};

function Sticky(props: {
  x: number;
  y: number;
  w: number;
  h: number;
  bg: string;
  rot?: number;
  title: string;
  body: string;
}) {
  const { x, y, w, h, bg, rot = 0, title, body } = props;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        minHeight: h,
        padding: "14px 16px",
        background: bg,
        borderRadius: 3,
        boxShadow:
          "0 1px 2px rgba(0,0,0,0.06), 0 4px 14px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
        transform: `rotate(${rot}deg)`,
        transformOrigin: "center center",
        color: "#1a1a1a",
      }}
    >
      <div
        style={{
          fontSize: 15,
          fontWeight: 700,
          lineHeight: 1.35,
          marginBottom: 8,
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.88 }}>{body}</div>
    </div>
  );
}

function Frame(props: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  children?: React.ReactNode;
}) {
  const { x, y, w, h, title, children } = props;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 4,
        background: "#fff",
        boxShadow:
          "0 0 0 1px rgba(92, 107, 192, 0.35), 0 8px 28px rgba(40, 50, 120, 0.12)",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          flexShrink: 0,
          height: 44,
          padding: "0 16px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          background: "linear-gradient(180deg, #faf9ff 0%, #f3f2fb 100%)",
          borderBottom: "1px solid rgba(92, 107, 192, 0.2)",
          color: "#3f51b5",
          fontSize: 14,
          fontWeight: 600,
          letterSpacing: "-0.02em",
        }}
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: 2,
            background: "#5c6bc0",
            opacity: 0.85,
          }}
        />
        {title}
      </div>
      <div style={{ flex: 1, position: "relative", background: "#fff" }}>
        {children}
      </div>
    </div>
  );
}

function ShapeCard(props: {
  x: number;
  y: number;
  label: string;
  accent: string;
}) {
  const { x, y, label, accent } = props;
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        padding: "12px 20px",
        borderRadius: 8,
        background: "#fff",
        border: `2px solid ${accent}`,
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        fontSize: 14,
        fontWeight: 600,
        color: "#263238",
      }}
    >
      {label}
    </div>
  );
}

function SectionLabel(props: { x: number; y: number; text: string }) {
  return (
    <div
      style={{
        position: "absolute",
        left: props.x,
        top: props.y,
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        color: "rgba(0,0,0,0.28)",
      }}
    >
      {props.text}
    </div>
  );
}

function MiroBoard() {
  return (
    <div style={canvasBase}>
      <SectionLabel x={140} y={120} text="Brainstorm" />

      <Sticky
        x={160}
        y={200}
        w={228}
        h={168}
        bg="#fff59d"
        rot={-2.5}
        title="Pain points"
        body="Checkout drops off on mobile — investigate form fields and load time."
      />
      <Sticky
        x={420}
        y={260}
        w={210}
        h={150}
        bg="#ffccbc"
        rot={1.8}
        title="Competitor scan"
        body="Notion + FigJam patterns for onboarding."
      />
      <Sticky
        x={300}
        y={480}
        w={236}
        h={172}
        bg="#c5e1a5"
        rot={-1.2}
        title="Next sprint"
        body="Prototype sticky grid + keyboard panning polish."
      />

      <Frame x={720} y={140} w={1120} h={720} title="Q2 · Discovery">
        <Sticky
          x={48}
          y={56}
          w={260}
          h={188}
          bg="#e3f2fd"
          rot={-1}
          title="Hypothesis"
          body="Teams adopt faster when templates match their ritual (retro, planning)."
        />
        <Sticky
          x={360}
          y={120}
          w={248}
          h={168}
          bg="#f8bbd0"
          rot={2}
          title="Risks"
          body="Scope creep on infinite canvas perf; keep transform on GPU."
        />
        <ShapeCard x={680} y={200} label="API & data layer" accent="#26a69a" />
        <ShapeCard x={520} y={420} label="Realtime sync" accent="#7e57c2" />
        <div
          style={{
            position: "absolute",
            left: 420,
            top: 380,
            width: 320,
            height: 2,
            background:
              "repeating-linear-gradient(90deg, #90a4ae 0, #90a4ae 8px, transparent 8px, transparent 14px)",
            opacity: 0.7,
            transform: "rotate(-8deg)",
            transformOrigin: "left center",
          }}
        />
      </Frame>

      <SectionLabel x={2000} y={120} text="Flows" />

      <Frame x={1960} y={180} w={980} h={640} title="Onboarding journey">
        <div
          style={{
            position: "absolute",
            left: 56,
            top: 80,
            display: "flex",
            alignItems: "center",
            gap: 0,
          }}
        >
          {["Invite", "Template", "Edit", "Share"].map((step, i) => (
            <React.Fragment key={step}>
              <div
                style={{
                  padding: "14px 28px",
                  borderRadius: 999,
                  background: i === 1 ? "#e8eaf6" : "#fff",
                  border:
                    i === 1
                      ? "2px solid #5c6bc0"
                      : "2px solid rgba(0,0,0,0.08)",
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#37474f",
                  boxShadow:
                    i === 1 ? "0 4px 12px rgba(92,107,192,0.2)" : undefined,
                }}
              >
                {step}
              </div>
              {i < 3 && (
                <div
                  style={{
                    width: 48,
                    height: 2,
                    background: "#b0bec5",
                    flexShrink: 0,
                  }}
                />
              )}
            </React.Fragment>
          ))}
        </div>
        <Sticky
          x={56}
          y={280}
          w={280}
          h={200}
          bg="#d1c4e9"
          rot={-0.8}
          title="Open questions"
          body="Do we gate zoom-to-fit behind a setting for power users?"
        />
      </Frame>

      <Sticky
        x={3100}
        y={200}
        w={260}
        h={190}
        bg="#ffe082"
        rot={2.2}
        title="Ship checklist"
        body="Docs · Storybook · regression on wheel + trackpad split."
      />

      <Frame x={3020} y={520} w={900} h={560} title="Design system">
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 60,
            right: 40,
            bottom: 40,
            borderRadius: 8,
            background:
              "repeating-linear-gradient(90deg, transparent, transparent 79px, rgba(0,0,0,0.04) 79px, rgba(0,0,0,0.04) 80px), repeating-linear-gradient(0deg, transparent, transparent 79px, rgba(0,0,0,0.04) 79px, rgba(0,0,0,0.04) 80px)",
            backgroundColor: "#fafafa",
            border: "1px dashed rgba(0,0,0,0.12)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 120,
            top: 140,
            width: 200,
            height: 120,
            borderRadius: 6,
            background: "#fff",
            border: "1px solid rgba(0,0,0,0.1)",
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 380,
            top: 180,
            width: 160,
            height: 160,
            borderRadius: "50%",
            background: "#e3f2fd",
            border: "2px solid #42a5f5",
          }}
        />
      </Frame>

      <svg
        width={CANVAS_W}
        height={CANVAS_H}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          pointerEvents: "none",
        }}
        aria-hidden
      >
        <path
          d="M 580 420 Q 640 360 720 400"
          fill="none"
          stroke="#90a4ae"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
        <path
          d="M 1840 520 L 1960 400"
          fill="none"
          stroke="#90a4ae"
          strokeWidth={2}
          strokeDasharray="6 8"
        />
      </svg>

      <div
        style={{
          position: "absolute",
          left: CANVAS_W - 420,
          top: CANVAS_H - 120,
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "8px 14px",
          borderRadius: 8,
          background: "rgba(255,255,255,0.92)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.06)",
          fontSize: 12,
          color: "#546e7a",
          fontWeight: 500,
        }}
      >
        <span
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #5c6bc0, #7e57c2)",
          }}
        />
        <span
          style={{
            width: 28,
            height: 28,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #26a69a, #00897b)",
            marginLeft: -18,
            border: "2px solid #fff",
          }}
        />
        <span style={{ marginLeft: 4 }}>3 active</span>
      </div>
    </div>
  );
}

const miroViewer: React.CSSProperties = {
  width: "100%",
  height: "100%",
  borderRadius: 0,
  border: "none",
  background: "#eceff1",
  overflow: "hidden",
};

const shellShadow: React.CSSProperties = {
  borderRadius: 14,
  overflow: "hidden",
  boxShadow:
    "0 4px 6px rgba(0,0,0,0.04), 0 24px 48px rgba(15, 20, 40, 0.12), 0 0 0 1px rgba(0,0,0,0.06)",
  background: "#fff",
  maxWidth: "min(1400px, calc(100vw - 48px))",
  margin: "0 auto",
};

export const Example: React.FC<Record<string, unknown>> = (args) => {
  return (
    <div style={{ fontFamily: font }}>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          marginBottom: 14,
          alignItems: "center",
        }}
      >
        <HintChip kbd="⌘ / Ctrl" text="scroll to zoom" />
        <HintChip text="Trackpad / drag to pan" />
      </div>

      <div style={shellShadow}>
        <header
          style={{
            height: 52,
            padding: "0 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #e8eaed",
            background: "#fff",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <span
              style={{
                fontWeight: 700,
                fontSize: 16,
                color: "#1a1a1a",
                letterSpacing: "-0.02em",
              }}
            >
              Workshop board
            </span>
            <span
              style={{
                fontSize: 13,
                color: "#757575",
                padding: "4px 10px",
                borderRadius: 6,
                background: "#f5f5f5",
              }}
            >
              Team space · Editable
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {["Share", "Present", "⋯"].map((t) => (
              <span
                key={t}
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: t === "Share" ? "#fff" : "#5f6368",
                  padding: t === "Share" ? "8px 18px" : "8px 12px",
                  borderRadius: 8,
                  background: t === "Share" ? "#1a73e8" : "transparent",
                  cursor: "default",
                }}
              >
                {t}
              </span>
            ))}
          </div>
        </header>

        <div
          style={{
            height: "clamp(620px, calc(100vh - 280px), 920px)",
            position: "relative",
            background: "#e4e6ea",
          }}
        >
          <aside
            style={{
              position: "absolute",
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 5,
              display: "flex",
              flexDirection: "column",
              gap: 4,
              padding: 6,
              borderRadius: 12,
              background: "rgba(255,255,255,0.95)",
              boxShadow:
                "0 2px 12px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.06)",
              pointerEvents: "none",
            }}
            aria-hidden
          >
            {[
              { c: "#5c6bc0", tip: "Select" },
              { c: "#78909c", tip: "Pan" },
              { c: "#ef5350", tip: "Pen" },
              { c: "#ffb74d", tip: "Note" },
              { c: "#4fc3f7", tip: "Shape" },
              { c: "#9575cd", tip: "Frame" },
            ].map((tool, i) => (
              <div
                key={tool.tip}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: i === 1 ? "rgba(92,107,192,0.12)" : "transparent",
                  border:
                    i === 1 ? "1px solid rgba(92,107,192,0.35)" : "1px solid transparent",
                }}
                title={tool.tip}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: i === 4 ? 4 : i === 5 ? 2 : "50%",
                    background:
                      i === 0
                        ? `linear-gradient(135deg, ${tool.c}, ${tool.c}cc)`
                        : tool.c,
                    opacity: i === 0 ? 1 : 0.85,
                  }}
                />
              </div>
            ))}
          </aside>

          <div
            style={{
              position: "absolute",
              inset: 0,
            }}
          >
            <TransformWrapper
              {...normalizeArgs(args)}
              initialScale={0.45}
              minScale={0.1}
              maxScale={4}
              centerOnInit
              wheel={{
                activationKeys: (keys) =>
                  ["Meta", "Ctrl"].some((key) => keys.includes(key)),
              }}
              trackPadPanning={{
                disabled: false,
                activationKeys: (keys) =>
                  !["Meta", "Ctrl"].some((key) => keys.includes(key)),
              }}
            >
              <TransformComponent
                wrapperStyle={miroViewer}
                contentStyle={{
                  width: CANVAS_W,
                  height: CANVAS_H,
                }}
              >
                <MiroBoard />
              </TransformComponent>
            </TransformWrapper>
          </div>
        </div>
      </div>
    </div>
  );
};

function HintChip(props: { kbd?: string; text: string }) {
  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "7px 14px",
        borderRadius: 10,
        background: "rgba(255,255,255,0.92)",
        border: "1px solid rgba(0,0,0,0.08)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
        fontSize: 12,
        fontWeight: 600,
        color: "#424242",
      }}
    >
      {props.kbd && (
        <kbd
          style={{
            padding: "3px 8px",
            borderRadius: 6,
            background: "#f0f0f0",
            border: "1px solid #ddd",
            fontSize: 11,
            fontWeight: 700,
            fontFamily: "inherit",
          }}
        >
          {props.kbd}
        </kbd>
      )}
      <span>{props.text}</span>
    </div>
  );
}
