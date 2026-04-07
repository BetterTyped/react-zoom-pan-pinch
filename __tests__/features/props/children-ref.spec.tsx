import React from "react";
import { render, screen } from "@testing-library/react";

import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchContentRef,
} from "../../../src";

describe("ReactZoomPanPinchProps.children", () => {
  it("renders ReactNode children", () => {
    render(
      <TransformWrapper>
        <TransformComponent>
          <div data-testid="child">hello</div>
        </TransformComponent>
      </TransformWrapper>,
    );
    expect(screen.getByTestId("child").textContent).toBe("hello");
  });

  it("renders via render-function children with ref helpers", () => {
    let capturedRef: ReactZoomPanPinchContentRef | null = null;

    render(
      <TransformWrapper>
        {(ref) => {
          capturedRef = ref;
          return (
            <TransformComponent>
              <div data-testid="fn-child">fn</div>
            </TransformComponent>
          );
        }}
      </TransformWrapper>,
    );

    expect(screen.getByTestId("fn-child")).toBeTruthy();
    expect(capturedRef).not.toBeNull();
    expect(typeof capturedRef!.zoomIn).toBe("function");
    expect(typeof capturedRef!.zoomOut).toBe("function");
    expect(typeof capturedRef!.setTransform).toBe("function");
    expect(typeof capturedRef!.resetTransform).toBe("function");
    expect(typeof capturedRef!.centerView).toBe("function");
    expect(typeof capturedRef!.zoomToElement).toBe("function");
  });
});

describe("ReactZoomPanPinchProps.ref", () => {
  it("exposes imperative ref with instance and handlers", () => {
    const ref = React.createRef<ReactZoomPanPinchContentRef>();

    render(
      <TransformWrapper ref={ref}>
        <TransformComponent>
          <div>content</div>
        </TransformComponent>
      </TransformWrapper>,
    );

    expect(ref.current).not.toBeNull();
    expect(ref.current!.instance).toBeDefined();
    expect(ref.current!.instance.state.scale).toBe(1);
    expect(typeof ref.current!.zoomIn).toBe("function");
    expect(typeof ref.current!.zoomOut).toBe("function");
    expect(typeof ref.current!.setTransform).toBe("function");
    expect(typeof ref.current!.resetTransform).toBe("function");
    expect(typeof ref.current!.centerView).toBe("function");
    expect(typeof ref.current!.zoomToElement).toBe("function");
  });
});

describe("ReactZoomPanPinchProps.detached", () => {
  it("renders without attaching event listeners when detached is true", () => {
    const ref = React.createRef<ReactZoomPanPinchContentRef>();

    render(
      <TransformWrapper ref={ref} detached>
        <TransformComponent>
          <div data-testid="content">content</div>
        </TransformComponent>
      </TransformWrapper>,
    );

    expect(ref.current).not.toBeNull();
    expect(ref.current!.instance.state.scale).toBe(1);
  });
});
