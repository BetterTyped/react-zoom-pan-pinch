/* eslint-disable react/require-default-props */
import React from "react";

import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchProps,
} from "../../src";
import { Controls } from "./controls.utils";

interface ExtremeExampleOptions {
  props?: ReactZoomPanPinchProps;
  onRender: () => void;
  children?: React.ReactNode;
}

/**
 * Huge canvas: 5000×5000 content in a 500×500 wrapper.
 * Simulates large maps, venue seating charts, or high-res image viewers
 * where the content-to-viewport ratio is 10:1.
 */
export const HugeCanvasExample = ({
  props = {},
  onRender,
  children,
}: ExtremeExampleOptions) => {
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
          wrapperStyle={{ width: "500px", height: "500px" }}
          contentStyle={{ width: "5000px", height: "5000px" }}
        >
          <div
            data-testid="canvas"
            style={{
              width: "5000px",
              height: "5000px",
              background:
                "repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 0 0 / 100px 100px",
            }}
          />
        </TransformComponent>
      </div>
    </TransformWrapper>
  );
};

/**
 * Tall document: 500×3000 content in a 500×500 wrapper.
 * Simulates a long document, vertical timeline, or chat transcript
 * where vertical scrolling dominates.
 */
export const TallDocumentExample = ({
  props = {},
  onRender,
  children,
}: ExtremeExampleOptions) => {
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
          wrapperStyle={{ width: "500px", height: "500px" }}
          contentStyle={{ width: "500px", height: "3000px" }}
        >
          <div
            data-testid="document"
            style={{
              width: "500px",
              height: "3000px",
              background: "linear-gradient(to bottom, #333, #999)",
            }}
          />
        </TransformComponent>
      </div>
    </TransformWrapper>
  );
};

/**
 * Wide panorama: 3000×300 content in a 500×500 wrapper.
 * Simulates a panoramic photo, horizontal timeline, or wide infographic
 * where horizontal scrolling dominates.
 */
export const WidePanoramaExample = ({
  props = {},
  onRender,
  children,
}: ExtremeExampleOptions) => {
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
          wrapperStyle={{ width: "500px", height: "500px" }}
          contentStyle={{ width: "3000px", height: "300px" }}
        >
          <div
            data-testid="panorama"
            style={{
              width: "3000px",
              height: "300px",
              background: "linear-gradient(to right, #234, #987)",
            }}
          />
        </TransformComponent>
      </div>
    </TransformWrapper>
  );
};

/**
 * Tiny viewport: 1000×1000 content in a 50×50 wrapper.
 * Simulates a thumbnail navigator, mini-map preview, or severely constrained
 * mobile viewport where the wrapper is extremely small relative to content.
 */
export const TinyViewportExample = ({
  props = {},
  onRender,
  children,
}: ExtremeExampleOptions) => {
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
          wrapperStyle={{ width: "50px", height: "50px" }}
          contentStyle={{ width: "1000px", height: "1000px" }}
        >
          <div
            data-testid="minimap"
            style={{
              width: "1000px",
              height: "1000px",
              background: "#556",
            }}
          />
        </TransformComponent>
      </div>
    </TransformWrapper>
  );
};

/**
 * Mismatched aspect ratios: 4000×200 wide content in a 200×800 tall wrapper.
 * The content and wrapper have inverted aspect ratios — wide content
 * inside a tall viewport. Stresses bounds calculation and centering logic.
 */
export const MismatchedAspectExample = ({
  props = {},
  onRender,
  children,
}: ExtremeExampleOptions) => {
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
          wrapperStyle={{ width: "200px", height: "800px" }}
          contentStyle={{ width: "4000px", height: "200px" }}
        >
          <div
            data-testid="strip"
            style={{
              width: "4000px",
              height: "200px",
              background: "linear-gradient(to right, #a33, #33a)",
            }}
          />
        </TransformComponent>
      </div>
    </TransformWrapper>
  );
};
