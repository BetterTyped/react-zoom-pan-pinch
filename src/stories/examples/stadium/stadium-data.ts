/** Top-down stadium: seats on arcs around an elliptical pitch. */

export const CANVAS_WIDTH = 3000;
export const CANVAS_HEIGHT = 2400;

export const CX = CANVAS_WIDTH / 2;
export const CY = CANVAS_HEIGHT / 2;

export const PITCH_RX = 440;
export const PITCH_RY = 290;

const ROW_GAP = 38;
const FIRST_ROW_OFFSET = 90;
const CONCOURSE_GAP = 30;

export const SEAT_SIZE = 26;
const SEAT_SPACING = SEAT_SIZE + 8;

export type SeatCategory = "club" | "standard" | "upper";

export interface StadiumSeat {
  id: string;
  domId: string;
  section: string;
  row: number;
  number: number;
  x: number;
  y: number;
  rotation: number;
  category: SeatCategory;
  price: number;
}

export const CATEGORY_META: Record<
  SeatCategory,
  { label: string; accent: string; border: string; glow: string }
> = {
  club: {
    label: "Club level",
    accent: "linear-gradient(145deg, #fbbf24, #d97706)",
    border: "#f59e0b",
    glow: "rgba(251, 191, 36, 0.45)",
  },
  standard: {
    label: "Standard",
    accent: "linear-gradient(145deg, #38bdf8, #0284c7)",
    border: "#0ea5e9",
    glow: "rgba(56, 189, 248, 0.35)",
  },
  upper: {
    label: "Upper tier",
    accent: "linear-gradient(145deg, #a78bfa, #7c3aed)",
    border: "#8b5cf6",
    glow: "rgba(167, 139, 250, 0.4)",
  },
};

export const SELECTED_ACCENT = "linear-gradient(145deg, #10b981, #059669)";
export const SELECTED_BORDER = "#34d399";
export const SELECTED_GLOW = "rgba(16, 185, 129, 0.8)";

export const OCCUPIED_ACCENT = "linear-gradient(145deg, #1f2937, #111827)";
export const OCCUPIED_BORDER = "#374151";

const PRICE: Record<SeatCategory, number> = {
  club: 189,
  standard: 94,
  upper: 52,
};

interface ArcStand {
  section: string;
  angle0: number;
  angle1: number;
}

const STANDS: ArcStand[] = [
  { section: "North", angle0: -Math.PI * 0.72, angle1: -Math.PI * 0.28 },
  { section: "East", angle0: -Math.PI * 0.20, angle1: Math.PI * 0.20 },
  { section: "South", angle0: Math.PI * 0.28, angle1: Math.PI * 0.72 },
  { section: "West", angle0: Math.PI * 0.80, angle1: Math.PI * 1.20 },
];

export const SECTION_LABELS: { section: string; x: number; y: number }[] =
  STANDS.map((s) => {
    const mid = (s.angle0 + s.angle1) / 2;
    const labelR = 180;
    return {
      section: s.section,
      x: CX + labelR * Math.cos(mid),
      y: CY + labelR * Math.sin(mid),
    };
  });

export const GATE_POSITIONS: { label: string; x: number; y: number }[] = [
  { label: "NE", x: CX + 520 * Math.cos(-Math.PI * 0.24), y: CY + 520 * Math.sin(-Math.PI * 0.24) },
  { label: "SE", x: CX + 520 * Math.cos(Math.PI * 0.24), y: CY + 520 * Math.sin(Math.PI * 0.24) },
  { label: "SW", x: CX + 520 * Math.cos(Math.PI * 0.76), y: CY + 520 * Math.sin(Math.PI * 0.76) },
  { label: "NW", x: CX + 520 * Math.cos(Math.PI * 1.24), y: CY + 520 * Math.sin(Math.PI * 1.24) },
];

const TOTAL_ROWS = 9;

function categoryForRow(rowIndex: number): SeatCategory {
  if (rowIndex < 3) return "club";
  if (rowIndex < 6) return "standard";
  return "upper";
}

function tierIndex(rowIndex: number): number {
  if (rowIndex < 3) return 0;
  if (rowIndex < 6) return 1;
  return 2;
}

function rowRadiusOffset(rowIndex: number): number {
  return FIRST_ROW_OFFSET + rowIndex * ROW_GAP + tierIndex(rowIndex) * CONCOURSE_GAP;
}

/** Concourse ring radii (between tiers) for SVG rendering. */
export const CONCOURSE_RINGS = [
  FIRST_ROW_OFFSET + 3 * ROW_GAP + CONCOURSE_GAP * 0.5,
  FIRST_ROW_OFFSET + 6 * ROW_GAP + CONCOURSE_GAP * 1.5,
];

function pitchRadiusAtAngle(ang: number): number {
  const c = Math.cos(ang);
  const s = Math.sin(ang);
  return (PITCH_RX * PITCH_RY) / Math.sqrt(
    (PITCH_RY * c) ** 2 + (PITCH_RX * s) ** 2,
  );
}

function hashSeatId(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i += 1)
    h = Math.imul(31, h) + str.charCodeAt(i);
  return Math.abs(h);
}

export function isOccupied(seatId: string): boolean {
  return hashSeatId(seatId) % 11 < 2;
}

function generateSeats(): StadiumSeat[] {
  const out: StadiumSeat[] = [];

  for (const stand of STANDS) {
    const { section, angle0, angle1 } = stand;
    const span = angle1 - angle0;

    for (let row = 0; row < TOTAL_ROWS; row += 1) {
      const category = categoryForRow(row);
      const price = PRICE[category];
      const rOffset = rowRadiusOffset(row);

      const midAng = (angle0 + angle1) / 2;
      const midR = pitchRadiusAtAngle(midAng) + rOffset;
      const arcLen = midR * Math.abs(span);
      const count = Math.max(6, Math.min(20, Math.floor(arcLen / SEAT_SPACING)));

      for (let s = 0; s < count; s += 1) {
        const t = (s + 0.5) / count;
        const ang = angle0 + t * span;

        const pitchR = pitchRadiusAtAngle(ang);
        const totalR = pitchR + rOffset;

        const px = totalR * Math.cos(ang);
        const py = totalR * Math.sin(ang);
        const x = CX + px - SEAT_SIZE / 2;
        const y = CY + py - SEAT_SIZE / 2;

        const faceDeg = (Math.atan2(py, px) * 180) / Math.PI + 180;
        const rotation = faceDeg - 90;

        const number = s + 1;
        const id = `${section}-R${row + 1}-S${number}`;
        const domId = `stadium-seat-${id.replace(/[^a-zA-Z0-9]+/g, "-")}`;

        out.push({
          id, domId, section,
          row: row + 1, number,
          x, y, rotation,
          category, price,
        });
      }
    }
  }

  return out;
}

export const ALL_SEATS: StadiumSeat[] = generateSeats();

export const SERVICE_FEE = 12;
export const FACILITY_FEE = 8;
