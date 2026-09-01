import React, { useState } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";

import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchContentRef,
} from "../../../src";
import { renderApp } from "../../utils";

const wheel = (target: Element, deltaY: number) =>
  fireEvent(target, new WheelEvent("wheel", { bubbles: true, deltaY }));

describe("Props [Misc]", () => {
  describe("detached", () => {
    it("keeps the state in sync but never writes the transform to the content element", () => {
      const onTransform = jest.fn();
      const { ref, content } = renderApp({ detached: true, onTransform });
      const initial = content.style.transform;

      act(() => {
        ref.current!.setTransform(10, 20, 2, 0);
      });

      expect(ref.current!.instance.state).toMatchObject({
        scale: 2,
        positionX: 10,
        positionY: 20,
      });
      expect(content.style.transform).toBe(initial);
      expect(onTransform).toHaveBeenLastCalledWith(
        expect.anything(),
        expect.objectContaining({ scale: 2, positionX: 10, positionY: 20 }),
      );
    });
  });

  describe("customTransform", () => {
    it("uses the custom transform string for the content element", () => {
      const customTransform = jest.fn(
        (x: number, y: number, scale: number) =>
          `matrix(${scale}, 0, 0, ${scale}, ${x}, ${y})`,
      );
      const { ref, content } = renderApp({ customTransform });

      act(() => {
        ref.current!.setTransform(10, 20, 2, 0);
      });

      expect(customTransform).toHaveBeenCalledWith(10, 20, 2);
      expect(content.style.transform).toBe("matrix(2, 0, 0, 2, 10, 20)");
    });
  });

  describe("infinite", () => {
    it("renders a grid layer that follows the pan offset", () => {
      const ref = React.createRef<ReactZoomPanPinchContentRef>();
      render(
        <TransformWrapper ref={ref} limitToBounds={false}>
          <TransformComponent
            infinite
            wrapperStyle={{ width: "500px", height: "500px" }}
            contentStyle={{ width: "1000px", height: "1000px" }}
          >
            <div />
          </TransformComponent>
        </TransformWrapper>,
      );
      const grid = document.querySelector("[aria-hidden]") as HTMLElement;
      expect(grid).not.toBeNull();
      expect(grid.style.backgroundPosition).toBe("0px 0px");

      act(() => {
        ref.current!.setTransform(35, -15, 1, 0);
      });

      expect(grid.style.backgroundPosition).toBe("35px -15px");
    });

    it("renders no grid layer by default", () => {
      renderApp();
      expect(document.querySelector("[aria-hidden]")).toBeNull();
    });
  });

  describe("onInit", () => {
    it("fires once with a ref exposing state and handlers", () => {
      const onInit = jest.fn();
      const { ref } = renderApp({ onInit });

      expect(onInit).toHaveBeenCalledTimes(1);
      const [ctx] = onInit.mock.calls[0];
      expect(ctx.instance).toBe(ref.current!.instance);
      expect(ctx.state).toMatchObject({ scale: 1, positionX: 0, positionY: 0 });
      expect(typeof ctx.zoomIn).toBe("function");
      expect(typeof ctx.zoomToElement).toBe("function");
    });
  });

  describe("onTransform", () => {
    it("receives the ref and the new state on every change", () => {
      const onTransform = jest.fn();
      const { ref } = renderApp({ onTransform });

      act(() => {
        ref.current!.setTransform(-5, -7, 1.5, 0);
      });

      expect(onTransform).toHaveBeenLastCalledWith(
        expect.objectContaining({ instance: ref.current!.instance }),
        { scale: 1.5, positionX: -5, positionY: -7 },
      );
    });
  });

  describe("disabled", () => {
    function App({ disabled }: { disabled: boolean }) {
      return (
        <TransformWrapper disabled={disabled}>
          <TransformComponent
            wrapperStyle={{ width: "500px", height: "500px" }}
            contentStyle={{ width: "1000px", height: "1000px" }}
            contentProps={
              {
                "data-testid": "content",
              } as React.HTMLAttributes<HTMLDivElement>
            }
          >
            <div />
          </TransformComponent>
        </TransformWrapper>
      );
    }

    it("blocks wheel zoom and pan while set, and releases them when unset", () => {
      const view = render(<App disabled />);
      const content = screen.getByTestId("content");

      wheel(content, -1);
      fireEvent.mouseDown(content, { clientX: 0, clientY: 0, buttons: 1 });
      fireEvent.mouseMove(content, { clientX: -50, clientY: 0, buttons: 1 });
      fireEvent.mouseUp(content);
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");

      view.rerender(<App disabled={false} />);

      wheel(content, -1);
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1.015)");
    });
  });

  describe("prop updates", () => {
    it("recalculates bounds from the new props, not the previous ones", () => {
      const { ref } = renderApp({
        contentWidth: "1000px",
        contentHeight: "1000px",
      });
      const { instance } = ref.current!;
      expect(instance.bounds?.maxPositionX).toBe(0);

      instance.update({ ...instance.props, maxPositionX: 50 });

      expect(instance.setup.maxPositionX).toBe(50);
      expect(instance.bounds?.maxPositionX).toBe(50);
    });

    it("applies a changed bound to trackpad panning without another gesture", () => {
      function App({ maxPositionX }: { maxPositionX: number }) {
        return (
          <TransformWrapper
            maxPositionX={maxPositionX}
            // Trackpad panning only runs when wheel zoom does not claim the event.
            wheel={{ disabled: true }}
            trackPadPanning={{ disabled: false }}
            velocityAnimation={{ disabled: true }}
            // sizeX/sizeY are the rubber-band padding; zero them so the
            // position is clamped exactly at the bound.
            autoAlignment={{ disabled: true, sizeX: 0, sizeY: 0 }}
          >
            <TransformComponent
              wrapperStyle={{ width: "500px", height: "500px" }}
              contentStyle={{ width: "1000px", height: "1000px" }}
              contentProps={
                {
                  "data-testid": "content",
                } as React.HTMLAttributes<HTMLDivElement>
              }
            >
              <div />
            </TransformComponent>
          </TransformWrapper>
        );
      }
      const view = render(<App maxPositionX={0} />);
      const content = screen.getByTestId("content");

      view.rerender(<App maxPositionX={40} />);

      // Trackpad panning uses the stored bounds directly.
      fireEvent(
        content,
        new WheelEvent("wheel", { bubbles: true, deltaX: -100, deltaY: 0 }),
      );

      expect(content.style.transform).toBe("translate(40px, 0px) scale(1)");
    });
  });

  describe("children as a function", () => {
    it("receives the controls and state", () => {
      const seen: string[] = [];
      render(
        <TransformWrapper>
          {(controls) => {
            seen.push(...Object.keys(controls));
            return (
              <TransformComponent>
                <div />
              </TransformComponent>
            );
          }}
        </TransformWrapper>,
      );

      expect(seen).toEqual(
        expect.arrayContaining([
          "instance",
          "state",
          "zoomIn",
          "zoomOut",
          "setTransform",
          "resetTransform",
          "centerView",
          "zoomToElement",
        ]),
      );
    });
  });

  describe("instance construction", () => {
    it("keeps a single instance across parent re-renders", () => {
      const ref = React.createRef<ReactZoomPanPinchContentRef>();
      function App() {
        const [, setTick] = useState(0);
        return (
          <>
            <button
              type="button"
              data-testid="tick"
              onClick={() => setTick((n) => n + 1)}
            >
              tick
            </button>
            <TransformWrapper ref={ref}>
              <TransformComponent>
                <div />
              </TransformComponent>
            </TransformWrapper>
          </>
        );
      }
      render(<App />);
      const first = ref.current!.instance;

      fireEvent.click(screen.getByTestId("tick"));
      fireEvent.click(screen.getByTestId("tick"));

      expect(ref.current!.instance).toBe(first);
    });
  });
});
