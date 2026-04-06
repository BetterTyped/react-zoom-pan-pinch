import React, { useState } from "react";

import { TransformWrapper, TransformComponent } from "../../../components";
import { normalizeArgs } from "../../utils";
import {
  CinemaLayout,
  CATEGORY_STYLES,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
} from "./cinema-data";
import type { SeatInfo } from "./cinema-data";

export const Example: React.FC<any> = (args: any) => {
  const [selectedSeat, setSelectedSeat] = useState<SeatInfo | null>(null);

  return (
    <TransformWrapper
      {...normalizeArgs(args)}
      initialScale={0.5}
      minScale={0.5}
      maxScale={8}
      limitToBounds
      centerZoomedOut
      centerOnInit
    >
      {({ zoomToElement, resetTransform, zoomIn, zoomOut }) => (
        <>
          <ControlBar
            seat={selectedSeat}
            onZoomIn={() => zoomIn()}
            onZoomOut={() => zoomOut()}
            onReset={() => {
              resetTransform();
              setSelectedSeat(null);
            }}
          />

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
              onSeatClick={(seat) => {
                setSelectedSeat(seat);
                zoomToElement(seat.id, 4);
              }}
            />
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  );
};

function ControlBar({
  seat,
  onZoomIn,
  onZoomOut,
  onReset,
}: {
  seat: SeatInfo | null;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}) {
  const catStyle = seat ? CATEGORY_STYLES[seat.category] : null;

  return (
    <div
      style={{
        position: "absolute",
        top: "25px",
        left: "25px",
        zIndex: 10,
        display: "flex",
        alignItems: "center",
        gap: 6,
        flexWrap: "wrap",
      }}
    >
      <ControlBtn label="+" onClick={onZoomIn} />
      <ControlBtn label="−" onClick={onZoomOut} />
      <ControlBtn label="Reset" onClick={onReset} />

      {seat && catStyle && (
        <div
          style={{
            marginLeft: 8,
            padding: "6px 14px",
            borderRadius: 8,
            background: "rgba(0,0,0,0.85)",
            border: `1px solid ${catStyle.border}`,
            display: "flex",
            alignItems: "center",
            gap: 10,
            animation: "fadeIn 0.3s ease",
          }}
        >
          <span
            style={{
              width: 10,
              height: 10,
              borderRadius: 3,
              background: catStyle.bg,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              color: "#fff",
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "system-ui, sans-serif",
              whiteSpace: "nowrap",
            }}
          >
            Row {seat.row} · Seat {seat.number}
          </span>
          <span
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 11,
              fontFamily: "system-ui, sans-serif",
              whiteSpace: "nowrap",
            }}
          >
            {catStyle.label} · {catStyle.price}
          </span>
        </div>
      )}
    </div>
  );
}

function ControlBtn({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "5px 12px",
        background: "rgba(255,255,255,0.12)",
        border: "1px solid rgba(255,255,255,0.18)",
        borderRadius: 6,
        color: "#fff",
        fontSize: 12,
        fontWeight: 600,
        cursor: "pointer",
        fontFamily: "system-ui, sans-serif",
        transition: "background 0.15s",
      }}
    >
      {label}
    </button>
  );
}
