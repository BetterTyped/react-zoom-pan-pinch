import React from "react";

import { TransformComponent, TransformWrapper } from "components";
import { Controls, normalizeArgs } from "../../utils";
import { useTransformComponent } from "../../../hooks";

const TargetIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="3" y="3" width="10" height="10" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="8" cy="8" r="1.5" fill="currentColor" />
  </svg>
);

const CurrentScale = () => {
  return useTransformComponent(({ state }) => {
    return <div>Current Scale: {state.scale}</div>;
  });
};

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
              { label: "Element 1", icon: <TargetIcon />, onClick: () => utils.zoomToElement("element1") },
              { label: "Element 2", icon: <TargetIcon />, onClick: () => utils.zoomToElement("element2") },
              { label: "Element 3", icon: <TargetIcon />, onClick: () => utils.zoomToElement("element3") },
            ]}
          />
          <TransformComponent
            wrapperStyle={{
              maxWidth: "100%",
              maxHeight: "calc(100vh - 50px)",
            }}
          >
            <CurrentScale />
            <div
              style={{
                background: "#444",
                color: "white",
                padding: "50px",
                minHeight: "300px",
                width: "100%",
              }}
            >
              <div
                id="element1"
                style={{ background: "red", width: "200px", height: "400px" }}
              >
                Zoom element 1
              </div>
              <div
                id="element2"
                style={{
                  background: "blue",
                  width: "250px",
                  height: "150px",
                  marginTop: "200px",
                  marginLeft: "200px",
                }}
              >
                Zoom element 2
              </div>
              <div
                id="element3"
                style={{
                  background: "green",
                  width: "150px",
                  height: "150px",
                  marginTop: "200px",
                  marginLeft: "500px",
                }}
              >
                Zoom element 3
              </div>
            </div>
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  );
};
