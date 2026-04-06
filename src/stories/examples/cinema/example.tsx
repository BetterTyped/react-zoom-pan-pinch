import React, { useState, useRef } from "react";

import { TransformWrapper, TransformComponent } from "../../../components";
import { normalizeArgs, Controls } from "../../utils";
import {
  CinemaLayout,
  CATEGORY_STYLES,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  ROWS,
  OCCUPIED,
} from "./cinema-data";
import type { SeatInfo } from "./cinema-data";

type Api = {
  zoomToElement: (id: string, scale?: number) => void;
  resetTransform: () => void;
  zoomIn: () => void;
  zoomOut: () => void;
};

export const Example: React.FC<any> = (args: any) => {
  const [selectedSeat, setSelectedSeat] = useState<SeatInfo | null>(null);
  const apiRef = useRef<Api | null>(null);

  const handleSeatSelect = (seat: SeatInfo) => {
    setSelectedSeat(seat);
    apiRef.current?.zoomToElement(seat.id, 4);
  };

  const handleReset = () => {
    setSelectedSeat(null);
    apiRef.current?.resetTransform();
  };

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <TransformWrapper
        {...normalizeArgs(args)}
        initialScale={0.5}
        minScale={0.5}
        maxScale={8}
        limitToBounds
        centerZoomedOut
        centerOnInit
      >
        {(api) => {
          apiRef.current = api;
          return (
            <>
              <Controls {...api} extraButtons={selectedSeat ? [{ label: "Deselect", onClick: handleReset }] : []} />
              <SeatBadge seat={selectedSeat} />
              <TransformComponent
                wrapperStyle={{
                  width: "800px",
                  maxWidth: "100%",
                  height: "600px",
                  maxHeight: "70vh",
                  borderRadius: "12px",
                  background: "#060612",
                }}
                contentStyle={{
                  width: CANVAS_WIDTH,
                  height: CANVAS_HEIGHT,
                }}
              >
                <CinemaLayout
                  selectedSeat={selectedSeat?.id ?? null}
                  onSeatClick={handleSeatSelect}
                />
              </TransformComponent>
            </>
          );
        }}
      </TransformWrapper>

      <SeatMap
        selectedId={selectedSeat?.id ?? null}
        onSelect={handleSeatSelect}
        onReset={handleReset}
      />
    </div>
  );
};

function SeatMap({
  selectedId,
  onSelect,
  onReset,
}: {
  selectedId: string | null;
  onSelect: (seat: SeatInfo) => void;
  onReset: () => void;
}) {
  return (
    <div style={{ maxWidth: 800, marginTop: 20 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#888",
            letterSpacing: "1px",
            textTransform: "uppercase",
          }}
        >
          Select a seat
        </span>

        <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
          {(["standard", "premium", "vip"] as const).map((cat) => (
            <span
              key={cat}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 5,
                fontSize: 11,
                color: "#777",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 2,
                  background: CATEGORY_STYLES[cat].border,
                }}
              />
              {CATEGORY_STYLES[cat].label}
            </span>
          ))}
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 11,
              color: "#555",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: 2,
                background: "#374151",
                opacity: 0.4,
              }}
            />
            Taken
          </span>
        </div>
      </div>

      <div
        style={{
          background: "#0c0c1a",
          borderRadius: 10,
          padding: "16px 12px",
          display: "flex",
          flexDirection: "column",
          gap: 4,
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 120,
            height: 3,
            borderRadius: 2,
            background: "rgba(180, 200, 255, 0.25)",
            marginBottom: 10,
          }}
        />
        <span
          style={{
            fontSize: 9,
            color: "rgba(255,255,255,0.2)",
            letterSpacing: 4,
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          Screen
        </span>

        {ROWS.map((row) => (
          <div
            key={row.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <span
              style={{
                width: 16,
                fontSize: 10,
                fontWeight: 600,
                color: "rgba(255,255,255,0.2)",
                textAlign: "right",
                marginRight: 4,
                flexShrink: 0,
              }}
            >
              {row.label}
            </span>

            {Array.from({ length: row.count }, (_, i) => {
              const num = i + 1;
              const seatId = `seat-${row.label}-${num}`;
              const lookupId = `${row.label}-${num}`;
              const occupied = OCCUPIED.has(lookupId);
              const selected = selectedId === seatId;
              const cat = CATEGORY_STYLES[row.category];
              const [leftSection, centerSection] = row.sections;
              const isAisle = num === leftSection + 1 || num === leftSection + centerSection + 1;

              return (
                <button
                  key={seatId}
                  type="button"
                  title={
                    occupied
                      ? `${row.label}${num} — Taken`
                      : `${row.label}${num} — ${cat.label}`
                  }
                  onClick={() => {
                    if (!occupied) {
                      onSelect({
                        id: seatId,
                        row: row.label,
                        number: num,
                        category: row.category,
                      });
                    }
                  }}
                  style={{
                    width: 18,
                    height: 18,
                    padding: 0,
                    borderRadius: 3,
                    border: selected
                      ? "2px solid #34d399"
                      : "1px solid transparent",
                    background: occupied
                      ? "rgba(55, 65, 81, 0.3)"
                      : selected
                        ? "#059669"
                        : cat.border,
                    opacity: occupied ? 0.35 : 1,
                    cursor: occupied ? "default" : "pointer",
                    fontSize: 7,
                    fontWeight: 700,
                    color: occupied
                      ? "rgba(255,255,255,0.15)"
                      : "rgba(255,255,255,0.7)",
                    fontFamily: "inherit",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginLeft: isAisle ? 6 : 0,
                  }}
                >
                  {num}
                </button>
              );
            })}
          </div>
        ))}

        {selectedId && (
          <button
            type="button"
            onClick={onReset}
            style={{
              marginTop: 10,
              padding: "5px 16px",
              borderRadius: 6,
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.06)",
              color: "#aaa",
              fontSize: 11,
              fontWeight: 600,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            Reset view
          </button>
        )}
      </div>
    </div>
  );
}

function SeatBadge({ seat }: { seat: SeatInfo | null }) {
  if (!seat) return null;
  const cat = CATEGORY_STYLES[seat.category];

  return (
    <div
      style={{
        position: "absolute",
        top: 30,
        left: 300,
        zIndex: 10,
        padding: "6px 14px",
        borderRadius: 10,
        background: "rgba(10, 10, 18, 0.82)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: `1px solid ${cat.border}`,
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <span
        style={{
          width: 10,
          height: 10,
          borderRadius: 3,
          background: cat.bg,
          flexShrink: 0,
        }}
      />
      <span style={{ color: "#fff", fontSize: 12, fontWeight: 600, whiteSpace: "nowrap" }}>
        Row {seat.row} · Seat {seat.number}
      </span>
      <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 11, whiteSpace: "nowrap" }}>
        {cat.label} · {cat.price}
      </span>
    </div>
  );
}
