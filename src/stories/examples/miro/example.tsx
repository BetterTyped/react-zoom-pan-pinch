import React from "react";

import { TransformWrapper, TransformComponent } from "../../../components";
import { normalizeArgs } from "../../utils";

const CANVAS_W = 4800;
const CANVAS_H = 3200;

const font = 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

const canvasBase: React.CSSProperties = {
  position: "relative",
  width: CANVAS_W,
  height: CANVAS_H,
  fontFamily: font,
};

/* ── Primitives ────────────────────────────────────────────── */

function Sticky({
  x,
  y,
  w,
  h,
  bg,
  rot = 0,
  title,
  body,
  votes = [],
  emoji = "",
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  bg: string;
  rot: number;
  title: string;
  body: string;
  votes: string[];
  emoji: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        minHeight: h,
        background: bg,
        borderRadius: 3,
        boxShadow:
          "0 1px 2px rgba(0,0,0,0.06), 0 4px 14px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.04)",
        transform: `rotate(${rot}deg)`,
        transformOrigin: "center center",
        color: "#1a1a1a",
        overflow: "hidden",
      }}
    >
      {/* Tape strip */}
      <div
        style={{
          position: "absolute",
          top: -4,
          left: "50%",
          transform: `translateX(-50%) rotate(${-rot * 0.3}deg)`,
          width: 48,
          height: 14,
          background: "rgba(255,255,255,0.45)",
          borderRadius: 1,
          boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
        }}
      />
      <div style={{ padding: "16px 16px 12px" }}>
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
        <div style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.82 }}>
          {body}
        </div>
      </div>
      {(votes.length > 0 || emoji) && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            padding: "0 14px 10px",
          }}
        >
          {votes.map((c, i) => (
            <div
              key={c}
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: c,
                border: "1.5px solid rgba(255,255,255,0.6)",
                boxShadow: "0 1px 3px rgba(0,0,0,0.12)",
                marginLeft: i > 0 ? -4 : 0,
              }}
            />
          ))}
          {emoji && (
            <span
              style={{
                fontSize: 14,
                marginLeft: votes.length > 0 ? 4 : 0,
                filter: "drop-shadow(0 1px 1px rgba(0,0,0,0.1))",
              }}
            >
              {emoji}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function Frame({
  x,
  y,
  w,
  h,
  title,
  accent = "#5c6bc0",
  children = null,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        borderRadius: 6,
        background: "#fff",
        boxShadow: `0 0 0 1px ${accent}44, 0 8px 32px rgba(40, 50, 120, 0.1)`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          flexShrink: 0,
          height: 40,
          padding: "0 14px",
          display: "flex",
          alignItems: "center",
          gap: 8,
          background: `linear-gradient(180deg, ${accent}0a 0%, ${accent}05 100%)`,
          borderBottom: `1px solid ${accent}22`,
          color: accent,
          fontSize: 13,
          fontWeight: 700,
          letterSpacing: "-0.02em",
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: 2,
            background: accent,
            opacity: 0.7,
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

function SectionLabel({
  x,
  y,
  text,
  sub = "",
}: {
  x: number;
  y: number;
  text: string;
  sub: string;
}) {
  return (
    <div style={{ position: "absolute", left: x, top: y }}>
      <div
        style={{
          fontSize: 14,
          fontWeight: 800,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "rgba(0,0,0,0.22)",
        }}
      >
        {text}
      </div>
      {sub && (
        <div style={{ fontSize: 11, color: "rgba(0,0,0,0.14)", marginTop: 2 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

function PersonaCard({
  x,
  y,
  name,
  jobTitle,
  avatar,
  traits,
  quote,
}: {
  x: number;
  y: number;
  name: string;
  jobTitle: string;
  avatar: string;
  traits: string[];
  quote: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 220,
        padding: 16,
        borderRadius: 10,
        background: "#fff",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.05)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 10,
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: avatar,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            color: "#fff",
            fontWeight: 700,
            boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
          }}
        >
          {name[0]}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#1a1a1a" }}>
            {name}
          </div>
          <div style={{ fontSize: 11, color: "#78909c" }}>{jobTitle}</div>
        </div>
      </div>
      <div
        style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}
      >
        {traits.map((t) => (
          <span
            key={t}
            style={{
              padding: "2px 8px",
              borderRadius: 4,
              background: "#f5f5f5",
              fontSize: 10,
              fontWeight: 600,
              color: "#78909c",
            }}
          >
            {t}
          </span>
        ))}
      </div>
      <div
        style={{
          fontSize: 11,
          color: "#90a4ae",
          fontStyle: "italic",
          lineHeight: 1.5,
        }}
      >
        &quot;{quote}&quot;
      </div>
    </div>
  );
}

function KanbanColumn({
  title,
  color,
  cards,
}: {
  title: string;
  color: string;
  cards: { text: string; tag?: string; tagColor?: string }[];
}) {
  return (
    <div style={{ flex: 1, minWidth: 0 }}>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color,
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: 8,
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: color,
          }}
        />
        {title}
        <span style={{ fontSize: 10, color: "#b0bec5", fontWeight: 500 }}>
          {cards.length}
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {cards.map((c) => (
          <div
            key={c.text}
            style={{
              padding: "8px 10px",
              borderRadius: 6,
              background: "#fafbfc",
              border: "1px solid rgba(0,0,0,0.05)",
              fontSize: 11,
              fontWeight: 500,
              color: "#37474f",
              lineHeight: 1.4,
            }}
          >
            {c.text}
            {c.tag && (
              <span
                style={{
                  display: "inline-block",
                  marginTop: 4,
                  padding: "1px 6px",
                  borderRadius: 3,
                  background: c.tagColor ?? "#e8eaf6",
                  fontSize: 9,
                  fontWeight: 700,
                  color: "#5c6bc0",
                }}
              >
                {c.tag}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function WireframeBlock({
  x,
  y,
  w,
  h,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        padding: 12,
        borderRadius: 8,
        background: "#fafafa",
        border: "1.5px dashed rgba(0,0,0,0.08)",
      }}
    >
      {/* Nav bar */}
      <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
        <div
          style={{
            width: 40,
            height: 6,
            borderRadius: 3,
            background: "#e0e0e0",
          }}
        />
        <div style={{ flex: 1 }} />
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            style={{
              width: 24,
              height: 6,
              borderRadius: 3,
              background: "#e8e8e8",
            }}
          />
        ))}
      </div>
      {/* Hero */}
      <div
        style={{
          height: h * 0.35,
          borderRadius: 6,
          background: "linear-gradient(135deg, #e3f2fd, #ede7f6)",
          marginBottom: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "60%",
            height: 6,
            borderRadius: 3,
            background: "rgba(0,0,0,0.06)",
          }}
        />
      </div>
      {/* Grid */}
      <div style={{ display: "flex", gap: 6 }}>
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            style={{
              flex: 1,
              height: h * 0.2,
              borderRadius: 4,
              background: n === 2 ? "#f3e5f5" : "#f5f5f5",
              border: "1px solid rgba(0,0,0,0.04)",
            }}
          />
        ))}
      </div>
    </div>
  );
}

function RemoteCursor({
  x,
  y,
  name,
  color,
}: {
  x: number;
  y: number;
  name: string;
  color: string;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        pointerEvents: "none",
        zIndex: 20,
      }}
    >
      <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
        <path
          d="M1 1L6 18L8.5 10.5L15 8L1 1Z"
          fill={color}
          stroke="#fff"
          strokeWidth="1.5"
        />
      </svg>
      <span
        style={{
          display: "inline-block",
          marginLeft: 12,
          marginTop: -2,
          padding: "2px 8px",
          borderRadius: 4,
          background: color,
          fontSize: 10,
          fontWeight: 700,
          color: "#fff",
          whiteSpace: "nowrap",
          boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        }}
      >
        {name}
      </span>
    </div>
  );
}

/* ── Board ─────────────────────────────────────────────────── */

function MiroBoard() {
  return (
    <div style={canvasBase}>
      {/* ── Section 1: Brainstorm ────────────────────────── */}
      <SectionLabel
        x={120}
        y={100}
        text="Brainstorm"
        sub="Sprint 14 kick-off"
      />

      <Sticky
        x={140}
        y={180}
        w={240}
        h={170}
        bg="#fff59d"
        rot={-2}
        title="🔥 Pain points"
        body="Checkout drops off 34% on mobile — form fields are too small and load time > 3s."
        votes={["#ef5350", "#42a5f5", "#66bb6a"]}
        emoji="👍"
      />
      <Sticky
        x={410}
        y={220}
        w={220}
        h={155}
        bg="#ffccbc"
        rot={1.5}
        title="Competitor scan"
        body="Notion's onboarding: 3 steps. FigJam: instant canvas. We need < 2 clicks."
        votes={["#7e57c2"]}
        emoji=""
      />
      <Sticky
        x={140}
        y={420}
        w={230}
        h={165}
        bg="#c5e1a5"
        rot={-1}
        title="Next sprint"
        body="Prototype sticky grid + keyboard panning. Ship velocity story."
        votes={[]}
        emoji="🚀"
      />
      <Sticky
        x={400}
        y={440}
        w={215}
        h={150}
        bg="#b3e5fc"
        rot={2.5}
        title="Tech debt"
        body="Remove legacy transform fallback. Migrate tests to vitest."
        votes={["#ef5350", "#ff7043"]}
        emoji="⚠️"
      />
      <Sticky
        x={260}
        y={640}
        w={250}
        h={140}
        bg="#f8bbd0"
        rot={-0.5}
        title="Quick wins"
        body="Add double-tap reset, improve trackpad detection on Firefox."
        votes={[]}
        emoji="✨"
      />

      {/* ── Section 2: Research ──────────────────────────── */}
      <SectionLabel x={720} y={100} text="User Research" sub="Q2 interviews" />

      <Frame x={720} y={160} w={640} h={680} title="Personas" accent="#26a69a">
        <PersonaCard
          x={24}
          y={16}
          name="Sarah Chen"
          jobTitle="Product Designer"
          avatar="linear-gradient(135deg, #26a69a, #00897b)"
          traits={["Figma power user", "Remote", "IC"]}
          quote="I need zoom-to-element to present specific frames during reviews."
        />
        <PersonaCard
          x={280}
          y={16}
          name="Alex Rivera"
          jobTitle="Engineering Lead"
          avatar="linear-gradient(135deg, #5c6bc0, #3949ab)"
          traits={["React", "Performance", "Mobile"]}
          quote="The library must handle 10k nodes without jank."
        />
        <PersonaCard
          x={24}
          y={260}
          name="Mika Patel"
          jobTitle="Event Coordinator"
          avatar="linear-gradient(135deg, #ef5350, #d32f2f)"
          traits={["Non-technical", "iPad", "Venue maps"]}
          quote="I just need to tap a seat and it zooms in. That's it."
        />
        <PersonaCard
          x={280}
          y={260}
          name="Jordan Lee"
          jobTitle="Data Analyst"
          avatar="linear-gradient(135deg, #ff9800, #f57c00)"
          traits={["Dashboards", "Chrome", "Accessibility"]}
          quote="Keyboard navigation is non-negotiable for our team."
        />
        <div style={{ position: "absolute", left: 24, bottom: 16, right: 24 }}>
          <div style={{ display: "flex", gap: 8 }}>
            {["Pain points", "Goals", "Behaviors", "Frustrations"].map(
              (label) => (
                <div
                  key={label}
                  style={{
                    flex: 1,
                    padding: "6px 8px",
                    borderRadius: 6,
                    background: "#f0fdf4",
                    textAlign: "center",
                    fontSize: 10,
                    fontWeight: 600,
                    color: "#26a69a",
                  }}
                >
                  {label}
                </div>
              ),
            )}
          </div>
        </div>
      </Frame>

      {/* ── Section 3: Journey Map ───────────────────────── */}
      <SectionLabel
        x={1440}
        y={100}
        text="Journey Map"
        sub="Onboarding flow v2"
      />

      <Frame
        x={1440}
        y={160}
        w={1160}
        h={420}
        title="User onboarding"
        accent="#7e57c2"
      >
        <div style={{ padding: "24px 32px" }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 0 }}>
            {[
              {
                step: "Sign up",
                emotion: "😊",
                desc: "Quick OAuth flow",
                metric: "92% complete",
                bg: "#ede7f6",
              },
              {
                step: "First board",
                emotion: "🤔",
                desc: "Blank canvas confusion",
                metric: "61% drop-off",
                bg: "#fce4ec",
              },
              {
                step: "Add content",
                emotion: "😐",
                desc: "Toolbar discovery",
                metric: "45% use stickies",
                bg: "#fff3e0",
              },
              {
                step: "Collaborate",
                emotion: "😊",
                desc: "Share link works well",
                metric: "78% invite 1+",
                bg: "#e8f5e9",
              },
              {
                step: "Return",
                emotion: "😍",
                desc: "Template gallery helps",
                metric: "38% D7 retention",
                bg: "#e3f2fd",
              },
            ].map((s, i, arr) => (
              <React.Fragment key={s.step}>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: "50%",
                      background: s.bg,
                      margin: "0 auto 8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 22,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                    }}
                  >
                    {s.emotion}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#263238",
                      marginBottom: 4,
                    }}
                  >
                    {s.step}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: "#78909c",
                      lineHeight: 1.4,
                      marginBottom: 6,
                    }}
                  >
                    {s.desc}
                  </div>
                  <div
                    style={{
                      display: "inline-block",
                      padding: "2px 8px",
                      borderRadius: 4,
                      background: s.bg,
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#546e7a",
                    }}
                  >
                    {s.metric}
                  </div>
                </div>
                {i < arr.length - 1 && (
                  <div
                    style={{
                      width: 40,
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      paddingTop: 18,
                    }}
                  >
                    <div
                      style={{
                        width: 28,
                        height: 2,
                        background: "#b0bec5",
                        position: "relative",
                      }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          right: -3,
                          top: -3,
                          width: 0,
                          height: 0,
                          borderTop: "4px solid transparent",
                          borderBottom: "4px solid transparent",
                          borderLeft: "6px solid #b0bec5",
                        }}
                      />
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
          {/* Opportunity row */}
          <div
            style={{
              marginTop: 20,
              padding: "10px 16px",
              borderRadius: 8,
              background: "#faf9ff",
              border: "1px dashed rgba(126,87,194,0.2)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <span style={{ fontSize: 14 }}>💡</span>
            <span style={{ fontSize: 12, color: "#5c6bc0", fontWeight: 600 }}>
              Biggest opportunity: guided first-board experience reduces
              drop-off by ~25%
            </span>
          </div>
        </div>
      </Frame>

      {/* ── Section 4: Kanban ────────────────────────────── */}
      <SectionLabel x={720} y={900} text="Sprint Board" sub="Week 3 of 4" />

      <Frame
        x={720}
        y={960}
        w={880}
        h={440}
        title="Sprint 14 · In progress"
        accent="#ff7043"
      >
        <div
          style={{
            display: "flex",
            gap: 14,
            padding: "12px 14px",
            height: "100%",
          }}
        >
          <KanbanColumn
            title="Todo"
            color="#90a4ae"
            cards={[
              {
                text: "Keyboard arrow-key panning",
                tag: "feat",
                tagColor: "#e8eaf6",
              },
              {
                text: "Safari pinch regression",
                tag: "bug",
                tagColor: "#fce4ec",
              },
              { text: "Docs: migration guide v4" },
            ]}
          />
          <KanbanColumn
            title="In progress"
            color="#42a5f5"
            cards={[
              {
                text: "Infinite canvas background",
                tag: "feat",
                tagColor: "#e8eaf6",
              },
              {
                text: "Velocity animation refactor",
                tag: "perf",
                tagColor: "#fff3e0",
              },
            ]}
          />
          <KanbanColumn
            title="Review"
            color="#ab47bc"
            cards={[
              {
                text: "KeepScale observer cleanup",
                tag: "fix",
                tagColor: "#fce4ec",
              },
            ]}
          />
          <KanbanColumn
            title="Done"
            color="#66bb6a"
            cards={[
              {
                text: "MiniMap custom classNames",
                tag: "feat",
                tagColor: "#e8eaf6",
              },
              {
                text: "Stadium example perf",
                tag: "perf",
                tagColor: "#fff3e0",
              },
              { text: "Product card example" },
            ]}
          />
        </div>
      </Frame>

      {/* ── Section 5: Wireframes ────────────────────────── */}
      <SectionLabel x={1700} y={640} text="Wireframes" sub="Homepage v3" />

      <Frame
        x={1700}
        y={700}
        w={540}
        h={460}
        title="Landing page"
        accent="#42a5f5"
      >
        <WireframeBlock x={20} y={12} w={480} h={400} />
      </Frame>

      <Frame
        x={2300}
        y={700}
        w={540}
        h={460}
        title="Dashboard"
        accent="#ef5350"
      >
        <div
          style={{
            position: "absolute",
            left: 20,
            top: 12,
            right: 20,
            bottom: 12,
            padding: 12,
            borderRadius: 8,
            background: "#fafafa",
            border: "1.5px dashed rgba(0,0,0,0.06)",
          }}
        >
          {/* Sidebar */}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              bottom: 0,
              width: 50,
              background: "#263238",
              borderRadius: "8px 0 0 8px",
            }}
          >
            {[0, 1, 2, 3].map((n) => (
              <div
                key={n}
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 4,
                  background:
                    n === 0
                      ? "rgba(255,255,255,0.2)"
                      : "rgba(255,255,255,0.06)",
                  margin: "10px auto 0",
                }}
              />
            ))}
          </div>
          {/* Content */}
          <div style={{ marginLeft: 60 }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
              {[1, 2, 3, 4].map((n) => (
                <div
                  key={n}
                  style={{
                    flex: 1,
                    height: 60,
                    borderRadius: 6,
                    background:
                      (
                        { 1: "#e3f2fd", 2: "#fce4ec", 3: "#e8f5e9" } as Record<
                          number,
                          string
                        >
                      )[n] ?? "#fff3e0",
                    border: "1px solid rgba(0,0,0,0.04)",
                  }}
                >
                  <div
                    style={{
                      padding: "8px",
                      fontSize: 8,
                      color: "#78909c",
                      fontWeight: 700,
                    }}
                  >
                    {["Users", "Revenue", "Sessions", "NPS"][n - 1]}
                  </div>
                  <div
                    style={{
                      padding: "0 8px",
                      fontSize: 14,
                      fontWeight: 800,
                      color: "#263238",
                    }}
                  >
                    {["12.4k", "$84k", "3.2m", "72"][n - 1]}
                  </div>
                </div>
              ))}
            </div>
            {/* Chart placeholder */}
            <div
              style={{
                height: 120,
                borderRadius: 6,
                background: "#fafbfc",
                border: "1px solid rgba(0,0,0,0.04)",
                display: "flex",
                alignItems: "flex-end",
                padding: "8px 12px",
                gap: 8,
              }}
            >
              {[65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88, 72].map((h, i) => (
                <div
                  key={h}
                  style={{
                    flex: 1,
                    height: `${h}%`,
                    borderRadius: "3px 3px 0 0",
                    background:
                      i >= 10
                        ? "#e3f2fd"
                        : `rgba(66, 165, 245, ${0.2 + (h / 100) * 0.6})`,
                  }}
                />
              ))}
            </div>
            <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
              {[1, 2].map((n) => (
                <div
                  key={n}
                  style={{
                    flex: 1,
                    height: 50,
                    borderRadius: 6,
                    background: "#fafbfc",
                    border: "1px solid rgba(0,0,0,0.04)",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </Frame>

      {/* ── Section 6: Metrics ───────────────────────────── */}
      <SectionLabel x={1700} y={1220} text="Key Metrics" sub="Week over week" />

      <Frame
        x={1700}
        y={1280}
        w={500}
        h={300}
        title="Performance"
        accent="#66bb6a"
      >
        <div style={{ padding: 16, display: "flex", gap: 12 }}>
          {[
            { label: "LCP", value: "1.2s", delta: "-18%", good: true },
            { label: "FID", value: "42ms", delta: "-12%", good: true },
            { label: "CLS", value: "0.04", delta: "+2%", good: false },
            { label: "Bundle", value: "14kb", delta: "—", good: true },
          ].map((m) => (
            <div
              key={m.label}
              style={{
                flex: 1,
                padding: 12,
                borderRadius: 8,
                background: "#fafbfc",
                border: "1px solid rgba(0,0,0,0.04)",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: "#90a4ae",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: 6,
                }}
              >
                {m.label}
              </div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#263238",
                  marginBottom: 4,
                }}
              >
                {m.value}
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: m.good ? "#43a047" : "#e53935",
                }}
              >
                {m.delta}
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: "0 16px 12px", display: "flex", gap: 8 }}>
          <div
            style={{
              flex: 2,
              height: 80,
              borderRadius: 6,
              background: "#f1f8e9",
              border: "1px solid rgba(0,0,0,0.03)",
            }}
          />
          <div
            style={{
              flex: 1,
              height: 80,
              borderRadius: 6,
              background: "#fff3e0",
              border: "1px solid rgba(0,0,0,0.03)",
            }}
          />
        </div>
      </Frame>

      {/* ── Loose stickies ───────────────────────────────── */}
      <Sticky
        x={120}
        y={840}
        w={260}
        h={160}
        bg="#ffe082"
        rot={2.2}
        title="🚀 Ship checklist"
        body="Docs · Storybook · regression on wheel + trackpad split · changelog."
        votes={["#5c6bc0", "#26a69a"]}
        emoji=""
      />
      <Sticky
        x={380}
        y={880}
        w={230}
        h={140}
        bg="#b2dfdb"
        rot={-1.5}
        title="📊 Analytics"
        body="Track zoom/pan gesture frequency for UX insights."
        votes={[]}
        emoji="📈"
      />

      {/* ── Connector arrows (SVG) ───────────────────────── */}
      <svg
        width={CANVAS_W}
        height={CANVAS_H}
        style={{ position: "absolute", left: 0, top: 0, pointerEvents: "none" }}
        aria-hidden
      >
        <defs>
          <marker
            id="arrow-end"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8 L2,4 Z" fill="#90a4ae" />
          </marker>
          <marker
            id="arrow-purple"
            markerWidth="8"
            markerHeight="8"
            refX="7"
            refY="4"
            orient="auto"
          >
            <path d="M0,0 L8,4 L0,8 L2,4 Z" fill="#7e57c2" />
          </marker>
        </defs>
        {/* Brainstorm → Research */}
        <path
          d="M 630 340 Q 680 300 720 320"
          fill="none"
          stroke="#90a4ae"
          strokeWidth={2}
          markerEnd="url(#arrow-end)"
        />
        {/* Research → Journey map */}
        <path
          d="M 1360 500 Q 1400 440 1440 460"
          fill="none"
          stroke="#90a4ae"
          strokeWidth={2}
          markerEnd="url(#arrow-end)"
          strokeDasharray="6 6"
        />
        {/* Stickies → Sprint board */}
        <path
          d="M 500 780 Q 600 860 720 960"
          fill="none"
          stroke="#90a4ae"
          strokeWidth={1.5}
          markerEnd="url(#arrow-end)"
          strokeDasharray="4 6"
        />
        {/* Journey → Wireframes */}
        <path
          d="M 2000 580 Q 2020 640 1970 700"
          fill="none"
          stroke="#7e57c2"
          strokeWidth={2}
          markerEnd="url(#arrow-purple)"
        />
      </svg>

      {/* ── Remote cursors ───────────────────────────────── */}
      <RemoteCursor x={900} y={400} name="Sarah" color="#26a69a" />
      <RemoteCursor x={2200} y={350} name="Alex" color="#5c6bc0" />

      {/* ── Comment bubble ───────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          left: 1380,
          top: 440,
          padding: "6px 12px",
          borderRadius: "12px 12px 12px 2px",
          background: "#1a73e8",
          color: "#fff",
          fontSize: 11,
          fontWeight: 600,
          boxShadow: "0 2px 8px rgba(26,115,232,0.3)",
          maxWidth: 180,
          lineHeight: 1.4,
        }}
      >
        Should we add a template picker here? 💬
      </div>

      {/* ── Active users strip ───────────────────────────── */}
      <div
        style={{
          position: "absolute",
          left: CANVAS_W - 340,
          top: CANVAS_H - 80,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "8px 14px",
          borderRadius: 10,
          background: "rgba(255,255,255,0.95)",
          boxShadow: "0 2px 12px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.06)",
          fontSize: 12,
          color: "#546e7a",
          fontWeight: 600,
        }}
      >
        {[
          { bg: "linear-gradient(135deg, #26a69a, #00897b)", name: "S" },
          { bg: "linear-gradient(135deg, #5c6bc0, #3949ab)", name: "A" },
          { bg: "linear-gradient(135deg, #ef5350, #d32f2f)", name: "M" },
        ].map((u, i) => (
          <span
            key={u.name}
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: u.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 11,
              fontWeight: 700,
              color: "#fff",
              marginLeft: i > 0 ? -12 : 0,
              border: "2px solid #fff",
              boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
            }}
          >
            {u.name}
          </span>
        ))}
        <span style={{ marginLeft: 4, fontSize: 11 }}>3 active now</span>
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#4caf50",
            boxShadow: "0 0 6px rgba(76,175,80,0.4)",
          }}
        />
      </div>
    </div>
  );
}

const miroViewer: React.CSSProperties = {
  width: "100%",
  height: "100%",
  borderRadius: 0,
  border: "none",
  background: "#f5f4f1",
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

function HintChip({ kbd, text }: { kbd: string; text: string }) {
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
      {kbd && (
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
          {kbd}
        </kbd>
      )}
      <span>{text}</span>
    </div>
  );
}

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
        <HintChip kbd="" text="Trackpad / drag to pan" />
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
                    i === 1
                      ? "1px solid rgba(92,107,192,0.35)"
                      : "1px solid transparent",
                }}
                title={tool.tip}
              >
                <span
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius:
                      ({ 4: 4, 5: 2 } as Record<number, number | string>)[i] ??
                      "50%",
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
              limitToBounds={false}
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
                infinite
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
