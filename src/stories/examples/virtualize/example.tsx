/* eslint-disable react/no-array-index-key, no-nested-ternary */
import React, { useCallback, useState } from "react";

import {
  TransformWrapper,
  TransformComponent,
  Virtualize,
} from "../../../components";
import { useTransformComponent } from "../../../hooks";
import { Controls, normalizeArgs, viewerChrome } from "../../utils";

const COLS = 10;
const ROWS = 10;
const TILE_SIZE = 180;
const GAP = 20;
const TOTAL = COLS * ROWS;

const CANVAS_WIDTH = COLS * (TILE_SIZE + GAP) + GAP;
const CANVAS_HEIGHT = ROWS * (TILE_SIZE + GAP) + GAP;

const PALETTE = [
  "#667eea",
  "#764ba2",
  "#4facfe",
  "#00f2fe",
  "#43e97b",
  "#38f9d7",
  "#fa709a",
  "#fee140",
  "#a18cd1",
  "#fbc2eb",
  "#f093fb",
  "#f5576c",
  "#4481eb",
  "#04befe",
  "#fccb90",
  "#d57eeb",
];

function tileColor(index: number): string {
  return PALETTE[index % PALETTE.length];
}

function MountedCounter({
  mounted,
  total,
}: {
  mounted: number;
  total: number;
}) {
  const scale = useTransformComponent(({ state }) => state.scale);

  return (
    <div
      style={{
        position: "absolute",
        top: 12,
        right: 12,
        zIndex: 10,
        display: "flex",
        gap: 8,
        alignItems: "center",
        padding: "6px 14px",
        borderRadius: 8,
        background: "rgba(10, 10, 18, 0.82)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "rgba(255,255,255,0.75)",
        fontSize: 12,
        fontWeight: 600,
        fontFamily: "system-ui, -apple-system, sans-serif",
        letterSpacing: "0.02em",
        userSelect: "none",
        pointerEvents: "none",
      }}
    >
      <span>
        {mounted}/{total} mounted
      </span>
      <span style={{ opacity: 0.4 }}>|</span>
      <span>{scale.toFixed(2)}x</span>
    </div>
  );
}

export const Example: React.FC<any> = (args: any) => {
  const [mounted, setMounted] = useState(0);
  const [margin, setMargin] = useState(100);
  const [threshold, setThreshold] = useState(0);

  const handleShow = useCallback(() => setMounted((m) => m + 1), []);
  const handleHide = useCallback(() => setMounted((m) => m - 1), []);

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <TransformWrapper
        {...normalizeArgs(args)}
        limitToBounds={false}
        minScale={0.1}
        maxScale={4}
        centerOnInit
      >
        {(utils) => (
          <>
            <Controls
              {...utils}
              extraButtons={[
                {
                  label: `Margin: ${margin}px`,
                  onClick: () => setMargin((m) => (m === 0 ? 100 : 0)),
                  active: margin > 0,
                },
                {
                  label: `Threshold: ${threshold}`,
                  onClick: () =>
                    setThreshold((t) => (t === 0 ? 0.5 : t === 0.5 ? 1 : 0)),
                  active: threshold > 0,
                },
              ]}
            />

            <div style={{ position: "relative", display: "inline-block" }}>
              <TransformComponent
                wrapperStyle={{
                  ...viewerChrome,
                  width: "600px",
                  height: "500px",
                  maxWidth: "85vw",
                  maxHeight: "75vh",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: CANVAS_WIDTH,
                    height: CANVAS_HEIGHT,
                    backgroundImage:
                      "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                >
                  {Array.from({ length: TOTAL }).map((_, i) => {
                    const col = i % COLS;
                    const row = Math.floor(i / COLS);
                    const tileX = GAP + col * (TILE_SIZE + GAP);
                    const tileY = GAP + row * (TILE_SIZE + GAP);
                    const color = tileColor(i);

                    return (
                      <Virtualize
                        key={i}
                        x={tileX}
                        y={tileY}
                        width={TILE_SIZE}
                        height={TILE_SIZE}
                        margin={margin}
                        threshold={threshold}
                        onShow={handleShow}
                        onHide={handleHide}
                        placeholder={
                          <div
                            style={{
                              position: "absolute",
                              left: tileX,
                              top: tileY,
                              width: TILE_SIZE,
                              height: TILE_SIZE,
                              borderRadius: 12,
                              border: `1px dashed ${color}33`,
                            }}
                          />
                        }
                        style={{
                          position: "absolute",
                          left: tileX,
                          top: tileY,
                          width: TILE_SIZE,
                          height: TILE_SIZE,
                        }}
                      >
                        <div
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: 12,
                            background: `linear-gradient(135deg, ${color}22, ${color}08)`,
                            border: `1px solid ${color}44`,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 8,
                            transition:
                              "border-color 0.2s ease, box-shadow 0.2s ease",
                          }}
                        >
                          <div
                            style={{
                              width: 36,
                              height: 36,
                              borderRadius: 10,
                              background: `linear-gradient(135deg, ${color}, ${color}88)`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 14,
                              fontWeight: 800,
                              color: "#fff",
                              boxShadow: `0 0 16px ${color}33`,
                            }}
                          >
                            {i + 1}
                          </div>
                          <span
                            style={{
                              fontSize: 11,
                              fontWeight: 600,
                              color: "rgba(255,255,255,0.5)",
                              letterSpacing: "0.03em",
                            }}
                          >
                            Tile {i + 1}
                          </span>
                        </div>
                      </Virtualize>
                    );
                  })}
                </div>
              </TransformComponent>

              <MountedCounter mounted={mounted} total={TOTAL} />
            </div>
          </>
        )}
      </TransformWrapper>
    </div>
  );
};
