import React from "react";

import { MiniMap, TransformComponent, TransformWrapper } from "components";
import { Controls, normalizeArgs, viewerChrome } from "stories/utils";

const storyMiniMapPreviewStyle: React.CSSProperties = {
  borderRadius: 4,
  border: "2px solid rgba(147, 197, 253, 0.95)",
  boxShadow: [
    "0 0 0 1px rgba(255,255,255,0.22) inset",
    "0 0 14px rgba(125,211,252,0.45)",
    "0 0 28px rgba(56,189,248,0.22)",
    "rgba(6,10,20,0.82) 0 0 0 10000000px",
  ].join(", "),
};

const Content = () => (
  <div style={{ padding: 32 }}>
    <h2
      style={{
        margin: "0 0 16px",
        fontSize: 18,
        fontWeight: 700,
        color: "rgba(255,255,255,0.9)",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
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
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: ["#667eea", "#43e97b", "#f093fb"][i - 1],
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          Section {i}
        </span>
        <p
          style={{
            margin: "8px 0 0",
            fontSize: 13,
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.5)",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris.
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
                top: 25,
                right: 25,
                borderRadius: 6,
                overflow: "hidden",
                background:
                  "linear-gradient(145deg, rgba(15, 23, 42, 0.92), rgba(10, 10, 24, 0.95))",
                backdropFilter: "blur(14px) saturate(1.4)",
                WebkitBackdropFilter: "blur(14px) saturate(1.4)",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow:
                  "0 4px 24px rgba(0,0,0,0.45), 0 0 0 0.5px rgba(255,255,255,0.06) inset",
              }}
            >
              <MiniMap
                width={168}
                height={126}
                previewStyle={storyMiniMapPreviewStyle}
                borderColor="rgba(147, 197, 253, 0.95)"
              >
                <Content />
              </MiniMap>
            </div>
            <Controls {...utils} />
            <TransformComponent wrapperStyle={viewerChrome}>
              <Content />
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
};
