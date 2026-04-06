import React from "react";

import { TransformComponent, TransformWrapper } from "components";
import { Controls, NumberedTargetIcon, normalizeArgs, viewerChrome } from "../../utils";
import { useTransformComponent } from "../../../hooks";

function ScaleBadge() {
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

const TARGETS = [
  {
    id: "element1",
    label: "Alpha",
    color: "#667eea",
    gradient: "linear-gradient(135deg, #667eea, #764ba2)",
    icon: "A",
    desc: "Primary target zone",
    top: 60,
    left: 40,
    width: 200,
    height: 160,
  },
  {
    id: "element2",
    label: "Beta",
    color: "#4facfe",
    gradient: "linear-gradient(135deg, #4facfe, #00f2fe)",
    icon: "B",
    desc: "Secondary observation point",
    top: 280,
    left: 240,
    width: 220,
    height: 140,
  },
  {
    id: "element3",
    label: "Gamma",
    color: "#43e97b",
    gradient: "linear-gradient(180deg, #43e97b, #38f9d7)",
    icon: "G",
    desc: "Tall narrow tower — great for testing vertical zoom-to-element framing.",
    top: 48,
    left: 658,
    width: 96,
    height: 480,
  },
];

export const Example: React.FC<any> = (args: any) => {
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <TransformWrapper {...normalizeArgs(args)}>
        {(utils) => (
          <>
            <Controls
              {...utils}
              extraButtons={TARGETS.map((t, i) => ({
                label: `Focus ${t.label}`,
                icon: <NumberedTargetIcon n={i + 1} />,
                onClick: () => utils.zoomToElement(t.id),
              }))}
            />
            <div style={{ position: "relative", display: "inline-block" }}>
              <TransformComponent
                wrapperStyle={{
                  ...viewerChrome,
                  width: "500px",
                  height: "500px",
                  maxWidth: "80vw",
                  maxHeight: "75vh",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: 800,
                    height: 600,
                    backgroundImage:
                      "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                >
                  {TARGETS.map((target) => {
                    const narrow = target.width < 140;
                    return (
                      <div
                        key={target.id}
                        id={target.id}
                        style={{
                          position: "absolute",
                          top: target.top,
                          left: target.left,
                          width: target.width,
                          height: target.height,
                          borderRadius: 14,
                          background: "rgba(255,255,255,0.03)",
                          border: `1px solid ${target.color}33`,
                          backdropFilter: "blur(8px)",
                          WebkitBackdropFilter: "blur(8px)",
                          padding: narrow ? 14 : 20,
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          cursor: "pointer",
                          transition:
                            "border-color 0.2s ease, box-shadow 0.2s ease",
                        }}
                        onClick={() => utils.zoomToElement(target.id)}
                      >
                        <div
                          style={{
                            display: "flex",
                            flexDirection: narrow ? "column" : "row",
                            alignItems: narrow ? "flex-start" : "center",
                            gap: narrow ? 8 : 10,
                          }}
                        >
                          <div
                            style={{
                              width: narrow ? 28 : 32,
                              height: narrow ? 28 : 32,
                              borderRadius: 8,
                              background: target.gradient,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: narrow ? 12 : 14,
                              fontWeight: 800,
                              color: "#fff",
                              boxShadow: `0 0 16px ${target.color}44`,
                              flexShrink: 0,
                            }}
                          >
                            {target.icon}
                          </div>
                          <span
                            style={{
                              fontSize: narrow ? 12 : 14,
                              fontWeight: 700,
                              color: "rgba(255,255,255,0.85)",
                              lineHeight: 1.2,
                            }}
                          >
                            {target.label}
                          </span>
                        </div>
                        <p
                          style={{
                            margin: 0,
                            fontSize: narrow ? 10 : 11,
                            color: "rgba(255,255,255,0.4)",
                            lineHeight: 1.45,
                          }}
                        >
                          {target.desc}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </TransformComponent>
              <ScaleBadge />
            </div>
          </>
        )}
      </TransformWrapper>
    </div>
  );
};
