import React from "react";

import { TransformComponent, TransformWrapper, KeepScale } from "components";
import { Controls, normalizeArgs, viewerChrome } from "../../utils";
import exampleImg from "../../assets/map.jpg";

const MARKERS = [
  { label: "HQ", color: "#667eea", x: -200, y: 0 },
  { label: "Depot", color: "#f093fb", x: 200, y: 0 },
  { label: "Port", color: "#43e97b", x: 0, y: -100 },
  { label: "Base", color: "#fa709a", x: 0, y: 100 },
];

function Marker({ color, label }: { color: string; label: string }) {
  return (
    <KeepScale>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3,
          cursor: "default",
          userSelect: "none",
        }}
      >
        <div
          style={{
            width: 24,
            height: 24,
            borderRadius: "50%",
            background: `linear-gradient(135deg, ${color}, ${color}88)`,
            boxShadow: `0 0 12px ${color}66, 0 2px 6px rgba(0,0,0,0.4)`,
            border: "2px solid rgba(255,255,255,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#fff",
            }}
          />
        </div>
        <span
          style={{
            fontSize: 9,
            fontWeight: 700,
            color: "#fff",
            textShadow: "0 1px 4px rgba(0,0,0,0.8)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          {label}
        </span>
      </div>
    </KeepScale>
  );
}

export const Example: React.FC<any> = (args: any) => {
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <TransformWrapper {...normalizeArgs(args)} maxScale={100}>
        {(utils) => (
          <>
            <Controls {...utils} />
            <TransformComponent
              wrapperStyle={{
                ...viewerChrome,
                width: "500px",
                height: "400px",
                maxWidth: "80vw",
                maxHeight: "75vh",
              }}
            >
              <div style={{ position: "relative" }}>
                <img
                  style={{ width: "600px", height: "300px", display: "block" }}
                  src={exampleImg}
                  alt=""
                />
                {MARKERS.map((m) => (
                  <div
                    key={m.label}
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      zIndex: 2,
                      marginLeft: m.x,
                      marginTop: m.y,
                    }}
                  >
                    <Marker color={m.color} label={m.label} />
                  </div>
                ))}
              </div>
            </TransformComponent>
          </>
        )}
      </TransformWrapper>

      <div
        style={{
          display: "flex",
          gap: 16,
          marginTop: 14,
          flexWrap: "wrap",
        }}
      >
        {MARKERS.map((m) => (
          <div
            key={m.label}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11,
              color: "rgba(255,255,255,0.5)",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: m.color,
                flexShrink: 0,
              }}
            />
            {m.label}
          </div>
        ))}
      </div>
    </div>
  );
};
