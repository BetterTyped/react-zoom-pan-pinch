import React from "react";
import { act, fireEvent, render } from "@testing-library/react";

import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "../../src";

/**
 * Ref #371 / #444 — inside a shadow root the CSS-module stylesheet is not
 * applied, so `transform-origin` fell back to the centre and zoom anchored at
 * the wrong point. The critical rule is now inline, and element ids passed to
 * `zoomToElement` resolve in the wrapper's own root.
 */
describe("regressions: shadow DOM (Ref #371, #444)", () => {
  const mountInShadowRoot = () => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    const shadowRoot = host.attachShadow({ mode: "open" });
    const ref = React.createRef<ReactZoomPanPinchRef>();

    render(
      <TransformWrapper ref={ref} limitToBounds={false} smooth={false}>
        <TransformComponent
          wrapperStyle={{ width: "500px", height: "500px" }}
          contentStyle={{ width: "2000px", height: "2000px" }}
        >
          <div style={{ position: "relative" }}>
            <div
              id="shadow-target"
              style={{
                position: "absolute",
                left: "1000px",
                top: "1000px",
                width: "100px",
                height: "100px",
              }}
            />
          </div>
        </TransformComponent>
      </TransformWrapper>,
      { container: shadowRoot as unknown as HTMLElement },
    );

    const wrapper = shadowRoot.querySelector<HTMLElement>(
      ".react-transform-wrapper",
    )!;
    const content = shadowRoot.querySelector<HTMLElement>(
      ".react-transform-component",
    )!;

    return { ref, host, shadowRoot, wrapper, content };
  };

  afterEach(() => {
    document.body.innerHTML = "";
  });

  it("keeps the zoom anchor at the top-left corner without the stylesheet", () => {
    const { content } = mountInShadowRoot();

    expect(content.style.transformOrigin).toMatch(/^0(px)? 0(px)?$/);
  });

  it("lets contentStyle override the inline transform-origin", () => {
    const ref = React.createRef<ReactZoomPanPinchRef>();
    const view = render(
      <TransformWrapper ref={ref}>
        <TransformComponent contentStyle={{ transformOrigin: "50% 50%" }}>
          <div />
        </TransformComponent>
      </TransformWrapper>,
    );

    const content = view.container.querySelector<HTMLElement>(
      ".react-transform-component",
    )!;
    expect(content.style.transformOrigin).toBe("50% 50%");
  });

  it("resolves zoomToElement ids inside the shadow root", () => {
    const { ref, shadowRoot } = mountInShadowRoot();
    expect(document.getElementById("shadow-target")).toBeNull();
    expect(shadowRoot.getElementById("shadow-target")).not.toBeNull();

    act(() => {
      ref.current!.zoomToElement("shadow-target", { animationTime: 0 });
    });

    // 100x100 target in a 500 wrapper: fit scale 5.
    expect(ref.current!.instance.state.scale).toBe(5);
  });

  it("zooms with the wheel inside the shadow root", () => {
    const { ref, content } = mountInShadowRoot();

    act(() => {
      fireEvent(
        content,
        new WheelEvent("wheel", { bubbles: true, deltaY: -1 }),
      );
    });

    expect(ref.current!.instance.state.scale).toBeGreaterThan(1);
  });
});
