import React, { useCallback, useRef, useState } from "react";

import { TransformWrapper, TransformComponent } from "../../../components";
import { normalizeArgs, Controls, CloseIcon, viewerChrome } from "../../utils";
import {
  ALL_SEATS,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  CATEGORY_META,
  CX,
  CY,
  CONCOURSE_RINGS,
  FACILITY_FEE,
  GATE_POSITIONS,
  OCCUPIED_ACCENT,
  OCCUPIED_BORDER,
  PITCH_RX,
  PITCH_RY,
  SEAT_SIZE,
  SECTION_LABELS,
  SELECTED_ACCENT,
  SELECTED_BORDER,
  SELECTED_GLOW,
  SERVICE_FEE,
  isOccupied,
  type StadiumSeat,
} from "./stadium-data";

const font =
  'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

type Api = {
  zoomToElement: (target: string | HTMLElement, scale?: number) => void;
  resetTransform: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
};

export const Example: React.FC<Record<string, unknown>> = (args) => {
  const [selected, setSelected] = useState<StadiumSeat | null>(null);
  const [purchased, setPurchased] = useState(false);
  const [hoverId, setHoverId] = useState<string | null>(null);
  const apiRef = useRef<Api | null>(null);

  const onSeatClick = useCallback((seat: StadiumSeat) => {
    if (purchased || isOccupied(seat.id)) return;
    setSelected(seat);
    requestAnimationFrame(() => {
      apiRef.current?.zoomToElement(seat.domId, 3.2);
    });
  }, [purchased]);

  const clearSelection = useCallback(() => {
    setSelected(null);
    apiRef.current?.resetTransform();
  }, []);

  const handlePurchase = useCallback(() => {
    if (!selected) return;
    setPurchased(true);
  }, [selected]);

  return (
    <div
      style={{
        fontFamily: font,
        background:
          "radial-gradient(1200px 600px at 50% -10%, rgba(56, 189, 248, 0.08), transparent), linear-gradient(180deg, #030712 0%, #0f172a 45%, #020617 100%)",
        minHeight: 720,
        padding: "20px 24px 32px",
        borderRadius: 16,
        boxSizing: "border-box",
      }}
    >
      <EventHeader />

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 20,
          alignItems: "stretch",
          justifyContent: "center",
        }}
      >
        <div style={{ flex: "1 1 640px", minWidth: 320, maxWidth: 980 }}>
          <TransformWrapper
            {...normalizeArgs(args)}
            initialScale={0.42}
            minScale={0.22}
            maxScale={6}
            limitToBounds
            centerZoomedOut
            centerOnInit
            doubleClick={{ disabled: true }}
          >
            {(api) => {
              apiRef.current = api;
              return (
                <div style={{ position: "relative" }}>
                  <Controls
                    {...api}
                    position="top-left"
                    extraButtons={[
                      ...(selected && !purchased
                        ? [
                            {
                              label: "Clear seat",
                              icon: <CloseIcon />,
                              onClick: clearSelection,
                            },
                          ]
                        : []),
                    ]}
                  />
                  <LegendChip />

                  <TransformComponent
                    wrapperStyle={{
                      width: "100%",
                      height: "min(62vh, 640px)",
                      minHeight: 420,
                      ...viewerChrome,
                      overflow: "hidden",
                    }}
                    contentStyle={{
                      width: CANVAS_WIDTH,
                      height: CANVAS_HEIGHT,
                    }}
                  >
                    <StadiumCanvas
                      selectedId={selected?.id ?? null}
                      hoverId={hoverId}
                      purchased={purchased}
                      onHover={setHoverId}
                      onSeatClick={onSeatClick}
                    />
                  </TransformComponent>
                </div>
              );
            }}
          </TransformWrapper>

          <p
            style={{
              margin: "14px 0 0",
              fontSize: 12,
              color: "rgba(148, 163, 184, 0.85)",
              lineHeight: 1.5,
            }}
          >
            Pinch or scroll to zoom. Drag to pan. Tap an available seat to focus
            it and open your ticket summary — club rows ring the pitch; upper
            tier is the outer ring.
          </p>
        </div>

        <TicketPanel
          seat={selected}
          purchased={purchased}
          onPurchase={handlePurchase}
          onClear={clearSelection}
        />
      </div>
    </div>
  );
};

function EventHeader() {
  return (
    <header
      style={{
        marginBottom: 22,
        display: "flex",
        flexWrap: "wrap",
        alignItems: "flex-end",
        justifyContent: "space-between",
        gap: 16,
      }}
    >
      <div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "rgba(56, 189, 248, 0.9)",
            marginBottom: 6,
          }}
        >
          Lumen Arena · Official map
        </div>
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(1.35rem, 2.5vw, 1.85rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            color: "#f8fafc",
            lineHeight: 1.15,
          }}
        >
          Aurora North Tour
        </h1>
        <p
          style={{
            margin: "8px 0 0",
            fontSize: 14,
            color: "rgba(203, 213, 225, 0.92)",
          }}
        >
          Saturday, June 14 · Doors 7:00 PM · Show 8:30 PM
        </p>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 16px",
          borderRadius: 12,
          background: "rgba(15, 23, 42, 0.65)",
          border: "1px solid rgba(148, 163, 184, 0.15)",
          backdropFilter: "blur(12px)",
        }}
      >
        <span
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#22c55e",
            boxShadow: "0 0 12px rgba(34, 197, 94, 0.7)",
          }}
        />
        <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>
          Live inventory
        </span>
      </div>
    </header>
  );
}

function LegendChip() {
  return (
    <div
      style={{
        position: "absolute",
        top: 18,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 6,
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        justifyContent: "center",
        padding: "8px 16px",
        borderRadius: 999,
        background: "rgba(2, 6, 23, 0.75)",
        border: "1px solid rgba(148, 163, 184, 0.12)",
        backdropFilter: "blur(10px)",
        pointerEvents: "none",
      }}
    >
      {(Object.keys(CATEGORY_META) as (keyof typeof CATEGORY_META)[]).map(
        (k) => (
          <span
            key={k}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              fontWeight: 600,
              color: "rgba(226, 232, 240, 0.85)",
            }}
          >
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 3,
                background: CATEGORY_META[k].accent,
                boxShadow: `0 0 10px ${CATEGORY_META[k].glow}`,
              }}
            />
            {CATEGORY_META[k].label}
          </span>
        ),
      )}
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          fontSize: 11,
          fontWeight: 600,
          color: "rgba(148, 163, 184, 0.7)",
        }}
      >
        <span
          style={{
            width: 10,
            height: 10,
            borderRadius: 3,
            background: "rgba(51, 65, 85, 0.9)",
          }}
        />
        Unavailable
      </span>
    </div>
  );
}

function StadiumCanvas(props: {
  selectedId: string | null;
  hoverId: string | null;
  purchased: boolean;
  onHover: (id: string | null) => void;
  onSeatClick: (s: StadiumSeat) => void;
}) {
  const { selectedId, hoverId, purchased, onHover, onSeatClick } = props;

  return (
    <div
      style={{
        position: "relative",
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        background:
          "radial-gradient(ellipse 55% 48% at 50% 50%, rgba(15, 23, 42, 0.35) 0%, #020617 72%)",
        fontFamily: font,
      }}
    >
      <PitchSvg />

      {ALL_SEATS.map((seat) => {
        const taken = isOccupied(seat.id);
        const sel = selectedId === seat.id;
        const hov = hoverId === seat.id;
        const meta = CATEGORY_META[seat.category];

        const bg = taken ? OCCUPIED_ACCENT : sel ? SELECTED_ACCENT : meta.accent;
        const bdr = taken ? OCCUPIED_BORDER : sel ? SELECTED_BORDER : meta.border;
        const shadow = taken
          ? "none"
          : sel
            ? `0 0 18px ${SELECTED_GLOW}, 0 0 6px ${SELECTED_GLOW}`
            : hov
              ? `0 4px 14px rgba(0,0,0,0.4), 0 0 12px ${meta.glow}`
              : `0 2px 6px rgba(0,0,0,0.35)`;

        return (
          <button
            key={seat.id}
            id={seat.domId}
            type="button"
            title={
              taken
                ? `${seat.section} · Row ${seat.row} · Seat ${seat.number} — Sold`
                : `${seat.section} · Row ${seat.row} · Seat ${seat.number} — $${seat.price}`
            }
            onClick={() => onSeatClick(seat)}
            onMouseEnter={() => onHover(seat.id)}
            onMouseLeave={() => onHover(null)}
            disabled={taken || purchased}
            style={{
              position: "absolute",
              left: seat.x,
              top: seat.y,
              width: SEAT_SIZE,
              height: SEAT_SIZE,
              padding: 0,
              borderRadius: "8px 8px 3px 3px",
              border: `1.5px solid ${bdr}`,
              background: bg,
              boxShadow: shadow,
              transform: `rotate(${seat.rotation}deg) scale(${hov && !taken ? 1.15 : 1})`,
              transformOrigin: "center center",
              cursor: taken || purchased ? "default" : "pointer",
              opacity: taken ? 0.35 : 1,
              zIndex: sel ? 5 : 1,
              transition:
                "transform 0.15s ease, box-shadow 0.15s ease, border-color 0.15s ease",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                color: taken ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.7)",
                fontSize: 9,
                fontWeight: 700,
                userSelect: "none",
                pointerEvents: "none",
                fontFamily: "system-ui, sans-serif",
              }}
            >
              {seat.number}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function PitchSvg() {
  return (
    <svg
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
      aria-hidden
    >
      <defs>
        <linearGradient id="grass" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#15803d" />
          <stop offset="45%" stopColor="#166534" />
          <stop offset="100%" stopColor="#14532d" />
        </linearGradient>
        <pattern id="stripes" patternUnits="userSpaceOnUse" width={56} height={CANVAS_HEIGHT}>
          <rect width={28} height="100%" fill="rgba(255,255,255,0.03)" />
          <rect x={28} width={28} height="100%" fill="rgba(0,0,0,0.04)" />
        </pattern>
        <radialGradient id="bowl-glow" cx="50%" cy="50%">
          <stop offset="0%" stopColor="rgba(15, 23, 42, 0.25)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* Subtle glow behind bowl */}
      <ellipse cx={CX} cy={CY} rx={PITCH_RX + 500} ry={PITCH_RY + 400} fill="url(#bowl-glow)" />

      {/* Pitch */}
      <ellipse cx={CX} cy={CY} rx={PITCH_RX} ry={PITCH_RY} fill="url(#grass)" />
      <ellipse cx={CX} cy={CY} rx={PITCH_RX} ry={PITCH_RY} fill="url(#stripes)" />
      <ellipse cx={CX} cy={CY} rx={PITCH_RX} ry={PITCH_RY} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={3} />

      {/* Center circle */}
      <ellipse cx={CX} cy={CY} rx={80} ry={55} fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth={2} />
      <circle cx={CX} cy={CY} r={4} fill="rgba(255,255,255,0.2)" />

      {/* Halfway line */}
      <line x1={CX} y1={CY - PITCH_RY} x2={CX} y2={CY + PITCH_RY} stroke="rgba(255,255,255,0.15)" strokeWidth={2} />

      {/* PITCH label */}
      <text
        x={CX}
        y={CY - 10}
        textAnchor="middle"
        fill="rgba(255,255,255,0.1)"
        style={{ fontSize: 32, fontWeight: 800, fontFamily: font, letterSpacing: "0.3em" }}
      >
        LUMEN ARENA
      </text>

      {/* Concourse rings (walkways between tiers) */}
      {CONCOURSE_RINGS.map((offset, i) => (
        <ellipse
          key={i}
          cx={CX}
          cy={CY}
          rx={PITCH_RX + offset}
          ry={PITCH_RY + offset}
          fill="none"
          stroke="rgba(100, 116, 139, 0.12)"
          strokeWidth={1.5}
          strokeDasharray="8 6"
        />
      ))}

      {/* Section labels */}
      {SECTION_LABELS.map((s) => (
        <text
          key={s.section}
          x={s.x}
          y={s.y}
          textAnchor="middle"
          dominantBaseline="central"
          fill="rgba(255,255,255,0.08)"
          style={{ fontSize: 22, fontWeight: 800, fontFamily: font, letterSpacing: "0.2em" }}
        >
          {s.section.toUpperCase()}
        </text>
      ))}

      {/* Gate markers */}
      {GATE_POSITIONS.map((g) => (
        <g key={g.label}>
          <rect
            x={g.x - 20}
            y={g.y - 12}
            width={40}
            height={24}
            rx={6}
            fill="rgba(16, 185, 129, 0.12)"
            stroke="rgba(16, 185, 129, 0.25)"
            strokeWidth={1}
          />
          <text
            x={g.x}
            y={g.y + 1}
            textAnchor="middle"
            dominantBaseline="central"
            fill="rgba(16, 185, 129, 0.5)"
            style={{ fontSize: 10, fontWeight: 800, fontFamily: font, letterSpacing: "1px" }}
          >
            GATE
          </text>
        </g>
      ))}
    </svg>
  );
}

function TicketPanel(props: {
  seat: StadiumSeat | null;
  purchased: boolean;
  onPurchase: () => void;
  onClear: () => void;
}) {
  const { seat, purchased, onPurchase, onClear } = props;

  return (
    <aside
      style={{
        flex: "0 1 380px",
        minWidth: 300,
        maxWidth: 420,
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
    >
      <div
        style={{
          borderRadius: 20,
          padding: 2,
          background:
            "linear-gradient(135deg, rgba(56, 189, 248, 0.35), rgba(167, 139, 250, 0.25), rgba(251, 191, 36, 0.2))",
        }}
      >
        <div
          style={{
            borderRadius: 18,
            background: "rgba(15, 23, 42, 0.92)",
            backdropFilter: "blur(20px)",
            border: "1px solid rgba(148, 163, 184, 0.1)",
            padding: "22px 22px 20px",
            minHeight: 440,
            display: "flex",
            flexDirection: "column",
          }}
        >
          {!seat && !purchased && (
            <EmptyPanel />
          )}

          {seat && !purchased && (
            <>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(148, 163, 184, 0.85)",
                  marginBottom: 14,
                }}
              >
                Your selection
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: 12,
                  marginBottom: 20,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 42,
                      fontWeight: 900,
                      letterSpacing: "-0.04em",
                      color: "#f8fafc",
                      lineHeight: 1,
                    }}
                  >
                    {seat.number}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: "rgba(148, 163, 184, 0.95)",
                      marginTop: 6,
                    }}
                  >
                    Seat number
                  </div>
                </div>
                <div
                  style={{
                    textAlign: "right",
                    paddingTop: 4,
                  }}
                >
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 700,
                      color: "#e2e8f0",
                    }}
                  >
                    {seat.section} stand
                  </div>
                  <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>
                    Row {seat.row}
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: "12px 14px",
                  borderRadius: 12,
                  background: "rgba(30, 41, 59, 0.65)",
                  border: "1px solid rgba(71, 85, 105, 0.35)",
                  marginBottom: 18,
                }}
              >
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "#cbd5e1",
                    marginBottom: 8,
                  }}
                >
                  {CATEGORY_META[seat.category].label}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#64748b",
                    lineHeight: 1.5,
                  }}
                >
                  Covered sightline · In-seat service on club rows · Mobile
                  entry
                </div>
              </div>

              <PriceBreakdown seat={seat} />

              <button
                type="button"
                onClick={onPurchase}
                style={{
                  marginTop: "auto",
                  padding: "16px 20px",
                  borderRadius: 14,
                  border: "none",
                  fontSize: 15,
                  fontWeight: 800,
                  fontFamily: "inherit",
                  letterSpacing: "-0.01em",
                  cursor: "pointer",
                  color: "#0f172a",
                  background:
                    "linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #ea580c 100%)",
                  boxShadow:
                    "0 4px 24px rgba(245, 158, 11, 0.35), 0 0 0 1px rgba(255,255,255,0.15) inset",
                }}
              >
                Lock this seat · ${seat.price + SERVICE_FEE + FACILITY_FEE}{" "}
                total
              </button>

              <button
                type="button"
                onClick={onClear}
                style={{
                  marginTop: 10,
                  padding: "10px",
                  borderRadius: 10,
                  border: "1px solid rgba(148, 163, 184, 0.2)",
                  background: "transparent",
                  color: "#94a3b8",
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: "inherit",
                  cursor: "pointer",
                }}
              >
                Choose a different seat
              </button>
            </>
          )}

          {purchased && seat && (
            <SuccessView seat={seat} />
          )}
        </div>
      </div>

      {seat && !purchased && <TicketStubPreview seat={seat} />}
    </aside>
  );
}

function EmptyPanel() {
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "20px 8px",
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: "50%",
          background:
            "linear-gradient(145deg, rgba(56, 189, 248, 0.15), rgba(167, 139, 250, 0.12))",
          border: "1px solid rgba(148, 163, 184, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 18,
        }}
      >
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 3L4 9v12h16V9l-8-6z"
            stroke="rgba(148, 163, 184, 0.7)"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M9 14h6M9 18h4"
            stroke="rgba(148, 163, 184, 0.5)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div
        style={{
          fontSize: 17,
          fontWeight: 700,
          color: "#e2e8f0",
          marginBottom: 8,
        }}
      >
        Pick your view
      </div>
      <p
        style={{
          margin: 0,
          fontSize: 13,
          lineHeight: 1.55,
          color: "rgba(148, 163, 184, 0.9)",
          maxWidth: 280,
        }}
      >
        Zoom into the bowl and tap any glowing seat. We&apos;ll frame your
        spot and break down fees like a real checkout.
      </p>
    </div>
  );
}

function PriceBreakdown({ seat }: { seat: StadiumSeat }) {
  const sub = seat.price;
  const total = sub + SERVICE_FEE + FACILITY_FEE;
  return (
    <div style={{ marginBottom: 20 }}>
      {(
        [
          ["Ticket", sub],
          ["Service fee", SERVICE_FEE],
          ["Facility charge", FACILITY_FEE],
        ] as const
      ).map(([label, amt]) => (
        <div
          key={label}
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 13,
            color: "#94a3b8",
            marginBottom: 8,
          }}
        >
          <span>{label}</span>
          <span style={{ color: "#e2e8f0", fontWeight: 600 }}>${amt}</span>
        </div>
      ))}
      <div
        style={{
          height: 1,
          background: "rgba(71, 85, 105, 0.5)",
          margin: "12px 0",
        }}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "#f1f5f9",
          }}
        >
          Total
        </span>
        <span
          style={{
            fontSize: 22,
            fontWeight: 900,
            letterSpacing: "-0.03em",
            color: "#fbbf24",
          }}
        >
          ${total}
        </span>
      </div>
    </div>
  );
}

function TicketStubPreview({ seat }: { seat: StadiumSeat }) {
  return (
    <div
      style={{
        borderRadius: 14,
        padding: "16px 18px",
        background:
          "repeating-linear-gradient(90deg, transparent, transparent 6px, rgba(148,163,184,0.06) 6px, rgba(148,163,184,0.06) 7px), rgba(15, 23, 42, 0.6)",
        border: "1px dashed rgba(148, 163, 184, 0.25)",
      }}
    >
      <div
        style={{
          fontSize: 10,
          fontWeight: 700,
          letterSpacing: "0.15em",
          color: "rgba(148, 163, 184, 0.6)",
          marginBottom: 10,
        }}
      >
        MOBILE ENTRY PREVIEW
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(8, 1fr)",
          gap: 3,
          maxWidth: 120,
          opacity: 0.85,
        }}
      >
        {Array.from({ length: 40 }, (_, i) => (
          <div
            key={i}
            style={{
              aspectRatio: "1",
              borderRadius: 2,
              background:
                hashStub(i, seat.id) % 3 === 0 ? "#0f172a" : "#1e293b",
            }}
          />
        ))}
      </div>
      <div
        style={{
          marginTop: 12,
          fontSize: 11,
          fontFamily: "ui-monospace, monospace",
          color: "rgba(148, 163, 184, 0.75)",
          letterSpacing: "0.08em",
        }}
      >
        {seat.domId.toUpperCase().replace(/-/g, " · ")}
      </div>
    </div>
  );
}

function hashStub(i: number, id: string): number {
  return (i * 17 + id.length * 31) % 100;
}

function SuccessView({ seat }: { seat: StadiumSeat }) {
  return (
    <div style={{ textAlign: "center", padding: "12px 4px 8px" }}>
      <div
        style={{
          width: 64,
          height: 64,
          margin: "0 auto 16px",
          borderRadius: "50%",
          background:
            "linear-gradient(145deg, rgba(34, 197, 94, 0.25), rgba(16, 185, 129, 0.15))",
          border: "1px solid rgba(34, 197, 94, 0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 28,
        }}
      >
        ✓
      </div>
      <h2
        style={{
          margin: "0 0 8px",
          fontSize: 22,
          fontWeight: 800,
          color: "#f8fafc",
          letterSpacing: "-0.02em",
        }}
      >
        You&apos;re in!
      </h2>
      <p
        style={{
          margin: "0 0 20px",
          fontSize: 14,
          lineHeight: 1.5,
          color: "#94a3b8",
        }}
      >
        {seat.section} stand · Row {seat.row} · Seat {seat.number}
        <br />
        <span style={{ color: "#cbd5e1" }}>
          {CATEGORY_META[seat.category].label}
        </span>
      </p>
      <p
        style={{
          margin: 0,
          fontSize: 12,
          color: "rgba(148, 163, 184, 0.75)",
        }}
      >
        Confirmation sent · Add to Apple Wallet (demo)
      </p>
    </div>
  );
}
