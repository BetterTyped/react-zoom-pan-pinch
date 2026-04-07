import React, { useEffect, useState } from "react";

import { TransformComponent, TransformWrapper } from "components";
import { Controls, normalizeArgs } from "../../utils";
import { viewerFrame } from "../../utils/viewer.styles";

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

/** Block A: compact list ↔ wide 3-column dashboard with different card heights */
function BlockA({ expanded }: { expanded: boolean }) {
  if (!expanded) {
    return (
      <div
        style={{
          padding: "14px 18px",
          borderRadius: 12,
          background: "rgba(255,255,255,0.03)",
          borderLeft: `3px solid ${BLOCKS[0].color}`,
          transition: "min-height 0.35s ease",
          minHeight: 72,
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: BLOCKS[0].color,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {BLOCKS[0].label} — compact
        </span>
        <p
          style={{
            margin: "8px 0 0",
            fontSize: 12,
            color: "rgba(255,255,255,0.5)",
            lineHeight: 1.5,
          }}
        >
          Single column. Low vertical footprint.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 12,
        background: "rgba(102, 126, 234, 0.06)",
        border: `1px solid ${BLOCKS[0].color}33`,
        transition: "min-height 0.35s ease",
        minHeight: 200,
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: BLOCKS[0].color,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: 12,
        }}
      >
        {BLOCKS[0].label} — grid layout
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 10,
          alignItems: "start",
        }}
      >
        <div
          style={{
            padding: 12,
            borderRadius: 8,
            background: "rgba(0,0,0,0.25)",
            minHeight: 100,
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              height: 40,
              borderRadius: 6,
              background: `linear-gradient(90deg, ${BLOCKS[0].color}44, transparent)`,
              marginBottom: 8,
            }}
          />
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>
            Tall card
          </div>
        </div>
        <div
          style={{
            padding: 12,
            borderRadius: 8,
            background: "rgba(0,0,0,0.25)",
            minHeight: 52,
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.45)" }}>
            Short
          </div>
        </div>
        <div
          style={{
            padding: 12,
            borderRadius: 8,
            background: "rgba(0,0,0,0.25)",
            minHeight: 140,
            border: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}
          >
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                style={{
                  height: 8,
                  borderRadius: 4,
                  background: "rgba(255,255,255,0.08)",
                  width: `${60 + n * 12}%`,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Block B: sidebar + main ↔ stacked hero + stat strip + two columns */
function BlockB({ expanded }: { expanded: boolean }) {
  if (!expanded) {
    return (
      <div
        style={{
          display: "flex",
          gap: 14,
          padding: 16,
          borderRadius: 12,
          background: "rgba(255,255,255,0.03)",
          borderLeft: `3px solid ${BLOCKS[1].color}`,
          minHeight: 120,
          transition: "all 0.35s ease",
        }}
      >
        <aside
          style={{
            width: 88,
            flexShrink: 0,
            borderRadius: 8,
            background: "rgba(240, 147, 251, 0.12)",
            border: "1px solid rgba(240, 147, 251, 0.25)",
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: BLOCKS[1].color,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            {BLOCKS[1].label} — sidebar
          </span>
          <p
            style={{
              margin: "8px 0 0",
              fontSize: 12,
              color: "rgba(255,255,255,0.5)",
              lineHeight: 1.55,
            }}
          >
            Horizontal split: narrow rail + fluid main. Pan/zoom should stay put
            when this flips to a tall stacked layout.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 12,
        background: "rgba(240, 147, 251, 0.07)",
        border: `1px solid ${BLOCKS[1].color}33`,
        minHeight: 320,
        transition: "all 0.35s ease",
      }}
    >
      <div
        style={{
          height: 72,
          borderRadius: 10,
          marginBottom: 12,
          background: `linear-gradient(135deg, ${BLOCKS[1].color}55, rgba(15,15,26,0.9))`,
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: "#fff",
            letterSpacing: "-0.02em",
          }}
        >
          {BLOCKS[1].label} — hero band
        </span>
      </div>
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 14,
        }}
      >
        {["24%", "1.2k", "98"].map((v, i) => (
          <div
            key={v}
            style={{
              flex: 1,
              padding: "10px 8px",
              borderRadius: 8,
              background: "rgba(0,0,0,0.28)",
              textAlign: "center",
              border: "1px solid rgba(255,255,255,0.06)",
            }}
          >
            <div
              style={{
                fontSize: 16,
                fontWeight: 800,
                color: BLOCKS[1].color,
              }}
            >
              {v}
            </div>
            <div
              style={{
                fontSize: 9,
                color: "rgba(255,255,255,0.35)",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
              }}
            >
              {["Load", "Views", "Score"][i]}
            </div>
          </div>
        ))}
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 10,
        }}
      >
        <div
          style={{
            padding: 12,
            borderRadius: 8,
            background: "rgba(0,0,0,0.22)",
            minHeight: 110,
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.35)",
              marginBottom: 8,
            }}
          >
            Left column
          </div>
          <div
            style={{
              height: 64,
              borderRadius: 6,
              background:
                "repeating-linear-gradient(-45deg, rgba(255,255,255,0.04), rgba(255,255,255,0.04) 4px, transparent 4px, transparent 8px)",
            }}
          />
        </div>
        <div
          style={{
            padding: 12,
            borderRadius: 8,
            background: "rgba(0,0,0,0.22)",
            minHeight: 110,
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            style={{
              fontSize: 10,
              color: "rgba(255,255,255,0.35)",
              marginBottom: 8,
            }}
          >
            Right column
          </div>
          {[40, 55, 35, 70].map((w) => (
            <div
              key={w}
              style={{
                height: 10,
                marginBottom: 6,
                borderRadius: 4,
                background: "rgba(255,255,255,0.07)",
                width: `${w}%`,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Block C: minimal ↔ long scrollable-style stack (gallery + list + footer) */
function BlockC({ expanded }: { expanded: boolean }) {
  if (!expanded) {
    return (
      <div
        style={{
          padding: "12px 16px",
          borderRadius: 12,
          background: "rgba(255,255,255,0.03)",
          borderLeft: `3px solid ${BLOCKS[2].color}`,
          minHeight: 56,
          transition: "all 0.35s ease",
        }}
      >
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: BLOCKS[2].color,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {BLOCKS[2].label} — minimal
        </span>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 12,
        background: "rgba(67, 233, 123, 0.06)",
        border: `1px solid ${BLOCKS[2].color}33`,
        minHeight: 380,
        transition: "all 0.35s ease",
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: BLOCKS[2].color,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          marginBottom: 12,
        }}
      >
        {BLOCKS[2].label} — expanded stack
      </div>
      <div
        style={{
          display: "flex",
          gap: 8,
          marginBottom: 14,
          overflow: "hidden",
        }}
      >
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              width: 56,
              height: 56,
              flexShrink: 0,
              borderRadius: 8,
              background: `linear-gradient(135deg, ${BLOCKS[2].color}${i % 2 ? "66" : "33"}, rgba(0,0,0,0.4))`,
              border: "1px solid rgba(255,255,255,0.08)",
            }}
          />
        ))}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          marginBottom: 14,
        }}
      >
        {["Item alpha", "Item beta", "Item gamma", "Item delta"].map(
          (label, i) => (
            <div
              key={label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                borderRadius: 8,
                background: "rgba(0,0,0,0.22)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 6,
                  background: `rgba(67, 233, 123, ${0.15 + i * 0.08})`,
                }}
              />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.75)",
                  }}
                >
                  {label}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: "rgba(255,255,255,0.35)",
                    marginTop: 2,
                  }}
                >
                  Extra rows push total content height way up — good stress for
                  layout reflow under zoom.
                </div>
              </div>
            </div>
          ),
        )}
      </div>
      <div
        style={{
          padding: "12px 14px",
          borderRadius: 8,
          background: "rgba(0,0,0,0.35)",
          borderTop: `2px solid ${BLOCKS[2].color}44`,
          fontSize: 11,
          color: "rgba(255,255,255,0.45)",
          lineHeight: 1.5,
        }}
      >
        Footer strip appears only in expanded mode, adding another vertical
        block. Together, A/B/C expansions reshape the canvas dramatically while
        the transform state should remain stable.
      </div>
    </div>
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

  const [a, b, c] = toggles;

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <TransformWrapper {...normalizeArgs(args)} centerOnInit>
        {(utils) => (
          <div style={{ position: "relative" }}>
            <Controls {...utils} position="bottom-left" />
            <TransformComponent
              wrapperStyle={{
                ...viewerFrame,
                background:
                  "linear-gradient(145deg, #0c1029 0%, #111827 40%, #0a0f1e 100%)",
                width: "500px",
                height: "500px",
                maxWidth: "80vw",
                maxHeight: "75vh",
              }}
              contentStyle={{
                width: "500px",
                minHeight: 500,
              }}
            >
              <div style={{ padding: 24 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    marginBottom: 20,
                    flexWrap: "wrap",
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
                    Layout reflow
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

                <p
                  style={{
                    margin: "0 0 20px",
                    fontSize: 12,
                    lineHeight: 1.55,
                    color: "rgba(255,255,255,0.45)",
                  }}
                >
                  Each block alternates between a <strong>compact</strong> and a{" "}
                  <strong>large</strong> layout: different grids, columns,
                  heights, and extra sections. This is a stronger test than text
                  swaps alone — pan and zoom should stay stable.
                </p>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 14,
                  }}
                >
                  <BlockA expanded={a} />
                  <BlockB expanded={b} />
                  <BlockC expanded={c} />
                </div>
              </div>
            </TransformComponent>
          </div>
        )}
      </TransformWrapper>
    </div>
  );
};
