import React, { useState } from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchContentRef,
} from "../../src";
import { renderApp } from "../utils";

const deferredRef = React.createRef<ReactZoomPanPinchContentRef>();

function DeferredMount() {
  const [show, setShow] = useState(false);
  return (
    <TransformWrapper ref={deferredRef}>
      <button type="button" data-testid="toggle" onClick={() => setShow(true)}>
        Show
      </button>
      {show && (
        <TransformComponent
          wrapperStyle={{ width: "500px", height: "500px" }}
          contentStyle={{ width: "1000px", height: "1000px" }}
          contentProps={
            {
              "data-testid": "content516",
            } as React.HTMLAttributes<HTMLDivElement>
          }
        >
          <div />
        </TransformComponent>
      )}
    </TransformWrapper>
  );
}

function PanWithParentRerender({ onTick }: { onTick: () => void }) {
  const [, setTick] = useState(0);
  return (
    <TransformWrapper
      onPanning={() => {
        onTick();
        setTick((n) => n + 1);
      }}
    >
      <TransformComponent
        wrapperProps={
          {
            "data-testid": "wrapper427",
          } as React.HTMLAttributes<HTMLDivElement>
        }
        contentProps={
          {
            "data-testid": "content427",
          } as React.HTMLAttributes<HTMLDivElement>
        }
        wrapperStyle={{ width: "500px", height: "500px" }}
      >
        <div />
      </TransformComponent>
    </TransformWrapper>
  );
}

const rect = (
  left: number,
  top: number,
  width: number,
  height: number,
): DOMRect =>
  ({
    width,
    height,
    top,
    left,
    bottom: top + height,
    right: left + width,
    x: left,
    y: top,
    toJSON: () => ({}),
  }) as DOMRect;

describe("component lifecycle regressions", () => {
  it("initializes and handles gestures when TransformComponent mounts after TransformWrapper (Ref #516)", () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    render(<DeferredMount />);

    expect(deferredRef.current!.instance.isInitialized).toBe(false);
    // Controls called before the component exists must not throw.
    expect(() => deferredRef.current!.zoomIn(0.5, 0)).not.toThrow();

    fireEvent.click(screen.getByTestId("toggle"));
    const content = screen.getByTestId("content516");

    expect(deferredRef.current!.instance.isInitialized).toBe(true);

    fireEvent.mouseDown(content, { clientX: 100, clientY: 100, buttons: 1 });
    fireEvent.mouseMove(content, { clientX: 60, clientY: 70, buttons: 1 });
    fireEvent.mouseUp(content);

    expect(content.style.transform).toBe("translate(-40px, -30px) scale(1)");
    expect(
      errorSpy.mock.calls.some(([message]) =>
        String(message).includes("Components are not mounted"),
      ),
    ).toBe(false);
    errorSpy.mockRestore();
  });

  it("a pan whose onPanning re-renders the parent still applies every move, and the next gesture too (Ref #427)", () => {
    const onTick = jest.fn();
    render(<PanWithParentRerender onTick={onTick} />);
    const content = screen.getByTestId("content427");

    userEvent.hover(content);
    fireEvent.mouseDown(content, { clientX: 100, clientY: 100, buttons: 1 });
    fireEvent.mouseMove(content, { clientX: 140, clientY: 120, buttons: 1 });
    fireEvent.mouseMove(content, { clientX: 190, clientY: 145, buttons: 1 });
    fireEvent.mouseUp(content);

    expect(onTick).toHaveBeenCalledTimes(2);
    expect(content.style.transform).toBe("translate(90px, 45px) scale(1)");

    // The parent re-rendered twice; the listeners must have survived.
    fireEvent.mouseDown(content, { clientX: 0, clientY: 0, buttons: 1 });
    fireEvent.mouseMove(content, { clientX: 10, clientY: 10, buttons: 1 });
    fireEvent.mouseUp(content);

    expect(content.style.transform).toBe("translate(100px, 55px) scale(1)");
  });

  describe("Ref #283", () => {
    // A wide 800 x 400 wrapper and a 100 x 50 target sitting at (150, 20)
    // inside the content, so the offset term and the min(scaleX, scaleY)
    // choice are both exercised.
    const renderWide = () => {
      const ref = React.createRef<ReactZoomPanPinchContentRef>();
      render(
        <TransformWrapper ref={ref} limitToBounds={false}>
          <TransformComponent
            wrapperProps={
              {
                "data-testid": "wrap283",
              } as React.HTMLAttributes<HTMLDivElement>
            }
            wrapperStyle={{ width: "800px", height: "400px" }}
            contentStyle={{ width: "800px", height: "400px" }}
          >
            <div
              data-testid="target283"
              style={{
                position: "absolute",
                left: "150px",
                top: "20px",
                width: "100px",
                height: "50px",
              }}
            />
          </TransformComponent>
        </TransformWrapper>,
      );
      const wrapper = screen.getByTestId("wrap283");
      const target = screen.getByTestId("target283");
      jest
        .spyOn(wrapper, "getBoundingClientRect")
        .mockReturnValue(rect(0, 0, 800, 400));
      jest
        .spyOn(target, "getBoundingClientRect")
        .mockReturnValue(rect(150, 20, 100, 50));
      return { ref, target };
    };

    it("zoomToElement centers an offset target at the requested scale (Ref #283, dupes #343, #540)", () => {
      const { ref, target } = renderWide();

      act(() => {
        ref.current!.zoomToElement(target, 2, 0);
      });

      const { scale, positionX, positionY } = ref.current!.instance.state;
      expect(scale).toBe(2);
      // target centre (150 + 50, 20 + 25) * 2 + position == wrapper centre
      expect(positionX + 200 * 2).toBe(400);
      expect(positionY + 45 * 2).toBe(200);
      expect(positionX).toBe(0);
      expect(positionY).toBe(110);
    });

    it("zoomToElement without a scale fits the target using the tighter axis (Ref #283)", () => {
      const { ref, target } = renderWide();

      act(() => {
        ref.current!.zoomToElement(target, undefined, 0);
      });

      // min(800 / 100, 400 / 50) = 8, which is also maxScale.
      const { scale, positionX, positionY } = ref.current!.instance.state;
      expect(scale).toBe(8);
      expect(positionX + 200 * 8).toBe(400);
      expect(positionY + 45 * 8).toBe(200);
    });

    it("zoomToElement resolves string ids inside the wrapper's document (Ref #283)", () => {
      const { ref, target } = renderWide();
      target.id = "seat-42";

      act(() => {
        ref.current!.zoomToElement("seat-42", 2, 0);
      });

      expect(ref.current!.instance.state.scale).toBe(2);
      expect(ref.current!.instance.state.positionY).toBe(110);
    });
  });

  it("survives zero wrapper and content dimensions and recovers once they are laid out (Ref #479)", () => {
    const { ref, wrapper, content } = renderApp({
      centerOnInit: true,
      limitToBounds: false,
      wrapperWidth: "0px",
      wrapperHeight: "0px",
      contentWidth: "0px",
      contentHeight: "0px",
    });

    expect(wrapper.offsetWidth).toBe(0);
    expect(content.offsetWidth).toBe(0);
    expect(() => {
      ref.current!.zoomIn(1, 0);
      ref.current!.centerView(1, 0);
    }).not.toThrow();
    expect(Number.isFinite(ref.current!.instance.state.positionX)).toBe(true);
    expect(Number.isFinite(ref.current!.instance.state.positionY)).toBe(true);

    // The dialog opens: real sizes appear.
    wrapper.style.width = "500px";
    wrapper.style.height = "500px";
    content.style.width = "300px";
    content.style.height = "300px";

    ref.current!.centerView(1, 0);

    expect(ref.current!.instance.state.positionX).toBe(100);
    expect(ref.current!.instance.state.positionY).toBe(100);
  });

  // The library does not listen to window resize; bounds are recomputed on
  // the next gesture. This pins that the scale is left alone (Ref #364).
  it("does not change the scale on window resize (Ref #364)", () => {
    const { ref, wrapper } = renderApp();

    ref.current!.setTransform(0, 0, 2, 0);

    wrapper.style.width = "300px";
    wrapper.style.height = "300px";
    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    expect(ref.current!.instance.state.scale).toBe(2);
  });
});
