import React from "react";
import { render, screen, act } from "@testing-library/react";

import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchContentRef,
} from "../../../src";
import { flushAnimationFrames } from "../../utils";

describe("Zoom to element", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("zoomToElement focuses a child element in the viewport", () => {
    jest.useFakeTimers();
    const ref = React.createRef<ReactZoomPanPinchContentRef>();

    render(
      <TransformWrapper ref={ref} limitToBounds={false} smooth={false}>
        <TransformComponent
          wrapperStyle={{ width: "500px", height: "500px" }}
          contentStyle={{ width: "2000px", height: "2000px" }}
        >
          <div style={{ position: "relative" }}>
            <div
              data-testid="target"
              style={{
                position: "absolute",
                left: "1000px",
                top: "1000px",
                width: "100px",
                height: "100px",
              }}
            >
              target
            </div>
          </div>
        </TransformComponent>
      </TransformWrapper>,
    );

    const target = screen.getByTestId("target");

    act(() => {
      ref.current!.zoomToElement(target, undefined, 0);
    });
    act(() => {
      flushAnimationFrames(40);
    });

    expect(ref.current!.instance.state.scale).toBeGreaterThanOrEqual(1);
  });

  it("zoomToElement handler exists on the ref", () => {
    const ref = React.createRef<ReactZoomPanPinchContentRef>();

    render(
      <TransformWrapper ref={ref}>
        <TransformComponent>
          <div>content</div>
        </TransformComponent>
      </TransformWrapper>,
    );

    expect(typeof ref.current!.zoomToElement).toBe("function");
  });
});
