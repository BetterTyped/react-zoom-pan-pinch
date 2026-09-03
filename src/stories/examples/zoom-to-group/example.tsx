import React, { useMemo, useState } from "react";

import { TransformComponent, TransformWrapper } from "components";
import {
  Controls,
  FocusChips,
  ToggleIcon,
  normalizeArgs,
  viewerChrome,
} from "../../utils";
import { useTransformComponent } from "../../../hooks";

const font = "system-ui, -apple-system, sans-serif";

const CANVAS_W = 1400;
const CANVAS_H = 900;
const NODE_W = 196;
const NODE_H = 92;
const CENTER = { x: CANVAS_W / 2, y: CANVAS_H / 2 };

/* ── Diagram data ──────────────────────────────────────────── */

// Three layers that overlap in space, so each frame looks different:
// - Core sits tightly in the middle.
// - Ring surrounds it — framing the ring necessarily shows the core inside.
// - Remote is a small cluster tucked into the top-right corner, outside the
//   ring — framing it leaves everything else behind.

type GroupId = "core" | "ring" | "remote";

interface Group {
  id: GroupId;
  label: string;
  accent: string;
  icon: string;
  /** Dashed zone drawn behind the nodes (radii in canvas px). */
  zone?: { rx: number; ry: number };
}

interface Node {
  id: string;
  group: GroupId;
  name: string;
  detail: string;
  icon: string;
  x: number;
  y: number;
}

const GROUPS: Group[] = [
  {
    id: "core",
    label: "Core",
    accent: "#a78bfa",
    icon: "◉",
    zone: { rx: 330, ry: 175 },
  },
  {
    id: "ring",
    label: "Ring",
    accent: "#22d3ee",
    icon: "◎",
    zone: { rx: 560, ry: 350 },
  },
  { id: "remote", label: "Remote", accent: "#34d399", icon: "⇱" },
];

const at = (dx: number, dy: number) => ({
  x: Math.round(CENTER.x + dx - NODE_W / 2),
  y: Math.round(CENTER.y + dy - NODE_H / 2),
});

const NODES: Node[] = [
  // Core — a tight cluster in the middle.
  {
    id: "node-auth",
    group: "core",
    name: "Auth",
    detail: "OIDC · sessions",
    icon: "🔑",
    ...at(-200, -70),
  },
  {
    id: "node-api",
    group: "core",
    name: "Core API",
    detail: "GraphQL · 120 rps",
    icon: "⚙️",
    ...at(0, 60),
  },
  {
    id: "node-ledger",
    group: "core",
    name: "Ledger",
    detail: "Double-entry · audit",
    icon: "📒",
    ...at(200, -70),
  },
  // Ring — around the core on all four sides.
  {
    id: "node-gateway",
    group: "ring",
    name: "API Gateway",
    detail: "Routing · TLS",
    icon: "🚪",
    ...at(0, -350),
  },
  {
    id: "node-search",
    group: "ring",
    name: "Search",
    detail: "Indexing workers",
    icon: "🔍",
    ...at(560, 0),
  },
  {
    id: "node-queue",
    group: "ring",
    name: "Queue",
    detail: "Jobs · dead-letter",
    icon: "📬",
    ...at(0, 350),
  },
  {
    id: "node-cache",
    group: "ring",
    name: "Cache",
    detail: "Redis · pub/sub",
    icon: "⚡",
    ...at(-560, 0),
  },
  // Remote — a small cluster in the top-right corner, outside the ring.
  {
    id: "node-cdn",
    group: "remote",
    name: "CDN",
    detail: "Static assets · 42 PoPs",
    icon: "🌐",
    x: CANVAS_W - NODE_W - 48,
    y: 40,
  },
  {
    id: "node-dns",
    group: "remote",
    name: "DNS",
    detail: "Anycast · 3 providers",
    icon: "📡",
    x: CANVAS_W - 2 * NODE_W - 64,
    y: 40,
  },
  {
    id: "node-archive",
    group: "remote",
    name: "Cold archive",
    detail: "Nightly snapshots",
    icon: "🧊",
    x: CANVAS_W - NODE_W - 48,
    y: 40 + NODE_H + 18,
  },
];

const EDGES: [string, string][] = [
  ["node-dns", "node-cdn"],
  ["node-cdn", "node-gateway"],
  ["node-archive", "node-search"],
  ["node-gateway", "node-api"],
  ["node-auth", "node-api"],
  ["node-api", "node-ledger"],
  ["node-cache", "node-auth"],
  ["node-api", "node-search"],
  ["node-ledger", "node-queue"],
  ["node-search", "node-queue"],
];

const GROUP_BY_ID = Object.fromEntries(GROUPS.map((g) => [g.id, g])) as Record<
  GroupId,
  Group
>;
const NODE_BY_ID = Object.fromEntries(NODES.map((n) => [n.id, n]));

/* ── Pieces ────────────────────────────────────────────────── */

function Zones() {
  return (
    <svg
      width={CANVAS_W}
      height={CANVAS_H}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      aria-hidden
    >
      {[...GROUPS].reverse().map((g) => {
        const label = (x: number, y: number) => (
          <text
            x={x}
            y={y}
            textAnchor="middle"
            fill={`${g.accent}bb`}
            fontFamily={font}
            fontSize={18}
            fontWeight={800}
            letterSpacing="0.18em"
          >
            {g.label.toUpperCase()}
          </text>
        );
        const stroke = {
          fill: `${g.accent}0a`,
          stroke: `${g.accent}55`,
          strokeWidth: 1.5,
          strokeDasharray: "8 8",
        };
        if (g.zone) {
          return (
            <g key={g.id}>
              <ellipse
                cx={CENTER.x}
                cy={CENTER.y}
                rx={g.zone.rx}
                ry={g.zone.ry}
                {...stroke}
              />
              {label(CENTER.x, CENTER.y - g.zone.ry + 30)}
            </g>
          );
        }
        // No ellipse: box the group's nodes with some breathing room.
        const members = NODES.filter((n) => n.group === g.id);
        const pad = 22;
        const x0 = Math.min(...members.map((n) => n.x)) - pad;
        const y0 = Math.min(...members.map((n) => n.y)) - pad;
        const x1 = Math.max(...members.map((n) => n.x + NODE_W)) + pad;
        const y1 = Math.max(...members.map((n) => n.y + NODE_H)) + pad;
        return (
          <g key={g.id}>
            <rect
              x={x0}
              y={y0}
              width={x1 - x0}
              height={y1 - y0}
              rx={18}
              {...stroke}
            />
            {label((x0 + x1) / 2, y1 - 12)}
          </g>
        );
      })}
      {EDGES.map(([from, to]) => {
        const a = NODE_BY_ID[from];
        const b = NODE_BY_ID[to];
        const x1 = a.x + NODE_W / 2;
        const y1 = a.y + NODE_H / 2;
        const x2 = b.x + NODE_W / 2;
        const y2 = b.y + NODE_H / 2;
        return (
          <line
            key={`${from}-${to}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="rgba(255,255,255,0.14)"
            strokeWidth={1.5}
            strokeDasharray="6 6"
          />
        );
      })}
    </svg>
  );
}

function NodeCard({
  node,
  selected,
  onToggle,
}: {
  node: Node;
  selected: boolean;
  onToggle: () => void;
}) {
  const group = GROUP_BY_ID[node.group];
  return (
    <div
      id={node.id}
      role="checkbox"
      aria-checked={selected}
      tabIndex={0}
      className="group-node"
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle();
        }
      }}
      style={
        {
          position: "absolute",
          left: node.x,
          top: node.y,
          width: NODE_W,
          height: NODE_H,
          boxSizing: "border-box",
          padding: "14px 16px",
          borderRadius: 14,
          background: selected
            ? `linear-gradient(135deg, ${group.accent}26, ${group.accent}10)`
            : "rgba(255,255,255,0.03)",
          border: `1px solid ${selected ? `${group.accent}aa` : `${group.accent}33`}`,
          boxShadow: selected ? `0 0 0 3px ${group.accent}33` : "none",
          display: "flex",
          alignItems: "center",
          gap: 12,
          cursor: "pointer",
          fontFamily: font,
          "--node-accent": group.accent,
        } as React.CSSProperties
      }
    >
      <span
        style={{
          width: 40,
          height: 40,
          borderRadius: 10,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          background: `${group.accent}1f`,
          border: `1px solid ${group.accent}44`,
          flexShrink: 0,
        }}
      >
        {node.icon}
      </span>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "rgba(255,255,255,0.9)",
            lineHeight: 1.25,
          }}
        >
          {node.name}
        </div>
        <div
          style={{
            fontSize: 11,
            color: "rgba(255,255,255,0.42)",
            lineHeight: 1.4,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {node.detail}
        </div>
      </div>
      <span
        aria-hidden
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          width: 14,
          height: 14,
          borderRadius: 4,
          border: `1.5px solid ${selected ? group.accent : "rgba(255,255,255,0.18)"}`,
          background: selected ? group.accent : "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {selected && (
          <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
            <path
              d="M2 5.2L4.2 7.4L8 3"
              stroke="#0b0b12"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
    </div>
  );
}

function StatusBadge({
  framing,
  capped,
}: {
  framing: string | null;
  capped: boolean;
}) {
  return useTransformComponent(({ state }) => (
    <div
      style={{
        position: "absolute",
        bottom: 16,
        right: 16,
        zIndex: 10,
        padding: "7px 12px",
        borderRadius: 10,
        background: "rgba(10, 10, 18, 0.82)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "rgba(255,255,255,0.7)",
        fontSize: 11,
        fontWeight: 600,
        fontFamily: font,
        letterSpacing: "0.02em",
        display: "flex",
        alignItems: "center",
        gap: 10,
        userSelect: "none",
        pointerEvents: "none",
      }}
    >
      <span style={{ color: "#fff" }}>{state.scale.toFixed(2)}x</span>
      {framing && (
        <span style={{ color: "rgba(255,255,255,0.45)" }}>{framing}</span>
      )}
      {capped && (
        <span
          style={{
            padding: "2px 7px",
            borderRadius: 6,
            background: "rgba(96,165,250,0.15)",
            color: "#93c5fd",
            fontSize: 10,
          }}
        >
          maxScale 1.5
        </span>
      )}
    </div>
  ));
}

/* ── Main ──────────────────────────────────────────────────── */

export const Example: React.FC<any> = (args: any) => {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [framing, setFraming] = useState<string | null>(null);
  const [capped, setCapped] = useState(false);

  const selectedIds = useMemo(() => Array.from(selected), [selected]);
  const clearActive = () => {
    setActiveGroup(null);
    setFraming(null);
  };

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div style={{ fontFamily: font, maxWidth: 960 }}>
      <style>{`
        .group-node { transition: background 0.2s, border-color 0.2s, box-shadow 0.2s; }
        .group-node:hover { border-color: var(--node-accent) !important; }
        .group-node:focus-visible { outline: 2px solid rgba(100,160,255,0.7); outline-offset: 2px; }
      `}</style>
      <TransformWrapper
        {...normalizeArgs(args)}
        minScale={0.3}
        maxScale={6}
        fitOnInit
        onPanningStart={clearActive}
        onWheelStart={clearActive}
        onPinchStart={clearActive}
      >
        {(utils) => {
          // Every zoom in this story goes through the same call: an array of
          // ids (or elements) is framed as one union box. `maxScale` keeps a
          // single small target from filling the whole viewport (#515).
          const frame = (ids: string[], label: string, key: string | null) => {
            setActiveGroup(key);
            setFraming(label);
            utils.zoomToElement(ids, {
              maxScale: capped ? 1.5 : undefined,
              animationTime: 500,
            });
          };

          const frameGroup = (groupId: string) => {
            const group = GROUP_BY_ID[groupId as GroupId];
            const ids = NODES.filter((n) => n.group === group.id).map(
              (n) => n.id,
            );
            frame(ids, `${group.label} · ${ids.length} nodes`, groupId);
          };

          const frameAll = () =>
            frame(
              NODES.map((n) => n.id),
              `All · ${NODES.length} nodes`,
              "all",
            );

          const frameSelection = () =>
            frame(selectedIds, `Selection · ${selectedIds.length} nodes`, null);

          return (
            <div style={{ position: "relative" }}>
              <Controls
                {...utils}
                resetTransform={(...rest) => {
                  clearActive();
                  return utils.resetTransform(...rest);
                }}
                extraButtons={[
                  {
                    label: capped
                      ? "Zoom cap on (maxScale 1.5)"
                      : "Cap zoom at 1.5×",
                    icon: <ToggleIcon />,
                    active: capped,
                    onClick: () => setCapped((c) => !c),
                  },
                ]}
              />

              <FocusChips
                title="Frame group"
                position="top-left"
                style={{ top: 70 }}
                activeId={activeGroup}
                onSelect={(id) => (id === "all" ? frameAll() : frameGroup(id))}
                items={[
                  ...GROUPS.map((g) => ({
                    id: g.id,
                    label: g.label,
                    icon: g.icon,
                    accent: g.accent,
                    hint: `${NODES.filter((n) => n.group === g.id).length} nodes`,
                  })),
                  {
                    id: "all",
                    label: "Everything",
                    icon: "◉",
                    accent: "#f4f4f5",
                  },
                ]}
              />

              {selectedIds.length > 0 && (
                <FocusChips
                  title={`${selectedIds.length} selected`}
                  position="bottom-center"
                  onSelect={(id) =>
                    id === "frame" ? frameSelection() : setSelected(new Set())
                  }
                  items={[
                    {
                      id: "frame",
                      label: "Frame selection",
                      icon: "⤢",
                      accent: "#fbbf24",
                    },
                    {
                      id: "clear",
                      label: "Clear",
                      icon: "✕",
                      accent: "#f87171",
                    },
                  ]}
                />
              )}

              <StatusBadge framing={framing} capped={capped} />

              <TransformComponent
                wrapperStyle={{
                  ...viewerChrome,
                  width: "100%",
                  height: "clamp(420px, calc(100vh - 360px), 600px)",
                }}
                contentStyle={{ width: CANVAS_W, height: CANVAS_H }}
              >
                <div
                  style={{
                    position: "relative",
                    width: CANVAS_W,
                    height: CANVAS_H,
                    backgroundImage:
                      "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                >
                  <Zones />
                  {NODES.map((node) => (
                    <NodeCard
                      key={node.id}
                      node={node}
                      selected={selected.has(node.id)}
                      onToggle={() => toggle(node.id)}
                    />
                  ))}
                </div>
              </TransformComponent>
            </div>
          );
        }}
      </TransformWrapper>

      <p
        style={{
          margin: "14px 0 0",
          fontSize: 12,
          color: "rgba(148, 163, 184, 0.65)",
          lineHeight: 1.7,
          letterSpacing: "0.01em",
        }}
      >
        Use the <strong style={{ color: "#d4d4d8" }}>Frame group</strong> chips
        to fit a whole cluster, or tick several nodes and press{" "}
        <strong style={{ color: "#d4d4d8" }}>Frame selection</strong>. Toggle
        the zoom cap in the control bar to see{" "}
        <code
          style={{
            color: "#a5b4fc",
            padding: "1px 5px",
            borderRadius: 4,
            background: "rgba(99,102,241,0.1)",
            fontSize: 11,
          }}
        >
          maxScale
        </code>{" "}
        stop a single node from filling the viewport.
      </p>
    </div>
  );
};
