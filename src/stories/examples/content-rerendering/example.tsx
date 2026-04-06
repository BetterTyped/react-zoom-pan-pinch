import React, { useEffect, useState } from "react";

import { TransformComponent, TransformWrapper } from "components";
import { Controls, normalizeArgs } from "../../utils";

const BLOCKS = [
  { interval: 1000, label: "Block A", color: "#667eea", desc: "1 s cycle" },
  { interval: 3000, label: "Block B", color: "#f093fb", desc: "3 s cycle" },
  { interval: 12000, label: "Block C", color: "#43e97b", desc: "12 s cycle" },
];

function StatusDot({ active, color }: { active: boolean; color: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: active ? color : "rgba(255,255,255,0.15)",
        boxShadow: active ? `0 0 8px ${color}88` : "none",
        transition: "all 0.3s ease",
      }}
    />
  );
}

export const Example: React.FC<any> = (args: any) => {
  const [toggles, setToggles] = useState([false, false, false]);

  useEffect(() => {
    const timers = BLOCKS.map((block, i) =>
      setInterval(() => {
        setToggles((prev) => {
          const next = [...prev];
          next[i] = !next[i];
          return next;
        });
      }, block.interval),
    );
    return () => timers.forEach(clearInterval);
  }, []);

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <TransformWrapper {...normalizeArgs(args)} centerOnInit>
        {(utils) => (
          <>
            <Controls {...utils} />
            <TransformComponent
              wrapperStyle={{
                width: "500px",
                height: "500px",
                maxWidth: "80vw",
                maxHeight: "75vh",
                borderRadius: "12px",
                border: "2px solid rgba(255,255,255,0.08)",
                boxShadow:
                  "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255,0.03)",
                background: "#0c0c1d",
              }}
              contentStyle={{
                width: "500px",
                minHeight: "500px",
              }}
            >
              <div style={{ padding: 32 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    marginBottom: 24,
                  }}
                >
                  <h2
                    style={{
                      margin: 0,
                      fontSize: 18,
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.9)",
                    }}
                  >
                    Live Updates
                  </h2>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    {BLOCKS.map((block, i) => (
                      <div
                        key={block.label}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                        }}
                      >
                        <StatusDot active={toggles[i]} color={block.color} />
                        <span
                          style={{
                            fontSize: 10,
                            color: "rgba(255,255,255,0.4)",
                            fontWeight: 600,
                            letterSpacing: "0.04em",
                          }}
                        >
                          {block.desc}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {BLOCKS.map((block, i) => (
                  <div
                    key={block.label}
                    style={{
                      marginBottom: 16,
                      padding: "16px 20px",
                      borderRadius: 10,
                      background: "rgba(255,255,255,0.03)",
                      borderLeft: `3px solid ${block.color}`,
                      transition: "all 0.3s ease",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: 8,
                      }}
                    >
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: block.color,
                          letterSpacing: "0.02em",
                        }}
                      >
                        {block.label}
                      </span>
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 600,
                          color: "rgba(255,255,255,0.3)",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {toggles[i] ? "State B" : "State A"}
                      </span>
                    </div>
                    <p
                      style={{
                        margin: 0,
                        fontSize: 13,
                        lineHeight: 1.6,
                        color: "rgba(255,255,255,0.6)",
                      }}
                    >
                      {toggles[i]
                        ? `Updated content for ${block.label}. This block cycles every ${block.interval / 1000}s to demonstrate that react-zoom-pan-pinch handles frequent re-renders without disrupting the current zoom/pan state.`
                        : `Original content for ${block.label}. The transform position and scale remain stable even as child components re-render on their own schedule.`}
                    </p>
                  </div>
                ))}
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
};
