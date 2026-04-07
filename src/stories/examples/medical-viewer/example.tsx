import React, { useCallback, useState } from "react";

import { TransformWrapper, TransformComponent } from "../../../components";
import { useTransformComponent } from "../../../hooks";
import { Controls, normalizeArgs } from "../../utils";
import { ChestXray, XRAY_W, XRAY_H } from "./chest-xray";

const font =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
const mono = '"SF Mono", ui-monospace, "Cascadia Code", monospace';

type WindowPreset = {
  id: string;
  label: string;
  brightness: number;
  contrast: number;
};

const PRESETS: WindowPreset[] = [
  { id: "default", label: "Default", brightness: 1, contrast: 1 },
  { id: "lung", label: "Lung", brightness: 1.3, contrast: 1.6 },
  { id: "bone", label: "Bone", brightness: 0.85, contrast: 2.0 },
  { id: "soft", label: "Soft tissue", brightness: 1.15, contrast: 0.85 },
  { id: "mediastinum", label: "Mediastinum", brightness: 0.9, contrast: 1.35 },
];

interface Finding {
  id: string;
  x: number;
  y: number;
  label: string;
  detail: string;
  severity: "normal" | "mild" | "significant";
}

const FINDINGS: Finding[] = [
  {
    id: "f1",
    x: 320,
    y: 580,
    label: "Cardiomediastinal",
    detail: "Heart size within normal limits. No mediastinal widening.",
    severity: "normal",
  },
  {
    id: "f2",
    x: 680,
    y: 450,
    label: "Left hilum",
    detail: "Mildly prominent left hilum — consider lymphadenopathy.",
    severity: "mild",
  },
  {
    id: "f3",
    x: 250,
    y: 720,
    label: "Right base",
    detail: "Subtle opacity at right costophrenic angle — small effusion?",
    severity: "significant",
  },
  {
    id: "f4",
    x: 512,
    y: 300,
    label: "Trachea",
    detail: "Midline trachea. No deviation.",
    severity: "normal",
  },
];

const SEV_COLORS: Record<Finding["severity"], string> = {
  normal: "#22c55e",
  mild: "#f59e0b",
  significant: "#ef4444",
};

/* ── Toolbar primitives ─────────────────────────────────────── */

function ToolbarGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <span
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          color: "#444",
          marginRight: 4,
          whiteSpace: "nowrap",
        }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

function ToolbarButton({
  label,
  active,
  onClick,
  accent,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  accent: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        fontFamily: "inherit",
        fontSize: 11,
        fontWeight: 600,
        padding: "5px 10px",
        borderRadius: 6,
        border: active ? `1px solid ${accent}55` : "1px solid #222",
        background: active ? `${accent}18` : "transparent",
        color: active ? accent : "#666",
        cursor: "pointer",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

function ToolbarDivider() {
  return (
    <span
      style={{
        width: 1,
        height: 20,
        background: "#222",
        margin: "0 6px",
        flexShrink: 0,
      }}
    />
  );
}

/* ── DICOM corner overlays ──────────────────────────────────── */

const overlayBase: React.CSSProperties = {
  position: "absolute",
  zIndex: 10,
  fontFamily: mono,
  fontSize: 11,
  lineHeight: 1.6,
  color: "#888",
  pointerEvents: "none",
  userSelect: "none",
  textShadow: "0 1px 4px rgba(0,0,0,0.9)",
};

function DicomOverlayTL() {
  return (
    <div style={{ ...overlayBase, top: 16, left: 16 }}>
      <div style={{ color: "#aaa", fontWeight: 700, marginBottom: 2 }}>
        SMITH, JOHN A
      </div>
      <div>DOB: 15-Mar-1978 · M</div>
      <div>MRN: 00847291</div>
      <div style={{ marginTop: 6, fontSize: 10, color: "#555" }}>
        Lumen Regional Medical Center
      </div>
    </div>
  );
}

function DicomOverlayTR({
  preset,
  inverted,
}: {
  preset: WindowPreset;
  inverted: boolean;
}) {
  return (
    <div style={{ ...overlayBase, top: 16, right: 16, textAlign: "right" }}>
      <div>CR · PA Chest</div>
      <div>2024-12-08 14:32</div>
      <div style={{ marginTop: 6 }}>
        W: {(preset.contrast * 400).toFixed(0)} L:{" "}
        {(preset.brightness * 40).toFixed(0)}
      </div>
      {inverted && <div style={{ color: "#60a5fa" }}>INVERTED</div>}
    </div>
  );
}

function DicomOverlayBL() {
  return (
    <div style={{ ...overlayBase, bottom: 50, left: 16 }}>
      <div>Series: 1 · Image: 1/1</div>
      <div>
        Matrix: {XRAY_W} × {XRAY_H}
      </div>
    </div>
  );
}

/* ── Finding marker on image ────────────────────────────────── */

function FindingMarker({
  finding: f,
  active,
  onToggle,
}: {
  finding: Finding;
  active: boolean;
  onToggle: () => void;
}) {
  const color = SEV_COLORS[f.severity];

  return (
    <>
      <button
        type="button"
        id={`finding-${f.id}`}
        aria-label={f.label}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        style={{
          position: "absolute",
          left: f.x,
          top: f.y,
          width: 24,
          height: 24,
          marginLeft: -12,
          marginTop: -12,
          borderRadius: "50%",
          border: `2px solid ${color}`,
          background: active ? `${color}35` : "transparent",
          cursor: "pointer",
          boxShadow: active
            ? `0 0 0 6px ${color}22, 0 0 16px ${color}44`
            : `0 0 12px ${color}33`,
          transition: "box-shadow 0.2s ease, background 0.2s ease",
          zIndex: active ? 8 : 5,
          padding: 0,
        }}
      />

      {active && (
        <div
          style={{
            position: "absolute",
            left: f.x + 20,
            top: f.y - 16,
            zIndex: 20,
            minWidth: 220,
            maxWidth: 300,
            padding: "10px 14px",
            borderRadius: 10,
            background: "rgba(10, 10, 10, 0.94)",
            border: `1px solid ${color}55`,
            boxShadow: `0 12px 36px rgba(0,0,0,0.6), 0 0 0 1px ${color}22`,
            fontFamily: font,
            pointerEvents: "auto",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: color,
                boxShadow: `0 0 8px ${color}`,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#e2e8f0",
              }}
            >
              {f.label}
            </span>
            <span
              style={{
                marginLeft: "auto",
                fontSize: 10,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                color,
              }}
            >
              {f.severity}
            </span>
          </div>
          <p
            style={{
              margin: 0,
              fontSize: 12,
              lineHeight: 1.55,
              color: "#94a3b8",
            }}
          >
            {f.detail}
          </p>
        </div>
      )}
    </>
  );
}

/* ── Finding chip in bottom panel ───────────────────────────── */

function FindingChip({
  finding: f,
  active,
  onToggle,
}: {
  finding: Finding;
  active: boolean;
  onToggle: () => void;
}) {
  const color = SEV_COLORS[f.severity];
  return (
    <button
      type="button"
      onClick={onToggle}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "8px 14px",
        borderRadius: 10,
        border: active ? `1px solid ${color}66` : "1px solid #1f1f1f",
        background: active ? `${color}14` : "#111",
        cursor: "pointer",
        fontFamily: "inherit",
      }}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: color,
          boxShadow: active ? `0 0 8px ${color}` : "none",
          flexShrink: 0,
        }}
      />
      <span style={{ fontSize: 12, fontWeight: 600, color: "#ccc" }}>
        {f.label}
      </span>
    </button>
  );
}

/* ── Ruler overlay ──────────────────────────────────────────── */

function RulerOverlay() {
  const tickCount = Math.floor(XRAY_H / 100);

  return (
    <div
      style={{
        position: "absolute",
        left: 6,
        top: 0,
        width: 32,
        height: XRAY_H,
        pointerEvents: "none",
        zIndex: 6,
      }}
    >
      <div
        style={{
          position: "absolute",
          left: 14,
          top: 0,
          width: 1,
          height: "100%",
          background: "rgba(52, 211, 153, 0.45)",
        }}
      />
      {Array.from({ length: tickCount + 1 }, (_, i) => {
        const y = i * 100;
        const major = i % 5 === 0;
        return (
          <React.Fragment key={i}>
            <div
              style={{
                position: "absolute",
                left: major ? 6 : 10,
                top: y,
                width: major ? 18 : 10,
                height: 1,
                background: major
                  ? "rgba(52, 211, 153, 0.7)"
                  : "rgba(52, 211, 153, 0.35)",
              }}
            />
            {major && (
              <span
                style={{
                  position: "absolute",
                  left: 28,
                  top: y - 5,
                  fontSize: 9,
                  fontFamily: mono,
                  fontWeight: 600,
                  color: "rgba(52, 211, 153, 0.65)",
                }}
              >
                {i}
              </span>
            )}
          </React.Fragment>
        );
      })}

      {/* Horizontal ruler at top */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: XRAY_W,
          height: 20,
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 14,
            width: XRAY_W,
            height: 1,
            background: "rgba(52, 211, 153, 0.3)",
          }}
        />
        {Array.from({ length: Math.floor(XRAY_W / 100) + 1 }, (_, i) => {
          const x = i * 100;
          const major = i % 5 === 0;
          return (
            <React.Fragment key={`h-${i}`}>
              <div
                style={{
                  position: "absolute",
                  left: x,
                  top: major ? 6 : 10,
                  width: 1,
                  height: major ? 14 : 6,
                  background: major
                    ? "rgba(52, 211, 153, 0.6)"
                    : "rgba(52, 211, 153, 0.3)",
                }}
              />
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}

/* ── Scale badge ────────────────────────────────────────────── */

function ScaleBadge() {
  return useTransformComponent(({ state }) => (
    <div
      style={{
        position: "absolute",
        bottom: 16,
        right: 16,
        zIndex: 10,
        padding: "4px 10px",
        borderRadius: 6,
        background: "rgba(0, 0, 0, 0.7)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "#aaa",
        fontSize: 11,
        fontWeight: 600,
        fontFamily: mono,
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      {(state.scale * 100).toFixed(0)}%
    </div>
  ));
}

/* ── Main component ─────────────────────────────────────────── */

export const Example: React.FC<Record<string, unknown>> = (args) => {
  const normalized = normalizeArgs(args);
  const [activePreset, setActivePreset] = useState<string>("default");
  const [inverted, setInverted] = useState(false);
  const [showFindings, setShowFindings] = useState(true);
  const [showRuler, setShowRuler] = useState(false);
  const [activeFinding, setActiveFinding] = useState<string | null>(null);

  const preset = PRESETS.find((p) => p.id === activePreset)!;

  const imageFilter = [
    `brightness(${preset.brightness})`,
    `contrast(${preset.contrast})`,
    inverted ? "invert(1)" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const toggleFinding = useCallback((id: string) => {
    setActiveFinding((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div
      style={{
        fontFamily: font,
        background: "#000",
        borderRadius: 14,
        overflow: "hidden",
        boxSizing: "border-box",
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 6,
          padding: "10px 16px",
          borderBottom: "1px solid #1a1a1a",
          background: "#0a0a0a",
          alignItems: "center",
        }}
      >
        {/* Presets */}
        <ToolbarGroup label="Window">
          {PRESETS.map((p) => (
            <ToolbarButton
              key={p.id}
              label={p.label}
              active={activePreset === p.id}
              onClick={() => setActivePreset(p.id)}
              accent="#e2e8f0"
            />
          ))}
        </ToolbarGroup>

        <ToolbarDivider />

        <ToolbarGroup label="Display">
          <ToolbarButton
            label="Invert"
            active={inverted}
            onClick={() => setInverted((v) => !v)}
            accent="#60a5fa"
          />
          <ToolbarButton
            label="Findings"
            active={showFindings}
            onClick={() => {
              setShowFindings((v) => !v);
              if (showFindings) setActiveFinding(null);
            }}
            accent="#a78bfa"
          />
          <ToolbarButton
            label="Ruler"
            active={showRuler}
            onClick={() => setShowRuler((v) => !v)}
            accent="#34d399"
          />
        </ToolbarGroup>
      </div>

      <div style={{ position: "relative" }}>
        {/* DICOM corner overlays */}
        <DicomOverlayTL />
        <DicomOverlayTR preset={preset} inverted={inverted} />
        <DicomOverlayBL />

        <TransformWrapper
          {...normalized}
          centerOnInit
          centerZoomedOut
          minScale={0.25}
          maxScale={10}
          doubleClick={{ step: 1.8 }}
        >
          {(utils) => (
            <>
              <Controls {...utils} position="bottom-right" />
              <ScaleBadge />
              <TransformComponent
                wrapperStyle={{
                  width: "100%",
                  height: "min(640px, 72vh)",
                  minHeight: 420,
                  background: "#000",
                }}
                contentStyle={{
                  width: XRAY_W,
                  height: XRAY_H,
                }}
              >
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      filter: imageFilter,
                      transition: "filter 0.25s ease",
                    }}
                  >
                    <ChestXray />
                  </div>

                  {showRuler && <RulerOverlay />}

                  {showFindings &&
                    FINDINGS.map((f) => (
                      <FindingMarker
                        key={f.id}
                        finding={f}
                        active={activeFinding === f.id}
                        onToggle={() => toggleFinding(f.id)}
                      />
                    ))}
                </div>
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </div>

      {/* Findings panel */}
      {showFindings && (
        <div
          style={{
            borderTop: "1px solid #1a1a1a",
            background: "#0a0a0a",
            padding: "12px 16px",
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "#555",
              marginBottom: 10,
            }}
          >
            Findings ({FINDINGS.length})
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {FINDINGS.map((f) => (
              <FindingChip
                key={f.id}
                finding={f}
                active={activeFinding === f.id}
                onToggle={() => toggleFinding(f.id)}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
