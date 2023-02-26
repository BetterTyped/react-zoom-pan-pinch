import React from "react";

import { MiniMap, TransformComponent, TransformWrapper } from "components";
import { Controls, normalizeArgs } from "stories/utils";

export const Template = (args: any) => {
  const element = (
    <div style={{ background: "#666", color: "white", padding: "50px" }}>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum
      </p>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
        veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
        commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
        velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
        occaecat cupidatat non proident, sunt in culpa qui officia deserunt
        mollit anim id est laborum
      </p>
    </div>
  );

  return (
    <TransformWrapper {...normalizeArgs(args)}>
      {(utils) => (
        <div>
          <div
            style={{
              position: "fixed",
              zIndex: 5,
              top: "50px",
              right: "50px",
            }}
          >
            <MiniMap width={200}>{element}</MiniMap>
          </div>
          <Controls {...utils} />
          <TransformComponent
            wrapperStyle={{ maxWidth: "100%", maxHeight: "calc(100vh - 50px)" }}
          >
            {element}
          </TransformComponent>
        </div>
      )}
    </TransformWrapper>
  );
};
