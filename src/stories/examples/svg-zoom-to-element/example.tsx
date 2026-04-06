import React from "react";

import { TransformComponent, TransformWrapper } from "components";
import { Controls, normalizeArgs } from "../../utils";
import { ReactComponent as Creativity } from "./creativity.svg";

const TargetIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="3" y="3" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="8" cy="8" r="1.5" fill="currentColor" />
  </svg>
);

export const Example: React.FC<any> = (args: any) => {
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <TransformWrapper {...normalizeArgs(args)}>
        {(utils) => (
          <>
            <Controls
              {...utils}
              extraButtons={[
                { label: "Element 1", icon: <TargetIcon />, onClick: () => utils.zoomToElement("element1") },
                { label: "Element 2", icon: <TargetIcon />, onClick: () => utils.zoomToElement("element2") },
                { label: "Element 3", icon: <TargetIcon />, onClick: () => utils.zoomToElement("element3") },
              ]}
            />
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
                background: "#0f0f1a",
              }}
            >
              <Creativity style={{ width: "100%" }} />
            </TransformComponent>
          </>
        )}
      </TransformWrapper>
    </div>
  );
};
