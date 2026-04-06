import React from "react";

import { MiniMap, TransformComponent, TransformWrapper } from "components";
import { Controls, normalizeArgs } from "stories/utils";

const Content = () => (
  <div style={{ padding: 32 }}>
    <h2 style={{ margin: "0 0 16px", fontSize: 18, fontWeight: 700, color: "rgba(255,255,255,0.9)", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      Scrollable Document
    </h2>
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        style={{
          marginBottom: 16,
          padding: "16px 20px",
          borderRadius: 10,
          background: "rgba(255,255,255,0.03)",
          borderLeft: `3px solid ${["#667eea", "#43e97b", "#f093fb"][i - 1]}`,
        }}
      >
        <span style={{ fontSize: 12, fontWeight: 700, color: ["#667eea", "#43e97b", "#f093fb"][i - 1], fontFamily: "system-ui, -apple-system, sans-serif" }}>
          Section {i}
        </span>
        <p style={{ margin: "8px 0 0", fontSize: 13, lineHeight: 1.6, color: "rgba(255,255,255,0.5)", fontFamily: "system-ui, -apple-system, sans-serif" }}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
          ad minim veniam, quis nostrud exercitation ullamco laboris.
        </p>
      </div>
    ))}
  </div>
);

export const Template = (args: any) => {
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <TransformWrapper
        {...normalizeArgs(args)}
        wrapperStyle={{
          width: "500px",
          height: "500px",
          maxWidth: "80vw",
          maxHeight: "75vh",
        }}
        contentStyle={{
          width: "500px",
          height: "500px",
        }}
      >
        {(utils) => (
          <>
            <div
              style={{
                position: "absolute",
                zIndex: 5,
                top: 16,
                right: 16,
                borderRadius: 10,
                overflow: "hidden",
                background: "rgba(10, 10, 18, 0.82)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
              }}
            >
              <MiniMap width={160} height={120}>
                <Content />
              </MiniMap>
            </div>
            <Controls {...utils} />
            <TransformComponent
              wrapperStyle={{
                borderRadius: "12px",
                border: "2px solid rgba(255,255,255,0.08)",
                boxShadow:
                  "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255,255,255,0.03)",
                background: "#0c0c1d",
              }}
            >
              <Content />
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
};
