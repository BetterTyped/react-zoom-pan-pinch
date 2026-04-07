import React, { useCallback, useEffect, useRef, useState } from "react";

import { TransformWrapper, TransformComponent } from "../../../components";
import { Controls, normalizeArgs, viewerChrome } from "../../utils";
import type { ReactZoomPanPinchRef } from "../../../models/context.model";

const font = 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

const CANVAS_W = 4200;
const CANVAS_H = 2800;

/* ── Procedural starfield ──────────────────────────────────── */

function hash(i: number) {
  let n = i;
  // eslint-disable-next-line no-bitwise
  n = ((n >> 16) ^ n) * 0x45d9f3b;
  // eslint-disable-next-line no-bitwise
  n = ((n >> 16) ^ n) * 0x45d9f3b;
  // eslint-disable-next-line no-bitwise
  return ((n >> 16) ^ n) >>> 0;
}

interface Star {
  x: number;
  y: number;
  r: number;
  o: number;
}

const STARS: Star[] = Array.from({ length: 320 }, (_, i) => {
  const h = hash(i + 7);
  return {
    x: h % CANVAS_W,
    y: hash(i * 3 + 11) % CANVAS_H,
    r: 0.6 + (h % 30) / 20,
    o: 0.15 + (h % 60) / 100,
  };
});

interface Nebula {
  x: number;
  y: number;
  rx: number;
  ry: number;
  hue: number;
  sat: number;
  opacity: number;
}

const NEBULAE: Nebula[] = [
  { x: 700, y: 500, rx: 420, ry: 280, hue: 270, sat: 65, opacity: 0.18 },
  { x: 2100, y: 1400, rx: 500, ry: 320, hue: 340, sat: 60, opacity: 0.16 },
  { x: 3200, y: 700, rx: 360, ry: 440, hue: 190, sat: 55, opacity: 0.2 },
  { x: 1400, y: 2100, rx: 380, ry: 240, hue: 30, sat: 50, opacity: 0.14 },
  { x: 3500, y: 2200, rx: 340, ry: 280, hue: 210, sat: 58, opacity: 0.17 },
  { x: 500, y: 1800, rx: 280, ry: 320, hue: 150, sat: 45, opacity: 0.12 },
];

interface CelestialObject {
  x: number;
  y: number;
  name: string;
  sub: string;
  hue: number;
  size: number;
}

const OBJECTS: CelestialObject[] = [
  {
    x: 700,
    y: 500,
    name: "Orion Nebula",
    sub: "M42 · Emission nebula",
    hue: 270,
    size: 14,
  },
  {
    x: 2100,
    y: 1400,
    name: "Carina Cluster",
    sub: "NGC 3372 · Star cluster",
    hue: 340,
    size: 16,
  },
  {
    x: 3200,
    y: 700,
    name: "Eagle Nebula",
    sub: "M16 · Pillars of Creation",
    hue: 190,
    size: 12,
  },
  {
    x: 1400,
    y: 2100,
    name: "Flame Nebula",
    sub: "NGC 2024 · H II region",
    hue: 30,
    size: 10,
  },
  {
    x: 3500,
    y: 2200,
    name: "Helix Nebula",
    sub: "NGC 7293 · Planetary",
    hue: 210,
    size: 13,
  },
  {
    x: 500,
    y: 1800,
    name: "Rosette Nebula",
    sub: "NGC 2237 · Emission",
    hue: 150,
    size: 11,
  },
];

/* Constellation lines */
const CONSTELLATIONS: [number, number, number, number][] = [
  [640, 460, 820, 380],
  [820, 380, 960, 520],
  [960, 520, 1050, 430],
  [2050, 1350, 2200, 1280],
  [2200, 1280, 2300, 1400],
  [3140, 650, 3300, 580],
  [3300, 580, 3380, 720],
  [3380, 720, 3280, 800],
  [1350, 2060, 1500, 1980],
  [1500, 1980, 1480, 2160],
];

/* ── Planet (CSS sphere) ───────────────────────────────────── */

function Planet(props: {
  x: number;
  y: number;
  size: number;
  hue: number;
  name: string;
  rings: boolean;
}) {
  const { x, y, size, hue, name, rings } = props;
  return (
    <div style={{ position: "absolute", left: x - size, top: y - size }}>
      <div
        style={{
          width: size * 2,
          height: size * 2,
          borderRadius: "50%",
          background: `radial-gradient(
            circle at 35% 30%,
            hsl(${hue}, 55%, 72%) 0%,
            hsl(${hue}, 50%, 48%) 40%,
            hsl(${hue}, 45%, 22%) 80%,
            hsl(${hue}, 40%, 10%) 100%
          )`,
          boxShadow: `
            0 0 ${size}px hsla(${hue}, 60%, 50%, 0.35),
            0 0 ${size * 3}px hsla(${hue}, 60%, 40%, 0.15)
          `,
          position: "relative",
        }}
      >
        {rings && (
          <div
            style={{
              position: "absolute",
              left: -size * 0.7,
              top: "50%",
              width: size * 3.4,
              height: size * 0.7,
              marginTop: -size * 0.15,
              borderRadius: "50%",
              border: `2px solid hsla(${hue}, 40%, 60%, 0.3)`,
              background: `linear-gradient(
                180deg,
                transparent 40%,
                hsla(${hue}, 35%, 55%, 0.08) 50%,
                transparent 60%
              )`,
              transform: "rotateX(70deg)",
            }}
          />
        )}
      </div>
      <div
        style={{
          textAlign: "center",
          marginTop: 10,
          fontSize: 11,
          fontWeight: 600,
          color: `hsla(${hue}, 50%, 80%, 0.7)`,
          letterSpacing: "0.05em",
          textTransform: "uppercase",
          fontFamily: font,
        }}
      >
        {name}
      </div>
    </div>
  );
}

/* ── Space canvas ──────────────────────────────────────────── */

const SpaceCanvas = React.memo(function SpaceCanvas() {
  return (
    <div
      style={{
        position: "relative",
        width: CANVAS_W,
        height: CANVAS_H,
        background:
          "radial-gradient(ellipse 80% 60% at 40% 35%, #0c1229 0%, #060a18 50%, #020510 100%)",
        overflow: "hidden",
      }}
    >
      {/* Nebulae */}
      {NEBULAE.map((n) => (
        <div
          key={`nebula-${n.x}-${n.y}`}
          style={{
            position: "absolute",
            left: n.x - n.rx,
            top: n.y - n.ry,
            width: n.rx * 2,
            height: n.ry * 2,
            borderRadius: "50%",
            background: `radial-gradient(
              ellipse at center,
              hsla(${n.hue}, ${n.sat}%, 55%, ${n.opacity}) 0%,
              hsla(${n.hue}, ${n.sat}%, 40%, ${n.opacity * 0.5}) 35%,
              hsla(${n.hue}, ${n.sat}%, 30%, ${n.opacity * 0.15}) 65%,
              transparent 100%
            )`,
            filter: "blur(8px)",
            pointerEvents: "none",
          }}
        />
      ))}

      {/* Stars SVG */}
      <svg
        width={CANVAS_W}
        height={CANVAS_H}
        style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
        aria-hidden
      >
        {STARS.map((s) => (
          <circle
            key={`star-${s.x}-${s.y}`}
            cx={s.x}
            cy={s.y}
            r={s.r}
            fill={`rgba(220, 230, 255, ${s.o})`}
          />
        ))}

        {/* Constellation lines + vertex stars */}
        {CONSTELLATIONS.map(([x1, y1, x2, y2]) => (
          <g key={`${x1}-${y1}-${x2}-${y2}`}>
            <line
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(148, 163, 184, 0.18)"
              strokeWidth={0.8}
              strokeDasharray="4 6"
            />
            <circle cx={x1} cy={y1} r={2} fill="rgba(200, 215, 240, 0.35)" />
            <circle cx={x2} cy={y2} r={2} fill="rgba(200, 215, 240, 0.35)" />
          </g>
        ))}
      </svg>

      {/* Planets */}
      <Planet
        x={1700}
        y={800}
        size={48}
        hue={25}
        name="Kepler-442b"
        rings={false}
      />
      <Planet
        x={2900}
        y={1800}
        size={64}
        hue={220}
        name="Neptune Prime"
        rings
      />
      <Planet
        x={900}
        y={1300}
        size={32}
        hue={0}
        name="Proxima c"
        rings={false}
      />

      {/* Celestial object labels */}
      {OBJECTS.map((obj) => (
        <div
          key={obj.name}
          style={{ position: "absolute", left: obj.x + 20, top: obj.y - 12 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 2,
            }}
          >
            <div
              style={{
                width: obj.size,
                height: obj.size,
                borderRadius: "50%",
                background: `radial-gradient(
                  circle at 40% 35%,
                  hsla(${obj.hue}, 80%, 80%, 0.9),
                  hsla(${obj.hue}, 70%, 50%, 0.7)
                )`,
                boxShadow: `0 0 ${obj.size}px hsla(${obj.hue}, 60%, 60%, 0.4)`,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "rgba(226, 232, 240, 0.9)",
                letterSpacing: "-0.01em",
                fontFamily: font,
                whiteSpace: "nowrap",
              }}
            >
              {obj.name}
            </span>
          </div>
          <span
            style={{
              fontSize: 11,
              color: "rgba(148, 163, 184, 0.6)",
              fontFamily: font,
              marginLeft: obj.size + 8,
            }}
          >
            {obj.sub}
          </span>
        </div>
      ))}

      {/* Center title */}
      <div
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: 900,
            letterSpacing: "0.2em",
            fontFamily: font,
            userSelect: "none",
            color: "transparent",
            background:
              "linear-gradient(180deg, rgba(148, 163, 184, 0.18) 0%, rgba(100, 116, 139, 0.08) 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 0 60px rgba(56, 189, 248, 0.06)",
          }}
        >
          EXPLORE
        </div>
        <div
          style={{
            fontSize: 12,
            fontWeight: 500,
            letterSpacing: "0.25em",
            color: "rgba(148, 163, 184, 0.18)",
            textTransform: "uppercase",
            marginTop: 4,
          }}
        >
          Deep space explorer
        </div>
      </div>
    </div>
  );
});

/* ── Velocity gauge (DOM-driven, no re-renders) ──────────── */

function VelocityGauge() {
  const barRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const lastRef = useRef({ x: 0, y: 0, t: 0 });
  const speedRef = useRef(0);
  const rafRef = useRef(0);

  const updateDOM = useCallback((v: number) => {
    const pct = Math.min(v / 12, 1) * 100;
    if (barRef.current) {
      barRef.current.style.width = `${pct}%`;
      barRef.current.style.opacity = pct > 0 ? "1" : "0.3";
    }
    if (labelRef.current) {
      labelRef.current.textContent = `${Math.round(v * 10) / 10}`;
    }
    if (dotRef.current) {
      dotRef.current.style.boxShadow =
        v > 2
          ? "0 0 8px rgba(56, 189, 248, 0.6)"
          : "0 0 4px rgba(56, 189, 248, 0.2)";
      dotRef.current.style.background =
        v > 2 ? "rgba(56, 189, 248, 0.9)" : "rgba(56, 189, 248, 0.4)";
    }
  }, []);

  const decay = useCallback(() => {
    speedRef.current *= 0.92;
    if (speedRef.current < 0.5) speedRef.current = 0;
    updateDOM(speedRef.current);
    if (speedRef.current > 0) {
      rafRef.current = requestAnimationFrame(decay);
    }
  }, [updateDOM]);

  useEffect(() => {
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  const onTransform = useCallback(
    (
      _ref: ReactZoomPanPinchRef,
      st: { positionX: number; positionY: number },
    ) => {
      const now = performance.now();
      const dt = now - lastRef.current.t;
      if (dt > 0 && lastRef.current.t > 0) {
        const dx = st.positionX - lastRef.current.x;
        const dy = st.positionY - lastRef.current.y;
        speedRef.current =
          (Math.sqrt(dx * dx + dy * dy) / Math.max(dt, 1)) * 16;
      }
      lastRef.current = { x: st.positionX, y: st.positionY, t: now };
      cancelAnimationFrame(rafRef.current);
      updateDOM(speedRef.current);
      rafRef.current = requestAnimationFrame(decay);
    },
    [decay, updateDOM],
  );

  return { onTransform, barRef, labelRef, dotRef };
}

/* ── Toggle pill ───────────────────────────────────────────── */

function TogglePill(props: { on: boolean; onToggle: (v: boolean) => void }) {
  const { on, onToggle } = props;

  return (
    <div
      style={{
        display: "inline-flex",
        borderRadius: 12,
        background: "rgba(15, 23, 42, 0.85)",
        border: "1px solid rgba(255,255,255,0.12)",
        backdropFilter: "blur(12px)",
        padding: 4,
        gap: 2,
        fontFamily: font,
      }}
    >
      <button
        type="button"
        onClick={() => onToggle(true)}
        style={{
          padding: "8px 18px",
          borderRadius: 9,
          border: "none",
          fontSize: 13,
          fontWeight: 700,
          fontFamily: font,
          cursor: "pointer",
          transition: "all 0.2s ease",
          background: on
            ? "linear-gradient(135deg, rgba(16, 185, 129, 0.35), rgba(52, 211, 153, 0.2))"
            : "transparent",
          color: on ? "#6ee7b7" : "rgba(203, 213, 225, 0.7)",
          boxShadow: on
            ? "0 0 0 1px rgba(52, 211, 153, 0.4) inset, 0 2px 8px rgba(16, 185, 129, 0.2)"
            : "none",
          display: "flex",
          alignItems: "center",
          gap: 7,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M2 7C2 7 4 3.5 7 3.5S12 7 12 7"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M3 9.5C4 10.5 5.5 11 7 11S10 10.5 11 9.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.5"
          />
        </svg>
        Momentum
      </button>
      <button
        type="button"
        onClick={() => onToggle(false)}
        style={{
          padding: "8px 18px",
          borderRadius: 9,
          border: "none",
          fontSize: 13,
          fontWeight: 700,
          fontFamily: font,
          cursor: "pointer",
          transition: "all 0.2s ease",
          background: !on
            ? "linear-gradient(135deg, rgba(239, 68, 68, 0.3), rgba(248, 113, 113, 0.18))"
            : "transparent",
          color: !on ? "#fca5a5" : "rgba(203, 213, 225, 0.7)",
          boxShadow: !on
            ? "0 0 0 1px rgba(248, 113, 113, 0.4) inset, 0 2px 8px rgba(239, 68, 68, 0.15)"
            : "none",
          display: "flex",
          alignItems: "center",
          gap: 7,
        }}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect
            x="3"
            y="3"
            width="8"
            height="8"
            rx="2"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M6 6L8 8M8 6L6 8"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </svg>
        Locked
      </button>
    </div>
  );
}

/* ── Sensitivity slider ────────────────────────────────────── */

function ParamSlider(props: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  display: (v: number) => string;
}) {
  const { label, value, min, max, step, onChange, display } = props;
  const inputId = `param-slider-${label.toLowerCase().replace(/\s+/g, "-")}`;
  return (
    <label
      htmlFor={inputId}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontSize: 12,
        fontWeight: 700,
        color: "rgba(226, 232, 240, 0.85)",
        fontFamily: font,
        cursor: "default",
      }}
    >
      {label}
      <input
        id={inputId}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: 100,
          accentColor: "#38bdf8",
          cursor: "pointer",
        }}
      />
      <span
        style={{
          fontSize: 11,
          color: "#e2e8f0",
          fontVariantNumeric: "tabular-nums",
          fontWeight: 600,
          minWidth: 32,
        }}
      >
        {display(value)}
      </span>
    </label>
  );
}

/* ── Main ──────────────────────────────────────────────────── */

const viewer: React.CSSProperties = {
  ...viewerChrome,
  width: "100%",
  height: "clamp(480px, calc(100vh - 320px), 720px)",
};

export const Example: React.FC<Record<string, unknown>> = (args) => {
  const normalized = normalizeArgs(args);
  const [inertiaOn, setInertiaOn] = useState(true);
  const [sensitivity, setSensitivity] = useState(1);
  const [friction, setFriction] = useState(0.93);

  const velocityAnimation = {
    ...(normalized.velocityAnimation ?? {}),
    disabled: !inertiaOn,
    sensitivityMouse: sensitivity,
    inertia: friction,
  };

  const gauge = VelocityGauge();

  return (
    <div style={{ fontFamily: font, maxWidth: 960 }}>
      {/* ── Top control strip ────────────────────────────── */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 14,
          marginBottom: 14,
          alignItems: "center",
        }}
      >
        <TogglePill on={inertiaOn} onToggle={setInertiaOn} />

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            alignItems: "center",
            padding: "8px 16px",
            borderRadius: 12,
            background: "rgba(15, 23, 42, 0.85)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}
        >
          <ParamSlider
            label="Sensitivity"
            value={sensitivity}
            min={0.2}
            max={3}
            step={0.1}
            onChange={setSensitivity}
            display={(v) => `${v.toFixed(1)}×`}
          />
          <ParamSlider
            label="Friction"
            value={friction}
            min={0.8}
            max={0.99}
            step={0.01}
            onChange={setFriction}
            display={(v) => `${(v * 100).toFixed(0)}%`}
          />
        </div>
      </div>

      {/* ── Viewer ───────────────────────────────────────── */}
      <div style={{ position: "relative" }}>
        <TransformWrapper
          {...normalized}
          centerOnInit
          limitToBounds={false}
          velocityAnimation={velocityAnimation}
          doubleClick={{ ...normalized.doubleClick, disabled: true }}
          onTransform={gauge.onTransform}
        >
          {(utils) => (
            <div style={{ position: "relative" }}>
              <Controls {...utils} />

              {/* Velocity HUD */}
              <div
                style={{
                  position: "absolute",
                  bottom: 14,
                  right: 14,
                  zIndex: 4,
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "7px 14px",
                  borderRadius: 10,
                  background: "rgba(2, 6, 23, 0.75)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  backdropFilter: "blur(8px)",
                  fontFamily: font,
                  fontSize: 12,
                  fontWeight: 600,
                  color: "rgba(148, 163, 184, 0.8)",
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                <div
                  ref={gauge.dotRef}
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: "rgba(56, 189, 248, 0.4)",
                    transition: "background 0.15s, box-shadow 0.15s",
                    flexShrink: 0,
                  }}
                />
                <span style={{ color: "rgba(226, 232, 240, 0.65)" }}>vel</span>
                <span
                  ref={gauge.labelRef}
                  style={{
                    color: "rgba(226, 232, 240, 0.9)",
                    minWidth: 24,
                    textAlign: "right",
                  }}
                >
                  0
                </span>
                <div
                  style={{
                    width: 60,
                    height: 4,
                    borderRadius: 2,
                    background: "rgba(255,255,255,0.06)",
                    overflow: "hidden",
                  }}
                >
                  <div
                    ref={gauge.barRef}
                    style={{
                      height: "100%",
                      width: "0%",
                      borderRadius: 2,
                      background:
                        "linear-gradient(90deg, rgba(56, 189, 248, 0.7), rgba(139, 92, 246, 0.7))",
                      transition: "width 0.08s linear",
                    }}
                  />
                </div>
              </div>

              <TransformComponent
                wrapperStyle={viewer}
                contentStyle={{ width: CANVAS_W, height: CANVAS_H }}
              >
                <SpaceCanvas />
              </TransformComponent>
            </div>
          )}
        </TransformWrapper>

        {/* Instruction overlay */}
        <div
          style={{
            position: "absolute",
            bottom: 56,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "8px 20px",
            borderRadius: 999,
            background: "rgba(2, 6, 23, 0.7)",
            border: "1px solid rgba(255,255,255,0.06)",
            backdropFilter: "blur(8px)",
            fontSize: 12,
            fontWeight: 500,
            color: "rgba(148, 163, 184, 0.7)",
            fontFamily: font,
            pointerEvents: "none",
            whiteSpace: "nowrap",
            zIndex: 3,
          }}
        >
          Drag quickly and{" "}
          <strong style={{ color: "rgba(226, 232, 240, 0.85)" }}>
            release
          </strong>{" "}
          to feel the momentum
        </div>
      </div>

      {/* ── API reference ────────────────────────────────── */}
      <div
        style={{
          marginTop: 16,
          padding: "16px 20px",
          borderRadius: 14,
          background: "rgba(15, 23, 42, 0.7)",
          border: "1px solid rgba(56, 189, 248, 0.15)",
          fontFamily: font,
          display: "flex",
          alignItems: "flex-start",
          gap: 14,
        }}
      >
        <span
          style={{
            flexShrink: 0,
            width: 28,
            height: 28,
            borderRadius: 8,
            background: "linear-gradient(135deg, #0ea5e9, #6366f1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 13,
            fontWeight: 800,
            color: "#fff",
            marginTop: 2,
          }}
        >
          v
        </span>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 10,
            fontSize: 13,
            lineHeight: 1.55,
            color: "#94a3b8",
          }}
        >
          {[
            {
              prop: "velocityAnimation.disabled",
              desc: "Enable or disable post-release momentum",
              accent: "#a78bfa",
            },
            {
              prop: "sensitivityMouse",
              desc: "How much initial velocity is captured from gesture speed",
              accent: "#38bdf8",
            },
            {
              prop: "inertia",
              desc: "Decay coefficient — higher values produce a longer, smoother glide",
              accent: "#38bdf8",
            },
          ].map((item) => (
            <div
              key={item.prop}
              style={{ display: "flex", alignItems: "baseline", gap: 8 }}
            >
              <code
                style={{
                  flexShrink: 0,
                  padding: "2px 8px",
                  borderRadius: 5,
                  background: `${item.accent}15`,
                  border: `1px solid ${item.accent}30`,
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: "'SF Mono', ui-monospace, monospace",
                  color: item.accent,
                }}
              >
                {item.prop}
              </code>
              <span style={{ color: "#cbd5e1" }}>{item.desc}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
