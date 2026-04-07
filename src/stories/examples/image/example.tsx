import React, { useState, useCallback } from "react";

import { TransformWrapper, TransformComponent } from "../../../components";
import { Controls, normalizeArgs, viewerChrome } from "../../utils";
import { useTransformComponent } from "../../../hooks";
import smallImg from "../../assets/small-image.jpg";
import mediumImg from "../../assets/medium-image.jpg";
import bigImg from "../../assets/big-image.jpeg";

const SIZES = [
  { key: "small", label: "Small", src: smallImg },
  { key: "medium", label: "Medium", src: mediumImg },
  { key: "big", label: "Big", src: bigImg },
] as const;

type SizeKey = (typeof SIZES)[number]["key"];

function DimensionsBadge() {
  return useTransformComponent(({ state }) => (
    <div
      style={{
        position: "absolute",
        bottom: 16,
        right: 16,
        zIndex: 10,
        padding: "5px 12px",
        borderRadius: 8,
        background: "rgba(10, 10, 18, 0.78)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "rgba(255,255,255,0.7)",
        fontSize: 11,
        fontWeight: 600,
        fontFamily: "system-ui, -apple-system, sans-serif",
        letterSpacing: "0.02em",
        userSelect: "none",
        pointerEvents: "none",
      }}
    >
      {state.scale.toFixed(2)}x
    </div>
  ));
}

export const Example: React.FC<any> = (args: any) => {
  const [activeSize, setActiveSize] = useState<SizeKey>("medium");

  const activeEntry = SIZES.find((s) => s.key === activeSize)!;

  const handleSizeChange = useCallback((key: SizeKey) => {
    setActiveSize(key);
  }, []);

  return (
    <div
      style={{
        fontFamily: "system-ui, -apple-system, sans-serif",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
        minHeight: 0,
        maxWidth: "100%",
        boxSizing: "border-box",
      }}
    >
      <TransformWrapper {...normalizeArgs(args)} key={activeSize} centerOnInit>
        {(utils) => (
          <div
            style={{
              flex: 1,
              minHeight: 0,
              width: "100%",
              position: "relative",
            }}
          >
            <Controls {...utils} position="top-center" />
            <DimensionsBadge />
            <TransformComponent
              wrapperStyle={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                ...viewerChrome,
              }}
            >
              <img
                src={activeEntry.src}
                alt={`${activeEntry.label} preview`}
                style={{ display: "block" }}
              />
            </TransformComponent>
          </div>
        )}
      </TransformWrapper>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          alignSelf: "center",
          gap: 2,
          marginTop: 12,
          flexShrink: 0,
          padding: 4,
          borderRadius: 12,
          background: "rgba(15, 15, 20, 0.72)",
          backdropFilter: "blur(16px) saturate(1.6)",
          WebkitBackdropFilter: "blur(16px) saturate(1.6)",
          border: "1px solid rgba(255,255,255,0.08)",
          boxShadow:
            "0 2px 8px rgba(0,0,0,0.3), 0 0 0 0.5px rgba(255,255,255,0.04) inset",
        }}
      >
        {SIZES.map((size) => {
          const isActive = activeSize === size.key;
          return (
            <button
              key={size.key}
              type="button"
              onClick={() => handleSizeChange(size.key)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: 32,
                padding: "0 16px",
                border: "none",
                borderRadius: 8,
                background: isActive ? "rgba(255,255,255,0.12)" : "transparent",
                color: isActive ? "#fff" : "rgba(255,255,255,0.5)",
                fontSize: 12,
                fontWeight: 600,
                letterSpacing: "0.02em",
                cursor: "pointer",
                fontFamily: "inherit",
                transition: "background 0.15s ease, color 0.15s ease",
              }}
            >
              {size.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
