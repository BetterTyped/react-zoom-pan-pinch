import React from "react";

import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchProps,
  ReactZoomPanPinchContentRef,
} from "../../src";
import { Controls } from "./controls.utils";

export const Example = (options: {
  props?: ReactZoomPanPinchProps;
  onRender: () => void;
  onRenderProps: (ref: ReactZoomPanPinchContentRef) => void;
}) => {
  const { props = {}, onRender, onRenderProps } = options;

  onRender();

  return (
    <TransformWrapper {...props}>
      {(utils) => (
        <div>
          {onRenderProps(utils)}
          <Controls {...utils} />
          <TransformComponent
            wrapperProps={
              {
                "data-testid": "wrapper",
              } as React.HTMLAttributes<HTMLDivElement>
            }
            contentProps={
              {
                "data-testid": "content",
              } as React.HTMLAttributes<HTMLDivElement>
            }
            wrapperStyle={{
              width: "500px",
              height: "500px",
              maxWidth: "100%",
              maxHeight: "calc(100vh - 50px)",
            }}
          >
            <div
              style={{ background: "#444", color: "white", padding: "50px" }}
            >
              <h1>Title</h1>
              <h2>Subtitle</h2>
              <button
                type="button"
                onClick={() =>
                  alert("You can still interact with click events!")
                }
              >
                Click me!
              </button>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum
              </p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                enim ad minim veniam, quis nostrud exercitation ullamco laboris
                nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor
                in reprehenderit in voluptate velit esse cillum dolore eu fugiat
                nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                sunt in culpa qui officia deserunt mollit anim id est laborum
              </p>
            </div>
          </TransformComponent>
        </div>
      )}
    </TransformWrapper>
  );
};
