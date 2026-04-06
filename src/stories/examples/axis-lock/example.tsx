import React, { useMemo, useState } from "react";

import { TransformWrapper, TransformComponent } from "../../../components";
import {
  Controls,
  normalizeArgs,
  viewerChrome,
  FreeMovementIcon,
  LockVerticalIcon,
  LockHorizontalIcon,
} from "../../utils";

type AxisMode = "free" | "vertical" | "horizontal";

const viewer: React.CSSProperties = {
  ...viewerChrome,
  width: "560px",
  height: "440px",
  maxWidth: "90vw",
  maxHeight: "78vh",
};

const font = "system-ui, -apple-system, sans-serif";

function GridCanvas() {
  const cells = useMemo(() => {
    const out: { key: string; row: number; col: number }[] = [];
    for (let row = 0; row < 6; row += 1) {
      for (let col = 0; col < 8; col += 1) {
        out.push({ key: `${row}-${col}`, row, col });
      }
    }
    return out;
  }, []);

  return (
    <div
      style={{
        width: 1400,
        height: 900,
        display: "grid",
        gridTemplateColumns: "repeat(8, 1fr)",
        gridTemplateRows: "repeat(6, 1fr)",
        gap: 3,
        padding: 24,
        boxSizing: "border-box",
        background:
          "linear-gradient(145deg, #12122a 0%, #0d1528 40%, #0a1020 100%)",
      }}
    >
      {cells.map(({ key, row, col }) => (
        <div
          key={key}
          style={{
            borderRadius: 10,
            background: `rgba(${40 + col * 18}, ${60 + row * 12}, ${120 + (row + col) * 8}, 0.35)`,
            border: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: font,
            fontSize: 13,
            fontWeight: 600,
            color: "rgba(255,255,255,0.45)",
          }}
        >
          {col + 1},{row + 1}
        </div>
      ))}
    </div>
  );
}

function axisButtons(
  mode: AxisMode,
  setMode: (m: AxisMode) => void,
) {
  const btn = (
    id: AxisMode,
    label: string,
    Icon: React.FC,
  ) => ({
    label,
    icon: <Icon />,
    onClick: () => setMode(mode === id ? "free" : id),
    active: mode === id,
    "data-tooltip": label,
  });

  return [
    btn("free", "Free pan", FreeMovementIcon),
    btn("vertical", "Vertical only", LockVerticalIcon),
    btn("horizontal", "Horizontal only", LockHorizontalIcon),
  ];
}

export const Example: React.FC<Record<string, unknown>> = (args) => {
  const normalized = normalizeArgs(args);
  const [mode, setMode] = useState<AxisMode>("free");

  const panning = {
    ...normalized.panning,
    lockAxisX: mode === "vertical",
    lockAxisY: mode === "horizontal",
  };

  return (
    <div style={{ fontFamily: font }}>
      <TransformWrapper {...normalized} centerOnInit panning={panning}>
        {(utils) => (
          <div style={{ position: "relative", display: "inline-block" }}>
            <Controls
              {...utils}
              extraButtons={axisButtons(mode, setMode)}
            />
            <TransformComponent
              wrapperStyle={viewer}
              contentStyle={{ width: 1400, height: 900 }}
            >
              <GridCanvas />
            </TransformComponent>
          </div>
        )}
      </TransformWrapper>
    </div>
  );
};
