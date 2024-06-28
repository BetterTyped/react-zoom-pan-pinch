import React from "react";

import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchProps,
} from "../../src";
import { Controls } from "./controls.utils";

export const Example = (options: {
  props?: ReactZoomPanPinchProps;
  onRender: () => void;
  children?: React.ReactNode;
  contentWidth?: string;
  contentHeight?: string;
  wrapperWidth?: string;
  wrapperHeight?: string;
}) => {
  const {
    props = {},
    onRender,
    children,
    contentHeight,
    contentWidth,
    wrapperHeight,
    wrapperWidth,
  } = options;

  onRender();

  return (
    <TransformWrapper {...props}>
      <div>
        {children}
        <Controls />
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
            width: wrapperWidth || "500px",
            height: wrapperHeight || "500px",
          }}
          contentStyle={{
            width: contentWidth || "100%",
            height: contentHeight || "100%",
          }}
        >
          <div style={{ background: "#444", color: "white", padding: "50px" }}>
            <h1>Title</h1>
            <h2>Subtitle</h2>
            {/* <button
              type="button"
              onClick={() => alert("You can still interact with click events!")}
            >
              Click me!
            </button> */}
            <div
              style={{
                display: "flex",
                overflow: "auto",
                maxWidth: "100%",
                padding: "10px",
              }}
            >
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  padding: "10px",
                  background: "red",
                }}
                className="panningDisabled"
              >
                Panning is DISABLED on this element
              </div>
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  padding: "10px",
                  background: "blue",
                }}
                className="wheelDisabled"
              >
                Wheel is DISABLED on this element
              </div>
              <div
                style={{
                  width: "100px",
                  height: "100px",
                  padding: "10px",
                  background: "green",
                }}
                className="pinchDisabled"
              >
                Pinch is DISABLED on this element
              </div>
            </div>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat
              nulla pariatur. Excepteur sint occaecat cupidatat non proident,
              sunt in culpa qui officia deserunt mollit anim id est laborum
            </p>
          </div>
        </TransformComponent>
      </div>
    </TransformWrapper>
  );
};
