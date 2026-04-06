import React from "react";

import { TransformComponent, TransformWrapper } from "components";
import { Controls, NumberedTargetIcon, normalizeArgs, viewerChrome } from "../../utils";
import { ReactComponent as Creativity } from "./creativity.svg";

export const Example: React.FC<any> = (args: any) => {
  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <TransformWrapper {...normalizeArgs(args)}>
        {(utils) => (
          <>
            <Controls
              {...utils}
              extraButtons={[
                { label: "Focus element 1", icon: <NumberedTargetIcon n={1} />, onClick: () => utils.zoomToElement("element1") },
                { label: "Focus element 2", icon: <NumberedTargetIcon n={2} />, onClick: () => utils.zoomToElement("element2") },
                { label: "Focus element 3", icon: <NumberedTargetIcon n={3} />, onClick: () => utils.zoomToElement("element3") },
              ]}
            />
            <TransformComponent
              wrapperStyle={{
                width: "500px",
                height: "500px",
                maxWidth: "80vw",
                maxHeight: "75vh",
                ...viewerChrome,
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
