import React, { useCallback, useRef, useState } from "react";

import { TransformComponent, TransformWrapper, KeepScale } from "components";
import { Controls, CloseIcon, normalizeArgs, viewerChrome } from "../../utils";

const font = 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

const CANVAS_W = 2400;
const CANVAS_H = 1600;

/* ── Location data ─────────────────────────────────────────── */

interface Location {
  id: string;
  name: string;
  sub: string;
  category: "landmark" | "nature" | "district" | "transport";
  x: number;
  y: number;
  icon: string;
}

const CATEGORY_META: Record<
  Location["category"],
  { accent: string; glow: string; label: string }
> = {
  landmark: {
    accent: "#f59e0b",
    glow: "rgba(245,158,11,0.35)",
    label: "Landmarks",
  },
  nature: { accent: "#10b981", glow: "rgba(16,185,129,0.35)", label: "Nature" },
  district: {
    accent: "#6366f1",
    glow: "rgba(99,102,241,0.35)",
    label: "Districts",
  },
  transport: {
    accent: "#06b6d4",
    glow: "rgba(6,182,212,0.35)",
    label: "Transport",
  },
};

const LOCATIONS: Location[] = [
  {
    id: "loc-harbor",
    name: "Harbor District",
    sub: "Historic waterfront & marina",
    category: "landmark",
    icon: "⚓",
    x: 380,
    y: 920,
  },
  {
    id: "loc-old-town",
    name: "Old Town",
    sub: "Medieval quarter, est. 1242",
    category: "district",
    icon: "🏛",
    x: 820,
    y: 580,
  },
  {
    id: "loc-tech",
    name: "Tech Campus",
    sub: "Innovation hub & co-working",
    category: "district",
    icon: "💡",
    x: 1560,
    y: 420,
  },
  {
    id: "loc-park",
    name: "Emerald Park",
    sub: "120 hectares of urban forest",
    category: "nature",
    icon: "🌿",
    x: 1180,
    y: 880,
  },
  {
    id: "loc-marina",
    name: "Marina Bay",
    sub: "Yacht club & seaside dining",
    category: "landmark",
    icon: "⛵",
    x: 1940,
    y: 1100,
  },
  {
    id: "loc-station",
    name: "Central Station",
    sub: "Rail hub · 12 platforms",
    category: "transport",
    icon: "🚂",
    x: 980,
    y: 340,
  },
  {
    id: "loc-bridge",
    name: "Skyline Bridge",
    sub: "Suspension bridge, 480m span",
    category: "landmark",
    icon: "🌉",
    x: 600,
    y: 1200,
  },
  {
    id: "loc-gardens",
    name: "Botanical Gardens",
    sub: "Tropical greenhouse & trails",
    category: "nature",
    icon: "🌺",
    x: 1780,
    y: 720,
  },
];

/* ── Procedural map (SVG + CSS) ────────────────────────────── */

const IslandMap = React.memo(function IslandMap() {
  return (
    <div
      style={{
        position: "relative",
        width: CANVAS_W,
        height: CANVAS_H,
        background:
          "linear-gradient(170deg, #1a3a5c 0%, #1e4d6e 30%, #1a3a5c 60%, #142d4a 100%)",
        overflow: "hidden",
      }}
    >
      {/* Water texture */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: [
            "radial-gradient(ellipse 600px 400px at 15% 85%, rgba(6,182,212,0.08) 0%, transparent 70%)",
            "radial-gradient(ellipse 500px 300px at 85% 20%, rgba(56,189,248,0.06) 0%, transparent 70%)",
            "radial-gradient(ellipse 800px 500px at 50% 50%, rgba(14,165,233,0.04) 0%, transparent 70%)",
          ].join(", "),
          pointerEvents: "none",
        }}
      />

      <svg
        width={CANVAS_W}
        height={CANVAS_H}
        style={{ position: "absolute", inset: 0 }}
        aria-hidden
      >
        <defs>
          <linearGradient id="land-main" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2d5a3d" />
            <stop offset="50%" stopColor="#3a6b4a" />
            <stop offset="100%" stopColor="#2a5038" />
          </linearGradient>
          <linearGradient id="land-south" x1="0" y1="0" x2="0.5" y2="1">
            <stop offset="0%" stopColor="#35654a" />
            <stop offset="100%" stopColor="#2a5038" />
          </linearGradient>
          <linearGradient id="land-east" x1="0" y1="0" x2="1" y2="0.5">
            <stop offset="0%" stopColor="#3a6b4a" />
            <stop offset="100%" stopColor="#2d5a3d" />
          </linearGradient>
          <filter id="land-shadow">
            <feDropShadow
              dx="0"
              dy="4"
              stdDeviation="12"
              floodColor="#0a1628"
              floodOpacity="0.5"
            />
          </filter>
          <filter id="soft-glow">
            <feGaussianBlur stdDeviation="3" />
          </filter>
        </defs>

        {/* Main island */}
        <path
          d="M 300 500 C 320 380, 500 280, 700 260 C 900 240, 1100 220, 1300 280
             C 1500 340, 1700 300, 1900 380 C 2050 440, 2100 560, 2080 700
             C 2060 840, 1980 960, 1860 1040 C 1740 1120, 1560 1160, 1380 1140
             C 1200 1120, 1040 1080, 900 1060 C 760 1040, 600 1080, 460 1020
             C 320 960, 260 820, 280 680 C 290 580, 290 540, 300 500 Z"
          fill="url(#land-main)"
          filter="url(#land-shadow)"
        />

        {/* Southern peninsula */}
        <path
          d="M 460 1020 C 500 1060, 540 1160, 520 1260
             C 500 1340, 560 1380, 660 1360
             C 760 1340, 820 1260, 800 1180
             C 780 1120, 840 1080, 900 1060"
          fill="url(#land-south)"
          filter="url(#land-shadow)"
        />

        {/* Eastern island */}
        <path
          d="M 1860 1040 C 1920 1080, 2000 1060, 2080 1100
             C 2160 1140, 2200 1220, 2160 1300
             C 2120 1380, 2020 1380, 1940 1340
             C 1860 1300, 1820 1220, 1840 1140
             C 1850 1100, 1850 1060, 1860 1040 Z"
          fill="url(#land-east)"
          filter="url(#land-shadow)"
        />

        {/* Beach / coastline highlights */}
        <path
          d="M 300 500 C 320 380, 500 280, 700 260 C 900 240, 1100 220, 1300 280
             C 1500 340, 1700 300, 1900 380 C 2050 440, 2100 560, 2080 700"
          fill="none"
          stroke="rgba(250, 235, 200, 0.12)"
          strokeWidth="4"
        />

        {/* Mountain range */}
        <g opacity="0.35">
          <polygon points="900,360 940,280 980,360" fill="#4a7a5a" />
          <polygon points="960,370 1010,270 1060,370" fill="#3d6a4a" />
          <polygon points="1040,360 1080,260 1120,360" fill="#4a7a5a" />
          <polygon points="1100,370 1150,290 1200,370" fill="#3d6a4a" />
          {/* Snow caps */}
          <polygon
            points="930,300 940,280 950,300"
            fill="rgba(255,255,255,0.5)"
          />
          <polygon
            points="1000,290 1010,270 1020,290"
            fill="rgba(255,255,255,0.5)"
          />
          <polygon
            points="1070,280 1080,260 1090,280"
            fill="rgba(255,255,255,0.5)"
          />
          <polygon
            points="1140,310 1150,290 1160,310"
            fill="rgba(255,255,255,0.5)"
          />
        </g>

        {/* Park / forest area */}
        <ellipse
          cx="1180"
          cy="880"
          rx="160"
          ry="120"
          fill="rgba(34,197,94,0.15)"
        />
        {Array.from({ length: 18 }, (_, i) => {
          const angle = (i / 18) * Math.PI * 2;
          const r = 60 + (i % 3) * 30;
          return (
            <circle
              key={i}
              cx={1180 + Math.cos(angle) * r}
              cy={880 + Math.sin(angle) * r * 0.75}
              r={8 + (i % 4) * 3}
              fill={`rgba(34, 197, 94, ${0.15 + (i % 3) * 0.05})`}
            />
          );
        })}

        {/* Roads */}
        <g
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        >
          <path d="M 380 920 C 500 860, 650 700, 820 580" />
          <path d="M 820 580 L 980 340" />
          <path d="M 820 580 C 1000 550, 1300 430, 1560 420" />
          <path d="M 980 340 C 1100 380, 1300 400, 1560 420" />
          <path d="M 1560 420 C 1680 520, 1750 640, 1780 720" />
          <path d="M 1180 880 C 1400 900, 1600 940, 1780 720" />
          <path d="M 1180 880 C 1400 960, 1700 1020, 1940 1100" />
          <path d="M 380 920 C 450 1000, 520 1100, 600 1200" />
          <path d="M 820 580 C 900 720, 1000 800, 1180 880" />
        </g>

        {/* Road dots (intersections) */}
        {[
          [820, 580],
          [980, 340],
          [1560, 420],
          [1180, 880],
          [1780, 720],
        ].map(([cx, cy]) => (
          <circle
            key={`${cx}-${cy}`}
            cx={cx}
            cy={cy}
            r={4}
            fill="rgba(255,255,255,0.12)"
          />
        ))}

        {/* Water ripples */}
        {[
          [180, 300, 80],
          [2300, 500, 60],
          [200, 1300, 70],
          [2200, 1400, 50],
          [1400, 1400, 90],
        ].map(([cx, cy, r]) => (
          <g key={`${cx}-${cy}-${r}`} opacity="0.06">
            <circle
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1"
            />
            <circle
              cx={cx}
              cy={cy}
              r={r * 0.6}
              fill="none"
              stroke="#38bdf8"
              strokeWidth="0.8"
            />
          </g>
        ))}

        {/* Compass rose */}
        <g transform="translate(160, 160)" opacity="0.2">
          <circle
            cx="0"
            cy="0"
            r="32"
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1"
          />
          <line
            x1="0"
            y1="-28"
            x2="0"
            y2="28"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1"
          />
          <line
            x1="-28"
            y1="0"
            x2="28"
            y2="0"
            stroke="rgba(255,255,255,0.25)"
            strokeWidth="1"
          />
          <polygon points="0,-26 -4,-10 4,-10" fill="rgba(248,113,113,0.6)" />
          <polygon points="0,26 -4,10 4,10" fill="rgba(255,255,255,0.15)" />
          <text
            x="0"
            y="-36"
            textAnchor="middle"
            fill="rgba(255,255,255,0.35)"
            fontSize="10"
            fontWeight="700"
            fontFamily={font}
          >
            N
          </text>
        </g>

        {/* Scale bar */}
        <g transform="translate(2100, 1500)" opacity="0.2">
          <line
            x1="0"
            y1="0"
            x2="120"
            y2="0"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1.5"
          />
          <line
            x1="0"
            y1="-4"
            x2="0"
            y2="4"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1"
          />
          <line
            x1="120"
            y1="-4"
            x2="120"
            y2="4"
            stroke="rgba(255,255,255,0.4)"
            strokeWidth="1"
          />
          <text
            x="60"
            y="14"
            textAnchor="middle"
            fill="rgba(255,255,255,0.3)"
            fontSize="9"
            fontFamily={font}
          >
            1 km
          </text>
        </g>
      </svg>

      {/* Building clusters (CSS) */}
      {[
        { x: 780, y: 540, w: 80, h: 60 },
        { x: 1520, y: 380, w: 100, h: 70 },
        { x: 350, y: 880, w: 70, h: 50 },
        { x: 1900, y: 1060, w: 80, h: 60 },
      ].map((b) => (
        <div
          key={`${b.x}-${b.y}`}
          style={{
            position: "absolute",
            left: b.x,
            top: b.y,
            width: b.w,
            height: b.h,
            borderRadius: 4,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.04)",
          }}
        />
      ))}
    </div>
  );
});

/* ── Map marker (KeepScale) ────────────────────────────────── */

function MapMarker(props: {
  loc: Location;
  selected: boolean;
  onClick: () => void;
}) {
  const { loc, selected, onClick } = props;
  const meta = CATEGORY_META[loc.category];

  return (
    <div
      style={{
        position: "absolute",
        left: loc.x,
        top: loc.y,
        zIndex: selected ? 10 : 2,
        transform: "translate(-50%, -100%)",
      }}
    >
      <KeepScale>
        <button
          type="button"
          id={loc.id}
          onClick={onClick}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
            cursor: "pointer",
            border: "none",
            background: "transparent",
            padding: 0,
            fontFamily: font,
          }}
        >
          {/* Pin body */}
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: "50% 50% 50% 0",
              transform: "rotate(-45deg)",
              background: selected
                ? `linear-gradient(135deg, ${meta.accent}, ${meta.accent}cc)`
                : `linear-gradient(135deg, ${meta.accent}cc, ${meta.accent}88)`,
              boxShadow: selected
                ? `0 0 20px ${meta.glow}, 0 4px 16px rgba(0,0,0,0.4)`
                : `0 2px 8px rgba(0,0,0,0.4)`,
              border: selected
                ? "2px solid rgba(255,255,255,0.5)"
                : "2px solid rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "box-shadow 0.2s, border-color 0.2s",
            }}
          >
            <span
              style={{
                transform: "rotate(45deg)",
                fontSize: 16,
                lineHeight: 1,
              }}
            >
              {loc.icon}
            </span>
          </div>

          {/* Label */}
          <div
            style={{
              marginTop: 4,
              padding: "3px 8px",
              borderRadius: 6,
              background: selected ? "rgba(0,0,0,0.85)" : "rgba(0,0,0,0.65)",
              backdropFilter: "blur(6px)",
              border: selected
                ? `1px solid ${meta.accent}66`
                : "1px solid rgba(255,255,255,0.08)",
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                color: selected ? meta.accent : "rgba(255,255,255,0.85)",
                letterSpacing: "0.02em",
              }}
            >
              {loc.name}
            </span>
          </div>
        </button>
      </KeepScale>
    </div>
  );
}

/* ── Location bar (bottom panel) ───────────────────────────── */

function LocationBar(props: {
  selectedId: string | null;
  onSelect: (loc: Location) => void;
  onReset: () => void;
}) {
  const { selectedId, onSelect, onReset } = props;
  const categories = Object.entries(CATEGORY_META) as [
    Location["category"],
    (typeof CATEGORY_META)[Location["category"]],
  ][];

  return (
    <div
      style={{
        marginTop: 14,
        borderRadius: 14,
        background: "rgba(10, 10, 20, 0.75)",
        border: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(12px)",
        padding: "14px 16px",
        fontFamily: font,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "rgba(255,255,255,0.6)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
            }}
          >
            Locations
          </span>
          <span
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.3)",
              padding: "2px 8px",
              borderRadius: 6,
              background: "rgba(255,255,255,0.04)",
            }}
          >
            {LOCATIONS.length} points
          </span>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          {categories.map(([key, meta]) => (
            <span
              key={key}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 10,
                fontWeight: 600,
                color: "rgba(255,255,255,0.4)",
              }}
            >
              <span
                style={{
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: meta.accent,
                  flexShrink: 0,
                }}
              />
              {meta.label}
            </span>
          ))}
        </div>
      </div>

      {/* Cards grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 8,
        }}
      >
        {LOCATIONS.map((loc) => {
          const meta = CATEGORY_META[loc.category];
          const sel = selectedId === loc.id;
          return (
            <button
              key={loc.id}
              type="button"
              onClick={() => onSelect(loc)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 10,
                border: sel
                  ? `1px solid ${meta.accent}55`
                  : "1px solid rgba(255,255,255,0.05)",
                background: sel
                  ? `linear-gradient(135deg, ${meta.accent}15, ${meta.accent}08)`
                  : "rgba(255,255,255,0.02)",
                cursor: "pointer",
                fontFamily: font,
                textAlign: "left",
                transition: "border-color 0.2s, background 0.2s",
              }}
            >
              <span
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 9,
                  background: sel
                    ? `${meta.accent}25`
                    : "rgba(255,255,255,0.04)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 16,
                  flexShrink: 0,
                  border: sel
                    ? `1px solid ${meta.accent}33`
                    : "1px solid rgba(255,255,255,0.04)",
                }}
              >
                {loc.icon}
              </span>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: sel ? meta.accent : "rgba(255,255,255,0.85)",
                    lineHeight: 1.3,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {loc.name}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "rgba(255,255,255,0.35)",
                    lineHeight: 1.4,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {loc.sub}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selectedId && (
        <div
          style={{ marginTop: 10, display: "flex", justifyContent: "center" }}
        >
          <button
            type="button"
            onClick={onReset}
            style={{
              padding: "6px 20px",
              borderRadius: 8,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.04)",
              color: "rgba(255,255,255,0.5)",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: font,
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            Reset view
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Selected badge ────────────────────────────────────────── */

function SelectedBadge({ loc }: { loc: Location | null }) {
  if (!loc) return null;
  const meta = CATEGORY_META[loc.category];

  return (
    <div
      style={{
        position: "absolute",
        top: 14,
        right: 14,
        zIndex: 10,
        padding: "8px 14px",
        borderRadius: 10,
        background: "rgba(6, 10, 24, 0.85)",
        backdropFilter: "blur(12px)",
        border: `1px solid ${meta.accent}44`,
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontFamily: font,
        maxWidth: 280,
      }}
    >
      <span style={{ fontSize: 18 }}>{loc.icon}</span>
      <div>
        <div
          style={{
            fontSize: 13,
            fontWeight: 700,
            color: meta.accent,
            lineHeight: 1.3,
          }}
        >
          {loc.name}
        </div>
        <div
          style={{
            fontSize: 10,
            color: "rgba(255,255,255,0.45)",
            lineHeight: 1.4,
          }}
        >
          {loc.sub}
        </div>
      </div>
    </div>
  );
}

/* ── Main ──────────────────────────────────────────────────── */

type Api = {
  zoomToElement: (target: string | HTMLElement, scale?: number) => void;
  resetTransform: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
  centerView: () => void;
};

export const Example: React.FC<any> = (args: any) => {
  const [selected, setSelected] = useState<Location | null>(null);
  const apiRef = useRef<Api | null>(null);

  const handleSelect = useCallback((loc: Location) => {
    setSelected(loc);
    requestAnimationFrame(() => {
      apiRef.current?.zoomToElement(loc.id, 4);
    });
  }, []);

  const handleReset = useCallback(() => {
    setSelected(null);
    apiRef.current?.resetTransform();
  }, []);

  return (
    <div style={{ fontFamily: font, maxWidth: 960 }}>
      <TransformWrapper
        {...normalizeArgs(args)}
        initialScale={0.45}
        minScale={0.3}
        maxScale={100}
        centerOnInit
        centerZoomedOut
      >
        {(api) => {
          apiRef.current = api;
          return (
            <>
              <div style={{ position: "relative" }}>
                <Controls
                  {...api}
                  extraButtons={
                    selected
                      ? [
                          {
                            label: "Clear selection",
                            icon: <CloseIcon />,
                            onClick: handleReset,
                          },
                        ]
                      : []
                  }
                />
                <SelectedBadge loc={selected} />
                <TransformComponent
                  wrapperStyle={{
                    ...viewerChrome,
                    width: "100%",
                    height: "clamp(480px, calc(100vh - 360px), 680px)",
                  }}
                  contentStyle={{
                    width: CANVAS_W,
                    height: CANVAS_H,
                  }}
                >
                  <IslandMap />
                  {LOCATIONS.map((loc) => (
                    <MapMarker
                      key={loc.id}
                      loc={loc}
                      selected={selected?.id === loc.id}
                      onClick={() => handleSelect(loc)}
                    />
                  ))}
                </TransformComponent>
              </div>

              <LocationBar
                selectedId={selected?.id ?? null}
                onSelect={handleSelect}
                onReset={handleReset}
              />
            </>
          );
        }}
      </TransformWrapper>
    </div>
  );
};
