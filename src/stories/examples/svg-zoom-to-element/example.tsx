import React from "react";

import { TransformWrapper } from "components/transform-wrapper/transform-wrapper";
import { TransformComponent } from "components/transform-component/transform-component";
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
    <TransformWrapper
      {...normalizeArgs(args)}
      wrapperStyle={{
        width: "400px",
        height: "400px",
        maxWidth: "70vw",
        maxHeight: "70vh",
      }}
      contentStyle={{
        width: "400px",
        height: "400px",
        maxWidth: "70vw",
        maxHeight: "70vh",
      }}
    >
      {(utils) => (
        <>
          <Controls
            {...utils}
            extraButtons={[
              { label: "Cloud", icon: <TargetIcon />, onClick: () => utils.zoomToElement("element1") },
              { label: "Face", icon: <TargetIcon />, onClick: () => utils.zoomToElement("element2") },
              { label: "Plane", icon: <TargetIcon />, onClick: () => utils.zoomToElement("element3") },
            ]}
          />
          <TransformComponent
            wrapperStyle={{
              maxWidth: "100%",
              maxHeight: "calc(100vh - 50px)",
            }}
          >
            <Creativity />
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  );
};
