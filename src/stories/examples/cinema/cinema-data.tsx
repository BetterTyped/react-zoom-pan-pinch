import React from "react";

export const CANVAS_WIDTH = 1400;
export const CANVAS_HEIGHT = 950;

const CX = CANVAS_WIDTH / 2;
const SEAT_SIZE = 30;
const SEAT_GAP = 6;
const AISLE_GAP = 24;

type Category = "premium" | "standard" | "vip";

interface RowDef {
  label: string;
  count: number;
  y: number;
  category: Category;
  curve: number;
  sections: [number, number, number];
}

export const ROWS: RowDef[] = [
  { label: "A", count: 10, y: 220, category: "premium", curve: 12, sections: [2, 6, 2] },
  { label: "B", count: 14, y: 268, category: "premium", curve: 10, sections: [3, 8, 3] },
  { label: "C", count: 16, y: 316, category: "standard", curve: 9, sections: [4, 8, 4] },
  { label: "D", count: 18, y: 364, category: "standard", curve: 8, sections: [4, 10, 4] },
  { label: "E", count: 20, y: 412, category: "standard", curve: 7, sections: [5, 10, 5] },
  { label: "F", count: 22, y: 460, category: "standard", curve: 6, sections: [5, 12, 5] },
  { label: "G", count: 22, y: 510, category: "standard", curve: 5, sections: [5, 12, 5] },
  { label: "H", count: 24, y: 568, category: "vip", curve: 4, sections: [6, 12, 6] },
  { label: "I", count: 24, y: 616, category: "vip", curve: 3.5, sections: [6, 12, 6] },
  { label: "J", count: 22, y: 674, category: "standard", curve: 3, sections: [5, 12, 5] },
  { label: "K", count: 20, y: 722, category: "standard", curve: 2.5, sections: [5, 10, 5] },
];

export const CATEGORY_STYLES: Record<
  Category,
  { bg: string; border: string; glow: string; label: string; price: string }
> = {
  premium: {
    bg: "linear-gradient(145deg, #7c3aed, #6d28d9)",
    border: "#8b5cf6",
    glow: "rgba(139, 92, 246, 0.6)",
    label: "Premium",
    price: "$25",
  },
  standard: {
    bg: "linear-gradient(145deg, #2563eb, #1d4ed8)",
    border: "#3b82f6",
    glow: "rgba(59, 130, 246, 0.4)",
    label: "Standard",
    price: "$15",
  },
  vip: {
    bg: "linear-gradient(145deg, #d97706, #b45309)",
    border: "#f59e0b",
    glow: "rgba(245, 158, 11, 0.6)",
    label: "VIP",
    price: "$40",
  },
};

const SELECTED_STYLE = {
  bg: "linear-gradient(145deg, #10b981, #059669)",
  border: "#34d399",
  glow: "rgba(16, 185, 129, 0.8)",
};

const OCCUPIED_STYLE = {
  bg: "linear-gradient(145deg, #1f2937, #111827)",
  border: "#374151",
  glow: "none",
};

export const OCCUPIED = new Set([
  "A-3",
  "A-7",
  "B-2",
  "B-5",
  "B-9",
  "B-12",
  "C-1",
  "C-6",
  "C-11",
  "C-15",
  "D-3",
  "D-8",
  "D-14",
  "E-2",
  "E-7",
  "E-12",
  "E-18",
  "F-4",
  "F-10",
  "F-15",
  "F-20",
  "G-1",
  "G-6",
  "G-13",
  "G-17",
  "G-22",
  "H-3",
  "H-9",
  "H-15",
  "H-19",
  "H-23",
  "I-2",
  "I-7",
  "I-12",
  "I-18",
  "I-24",
  "J-4",
  "J-11",
  "J-16",
  "J-20",
  "K-3",
  "K-8",
  "K-13",
  "K-18",
]);

export interface SeatInfo {
  id: string;
  row: string;
  number: number;
  category: Category;
}

interface CinemaLayoutProps {
  selectedSeat: string | null;
  onSeatClick: (seat: SeatInfo) => void;
}

function computeRowPositions(
  row: RowDef,
): { x: number; y: number; seatNum: number }[] {
  const [left, center, right] = row.sections;
  const step = SEAT_SIZE + SEAT_GAP;
  const totalWidth = row.count * step - SEAT_GAP + 2 * AISLE_GAP;
  const startX = CX - totalWidth / 2;

  const positions: { x: number; y: number; seatNum: number }[] = [];
  let cx = startX;
  let num = 1;

  for (let i = 0; i < left; i++, num++) {
    positions.push({ x: cx, y: row.y, seatNum: num });
    cx += step;
  }
  cx += AISLE_GAP;

  for (let i = 0; i < center; i++, num++) {
    positions.push({ x: cx, y: row.y, seatNum: num });
    cx += step;
  }
  cx += AISLE_GAP;

  for (let i = 0; i < right; i++, num++) {
    positions.push({ x: cx, y: row.y, seatNum: num });
    cx += step;
  }

  const halfWidth = totalWidth / 2;
  return positions.map((p) => {
    const norm = (p.x + SEAT_SIZE / 2 - CX) / (halfWidth || 1);
    return { ...p, y: p.y + row.curve * norm * norm };
  });
}

export function CinemaLayout({ selectedSeat, onSeatClick }: CinemaLayoutProps) {
  return (
    <div
      style={{
        position: "relative",
        width: CANVAS_WIDTH,
        height: CANVAS_HEIGHT,
        background:
          "radial-gradient(ellipse at 50% 8%, #1a1033 0%, #0c0a1a 50%, #060612 100%)",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      <Screen />

      {ROWS.map((row) => (
        <span
          key={`lbl-${row.label}`}
          style={{
            position: "absolute",
            left: 55,
            top: row.y + SEAT_SIZE / 2,
            transform: "translateY(-50%)",
            color: "rgba(255,255,255,0.2)",
            fontSize: 13,
            fontWeight: 600,
            letterSpacing: "1px",
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          {row.label}
        </span>
      ))}

      {ROWS.map((row) => {
        const positions = computeRowPositions(row);
        return positions.map((pos) => {
          const seatId = `seat-${row.label}-${pos.seatNum}`;
          const lookupId = `${row.label}-${pos.seatNum}`;
          const occupied = OCCUPIED.has(lookupId);
          const selected = selectedSeat === seatId;

          return (
            <SeatEl
              key={seatId}
              id={seatId}
              x={pos.x}
              y={pos.y}
              seatNum={pos.seatNum}
              category={row.category}
              occupied={occupied}
              selected={selected}
              onClick={() => {
                if (!occupied) {
                  onSeatClick({
                    id: seatId,
                    row: row.label,
                    number: pos.seatNum,
                    category: row.category,
                  });
                }
              }}
            />
          );
        });
      })}

      <Legend />

      <ExitSign x={80} y={440} />
      <ExitSign x={CANVAS_WIDTH - 120} y={440} />

      <span
        style={{
          position: "absolute",
          bottom: 35,
          left: "50%",
          transform: "translateX(-50%)",
          color: "rgba(255,255,255,0.1)",
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "8px",
          textTransform: "uppercase",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        Grand Cinema Hall
      </span>
    </div>
  );
}

function Screen() {
  return (
    <div
      style={{
        position: "absolute",
        top: 55,
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      <svg
        width="660"
        height="65"
        viewBox="0 0 660 65"
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient id="scr-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d0ddff" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#5a7cba" stopOpacity="0.3" />
          </linearGradient>
        </defs>
        <path
          d="M 30 52 Q 330 2 630 52"
          fill="none"
          stroke="url(#scr-g)"
          strokeWidth="5"
          strokeLinecap="round"
        />
      </svg>

      <span
        style={{
          position: "absolute",
          bottom: -22,
          left: "50%",
          transform: "translateX(-50%)",
          color: "rgba(255,255,255,0.25)",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "10px",
          textTransform: "uppercase",
          userSelect: "none",
          pointerEvents: "none",
        }}
      >
        Screen
      </span>
    </div>
  );
}

function SeatEl({
  id,
  x,
  y,
  seatNum,
  category,
  occupied,
  selected,
  onClick,
}: {
  id: string;
  x: number;
  y: number;
  seatNum: number;
  category: Category;
  occupied: boolean;
  selected: boolean;
  onClick: () => void;
}) {
  const sty = selected
    ? SELECTED_STYLE
    : occupied
      ? OCCUPIED_STYLE
      : CATEGORY_STYLES[category];

  return (
    <div
      id={id}
      onClick={onClick}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: SEAT_SIZE,
        height: SEAT_SIZE,
        borderRadius: "8px 8px 4px 4px",
        background: sty.bg,
        border: `1.5px solid ${sty.border}`,
        cursor: occupied ? "default" : "pointer",
        boxShadow: selected
          ? `0 0 18px ${sty.glow}, 0 0 6px ${sty.glow}`
          : undefined,
        opacity: occupied ? 0.35 : 1,
        zIndex: selected ? 5 : 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <span
        style={{
          color: occupied
            ? "rgba(255,255,255,0.2)"
            : "rgba(255,255,255,0.65)",
          fontSize: 9,
          fontWeight: 700,
          userSelect: "none",
          pointerEvents: "none",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {seatNum}
      </span>
    </div>
  );
}

function Legend() {
  const items: { cat?: Category; label: string; occupied?: boolean }[] = [
    { cat: "standard", label: `Standard — $15` },
    { cat: "premium", label: `Premium — $25` },
    { cat: "vip", label: `VIP — $40` },
    { label: "Occupied", occupied: true },
  ];

  return (
    <div
      style={{
        position: "absolute",
        top: 28,
        right: 36,
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      {items.map((item) => {
        const sty = item.occupied
          ? OCCUPIED_STYLE
          : CATEGORY_STYLES[item.cat!];
        return (
          <div
            key={item.label}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: 4,
                background: sty.bg,
                border: `1px solid ${sty.border}`,
                opacity: item.occupied ? 0.35 : 1,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                color: item.occupied
                  ? "rgba(255,255,255,0.3)"
                  : "rgba(255,255,255,0.5)",
                fontSize: 11,
                fontWeight: 500,
                whiteSpace: "nowrap",
                userSelect: "none",
              }}
            >
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function ExitSign({ x, y }: { x: number; y: number }) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        display: "flex",
        alignItems: "center",
        gap: 4,
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: 3,
          background: "rgba(16, 185, 129, 0.15)",
          border: "1px solid rgba(16, 185, 129, 0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            color: "rgba(16, 185, 129, 0.6)",
            fontSize: 8,
            fontWeight: 800,
            letterSpacing: "0.5px",
          }}
        >
          ➜
        </span>
      </div>
      <span
        style={{
          color: "rgba(16, 185, 129, 0.35)",
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: "2px",
          textTransform: "uppercase",
        }}
      >
        Exit
      </span>
    </div>
  );
}
