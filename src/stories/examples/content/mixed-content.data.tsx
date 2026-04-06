import React, { useState } from "react";

const FONT = "system-ui, -apple-system, 'Segoe UI', sans-serif";

const palette = {
  bg: "#0c0c1d",
  surface: "#161633",
  surfaceAlt: "#1c1c40",
  border: "rgba(255,255,255,0.06)",
  borderHover: "rgba(255,255,255,0.12)",
  text: "#e4e4f0",
  textMuted: "#8888a8",
  accent: "#6c63ff",
  accentGlow: "rgba(108,99,255,0.25)",
  panZone: "#ff4d6a",
  panZoneBg: "rgba(255,77,106,0.08)",
  panZoneBorder: "rgba(255,77,106,0.25)",
  wheelZone: "#3dc9f6",
  wheelZoneBg: "rgba(61,201,246,0.08)",
  wheelZoneBorder: "rgba(61,201,246,0.25)",
  pinchZone: "#43e97b",
  pinchZoneBg: "rgba(67,233,123,0.08)",
  pinchZoneBorder: "rgba(67,233,123,0.25)",
};

function ZoneBadge({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "3px 10px",
        borderRadius: "100px",
        fontSize: "10px",
        fontWeight: 700,
        letterSpacing: "0.6px",
        textTransform: "uppercase",
        color,
        background: `${color}15`,
        border: `1px solid ${color}40`,
        fontFamily: FONT,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: color,
          boxShadow: `0 0 6px ${color}80`,
        }}
      />
      {label}
    </span>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        margin: "0 0 12px 0",
        fontSize: "13px",
        fontWeight: 600,
        letterSpacing: "0.8px",
        textTransform: "uppercase",
        color: palette.textMuted,
        fontFamily: FONT,
      }}
    >
      {children}
    </h3>
  );
}

function StatCard({
  label,
  value,
  trend,
  color,
}: {
  label: string;
  value: string;
  trend: string;
  color: string;
}) {
  return (
    <div
      style={{
        flex: "1 1 0",
        minWidth: 110,
        padding: "16px",
        borderRadius: "12px",
        background: palette.surface,
        border: `1px solid ${palette.border}`,
      }}
    >
      <div
        style={{
          fontSize: "11px",
          color: palette.textMuted,
          marginBottom: "6px",
          fontFamily: FONT,
          fontWeight: 500,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "22px",
          fontWeight: 700,
          color: palette.text,
          fontFamily: FONT,
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: "11px",
          fontWeight: 600,
          color,
          marginTop: "6px",
          fontFamily: FONT,
        }}
      >
        {trend}
      </div>
    </div>
  );
}

function InteractiveButtons() {
  const [count, setCount] = useState(0);

  return (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      <button
        type="button"
        onClick={() => setCount((c) => c + 1)}
        style={{
          padding: "8px 18px",
          borderRadius: "8px",
          border: `1px solid ${palette.accent}`,
          background: `linear-gradient(135deg, ${palette.accent}, #8b5cf6)`,
          color: "#fff",
          fontSize: "12px",
          fontWeight: 600,
          fontFamily: FONT,
          cursor: "pointer",
          boxShadow: `0 2px 12px ${palette.accentGlow}`,
          transition: "transform 0.1s",
        }}
      >
        Clicked {count} times
      </button>
      <button
        type="button"
        onClick={() => setCount(0)}
        style={{
          padding: "8px 18px",
          borderRadius: "8px",
          border: `1px solid ${palette.border}`,
          background: palette.surfaceAlt,
          color: palette.textMuted,
          fontSize: "12px",
          fontWeight: 600,
          fontFamily: FONT,
          cursor: "pointer",
        }}
      >
        Reset
      </button>
    </div>
  );
}

function ScrollableList() {
  const items = [
    { name: "Authentication", status: "active", color: "#43e97b" },
    { name: "Database Sync", status: "active", color: "#43e97b" },
    { name: "CDN Cache", status: "warning", color: "#f6d365" },
    { name: "WebSocket", status: "active", color: "#43e97b" },
    { name: "Rate Limiter", status: "active", color: "#43e97b" },
    { name: "Email Queue", status: "degraded", color: "#ff9a44" },
    { name: "Search Index", status: "active", color: "#43e97b" },
    { name: "Cron Jobs", status: "active", color: "#43e97b" },
  ];

  return (
    <div
      style={{
        maxHeight: "160px",
        overflowY: "auto",
        borderRadius: "10px",
        border: `1px solid ${palette.border}`,
        background: palette.surface,
      }}
    >
      {items.map((item) => (
        <div
          key={item.name}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "10px 14px",
            borderBottom: `1px solid ${palette.border}`,
            fontSize: "12px",
            fontFamily: FONT,
          }}
        >
          <span style={{ color: palette.text, fontWeight: 500 }}>
            {item.name}
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: "5px",
              color: item.color,
              fontWeight: 600,
              fontSize: "11px",
              textTransform: "capitalize",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: item.color,
                boxShadow: `0 0 6px ${item.color}80`,
              }}
            />
            {item.status}
          </span>
        </div>
      ))}
    </div>
  );
}

function MiniBarChart() {
  const bars = [35, 55, 40, 75, 60, 85, 45, 70, 90, 50, 65, 80];
  const maxH = 60;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: "4px",
        height: maxH,
        padding: "12px 0 0",
      }}
    >
      {bars.map((v, i) => (
        <div
          key={i}
          style={{
            flex: "1 1 0",
            height: `${(v / 100) * maxH}px`,
            borderRadius: "4px 4px 0 0",
            background: `linear-gradient(180deg, ${palette.accent}cc, ${palette.accent}44)`,
            minWidth: 0,
          }}
        />
      ))}
    </div>
  );
}

function ExclusionZone({
  className,
  color,
  bgColor,
  borderColor,
  label,
  description,
  children,
}: {
  className: string;
  color: string;
  bgColor: string;
  borderColor: string;
  label: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={className}
      style={{
        position: "relative",
        padding: "16px",
        borderRadius: "12px",
        background: bgColor,
        border: `1.5px dashed ${borderColor}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "10px",
        }}
      >
        <ZoneBadge color={color} label={label} />
      </div>
      <div
        style={{
          fontSize: "11.5px",
          color: palette.textMuted,
          fontFamily: FONT,
          lineHeight: 1.5,
          marginBottom: "12px",
        }}
      >
        {description}
      </div>
      {children}
    </div>
  );
}

export function MixedContent() {
  return (
    <div
      style={{
        width: 780,
        padding: "32px",
        background: palette.bg,
        fontFamily: FONT,
        color: palette.text,
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: "28px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "6px",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "10px",
              background: `linear-gradient(135deg, ${palette.accent}, #8b5cf6)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "15px",
              fontWeight: 800,
              color: "#fff",
              boxShadow: `0 2px 16px ${palette.accentGlow}`,
            }}
          >
            Z
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: "20px",
              fontWeight: 700,
              letterSpacing: "-0.3px",
              background: "linear-gradient(135deg, #fff 30%, #8888a8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Mixed Content Dashboard
          </h1>
        </div>
        <p
          style={{
            margin: 0,
            fontSize: "13px",
            color: palette.textMuted,
            lineHeight: 1.5,
          }}
        >
          Pan, zoom, and pinch this entire canvas.
          Colored zones below disable specific gestures — try interacting with
          each one.
        </p>
      </div>

      {/* Stat cards */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        <StatCard
          label="Active Users"
          value="12,847"
          trend="+ 14.2% this week"
          color="#43e97b"
        />
        <StatCard
          label="Requests / sec"
          value="3,291"
          trend="+ 8.6% avg"
          color="#3dc9f6"
        />
        <StatCard
          label="Error Rate"
          value="0.12%"
          trend="- 0.03% improved"
          color="#43e97b"
        />
        <StatCard
          label="Latency (p99)"
          value="142ms"
          trend="- 18ms faster"
          color="#3dc9f6"
        />
      </div>

      {/* Chart */}
      <div
        style={{
          padding: "16px",
          borderRadius: "12px",
          background: palette.surface,
          border: `1px solid ${palette.border}`,
          marginBottom: "24px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "4px",
          }}
        >
          <span
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: palette.textMuted,
              letterSpacing: "0.5px",
              textTransform: "uppercase",
            }}
          >
            Throughput — Last 12 hours
          </span>
          <span
            style={{
              fontSize: "11px",
              color: palette.accent,
              fontWeight: 600,
            }}
          >
            Live
          </span>
        </div>
        <MiniBarChart />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "4px",
            fontSize: "10px",
            color: palette.textMuted,
          }}
        >
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
        </div>
      </div>

      {/* Exclusion zones */}
      <SectionTitle>Exclusion Zones</SectionTitle>
      <div
        style={{ display: "flex", flexDirection: "column", gap: "14px" }}
      >
        {/* Panning disabled */}
        <ExclusionZone
          className="panningDisabled"
          color={palette.panZone}
          bgColor={palette.panZoneBg}
          borderColor={palette.panZoneBorder}
          label="Panning Disabled"
          description={'This zone has the CSS class "panningDisabled" — clicking and dragging inside here will NOT pan the canvas. Useful for scrollable lists, text selection areas, or embedded interactive widgets.'}
        >
          <ScrollableList />
        </ExclusionZone>

        {/* Wheel disabled */}
        <ExclusionZone
          className="wheelDisabled"
          color={palette.wheelZone}
          bgColor={palette.wheelZoneBg}
          borderColor={palette.wheelZoneBorder}
          label="Wheel Disabled"
          description={'This zone has the CSS class "wheelDisabled" — scrolling the mouse wheel here will NOT zoom the canvas. Perfect for scrollable content inside the transform viewport.'}
        >
          <InteractiveButtons />
        </ExclusionZone>

        {/* Pinch disabled */}
        <ExclusionZone
          className="pinchDisabled"
          color={palette.pinchZone}
          bgColor={palette.pinchZoneBg}
          borderColor={palette.pinchZoneBorder}
          label="Pinch Disabled"
          description={'This zone has the CSS class "pinchDisabled" — pinch gestures on touch devices will NOT zoom the canvas. Ideal for embedded maps, canvases, or multi-touch widgets.'}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "8px",
            }}
          >
            {[
              { label: "Scale X", val: "1.00" },
              { label: "Scale Y", val: "1.00" },
              { label: "Rotation", val: "0°" },
              { label: "Opacity", val: "100%" },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  padding: "10px 12px",
                  borderRadius: "8px",
                  background: palette.surface,
                  border: `1px solid ${palette.border}`,
                  fontSize: "11px",
                  fontFamily: FONT,
                }}
              >
                <div
                  style={{
                    color: palette.textMuted,
                    marginBottom: "3px",
                    fontWeight: 500,
                  }}
                >
                  {item.label}
                </div>
                <div style={{ color: palette.text, fontWeight: 700 }}>
                  {item.val}
                </div>
              </div>
            ))}
          </div>
        </ExclusionZone>
      </div>

      {/* Footer note */}
      <div
        style={{
          marginTop: "24px",
          padding: "14px 16px",
          borderRadius: "10px",
          background: palette.surfaceAlt,
          border: `1px solid ${palette.border}`,
          display: "flex",
          alignItems: "flex-start",
          gap: "10px",
        }}
      >
        <span
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: palette.accent,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "11px",
            fontWeight: 800,
            flexShrink: 0,
            marginTop: "1px",
          }}
        >
          i
        </span>
        <p
          style={{
            margin: 0,
            fontSize: "12px",
            color: palette.textMuted,
            lineHeight: 1.6,
          }}
        >
          Everything outside the dashed zones responds to all gestures normally
          — try panning the stat cards, zooming on the chart, or pinching to
          zoom the entire dashboard. The exclusion zones use simple CSS class
          names; no JavaScript wiring required.
        </p>
      </div>
    </div>
  );
}
