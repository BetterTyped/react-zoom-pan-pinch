/* eslint-disable react/require-default-props */
import React, { useState } from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";

import {
  TransformWrapper,
  TransformComponent,
  useControls,
  useTransformComponent,
  useTransformContext,
  useTransformEffect,
  useTransformInit,
  ReactZoomPanPinchContentRef,
  ReactZoomPanPinchContextState,
} from "../../../src";
import { useZoomPanPinch } from "../../../src/hooks/use-zoom-pan-pinch";

const wheel = (target: Element, deltaY: number) =>
  fireEvent(target, new WheelEvent("wheel", { bubbles: true, deltaY }));

const Canvas = ({ children }: { children?: React.ReactNode }) => (
  <TransformComponent
    wrapperStyle={{ width: "500px", height: "500px" }}
    contentStyle={{ width: "1000px", height: "1000px" }}
    contentProps={
      { "data-testid": "content" } as React.HTMLAttributes<HTMLDivElement>
    }
  >
    {children}
  </TransformComponent>
);

describe("Hooks", () => {
  describe("useTransformContext", () => {
    it("throws a descriptive error outside of TransformWrapper", () => {
      const errorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const Outside = () => {
        useTransformContext();
        return null;
      };

      expect(() => render(<Outside />)).toThrow(
        "Transform context must be placed inside TransformWrapper",
      );
      errorSpy.mockRestore();
    });

    it("returns the instance shared with the wrapper ref", () => {
      const ref = React.createRef<ReactZoomPanPinchContentRef>();
      let seen: unknown = null;
      const Probe = () => {
        seen = useTransformContext();
        return null;
      };
      render(
        <TransformWrapper ref={ref}>
          <Canvas />
          <Probe />
        </TransformWrapper>,
      );

      expect(seen).toBe(ref.current!.instance);
    });
  });

  describe("useControls", () => {
    it("exposes working handlers and the live state", () => {
      const Buttons = () => {
        const { zoomIn, resetTransform, state } = useControls();
        return (
          <>
            <button
              type="button"
              data-testid="in"
              onClick={() => zoomIn(0.5, 0)}
            >
              in
            </button>
            <button
              type="button"
              data-testid="reset"
              onClick={() => resetTransform(0)}
            >
              reset
            </button>
            <span data-testid="has-state">{String("scale" in state)}</span>
          </>
        );
      };
      const ref = React.createRef<ReactZoomPanPinchContentRef>();
      render(
        <TransformWrapper ref={ref}>
          <Canvas />
          <Buttons />
        </TransformWrapper>,
      );

      expect(screen.getByTestId("has-state").textContent).toBe("true");

      fireEvent.click(screen.getByTestId("in"));
      // zoomIn(step) adds the step: 1 + 0.5
      expect(ref.current!.instance.state.scale).toBeCloseTo(1.5, 10);

      fireEvent.click(screen.getByTestId("reset"));
      expect(ref.current!.instance.state.scale).toBe(1);
    });
  });

  describe("useTransformComponent", () => {
    it("re-renders the consumer with the new state on every transform", () => {
      const ref = React.createRef<ReactZoomPanPinchContentRef>();
      const renders = jest.fn();
      const ScaleLabel = () =>
        useTransformComponent(({ state }) => {
          renders();
          return <span data-testid="scale">{state.scale}</span>;
        });
      render(
        <TransformWrapper ref={ref}>
          <Canvas />
          <ScaleLabel />
        </TransformWrapper>,
      );

      expect(screen.getByTestId("scale").textContent).toBe("1");

      act(() => {
        ref.current!.setTransform(0, 0, 2, 0);
      });
      expect(screen.getByTestId("scale").textContent).toBe("2");

      act(() => {
        ref.current!.setTransform(-10, -10, 3, 0);
      });
      expect(screen.getByTestId("scale").textContent).toBe("3");
    });

    it("stops updating after unmount of the consumer", () => {
      const ref = React.createRef<ReactZoomPanPinchContentRef>();
      const callback = jest.fn(({ state }) => state.scale);
      const Consumer = () => {
        const scale = useTransformComponent(callback);
        return <span data-testid="scale">{scale}</span>;
      };
      function App({ show }: { show: boolean }) {
        return (
          <TransformWrapper ref={ref}>
            <Canvas />
            {show && <Consumer />}
          </TransformWrapper>
        );
      }
      const view = render(<App show />);
      view.rerender(<App show={false} />);
      const callsAfterUnmount = callback.mock.calls.length;

      act(() => {
        ref.current!.setTransform(0, 0, 2, 0);
      });

      expect(callback.mock.calls.length).toBe(callsAfterUnmount);
    });
  });

  describe("useTransformEffect", () => {
    it("runs the effect on every transform and its cleanup before the next one", () => {
      const ref = React.createRef<ReactZoomPanPinchContentRef>();
      const cleanup = jest.fn();
      const effect = jest.fn<() => void, [ReactZoomPanPinchContextState]>(
        () => cleanup,
      );
      const Effect = () => {
        useTransformEffect(effect);
        return null;
      };
      const view = render(
        <TransformWrapper ref={ref}>
          <Canvas />
          <Effect />
        </TransformWrapper>,
      );

      expect(effect).not.toHaveBeenCalled();

      act(() => {
        ref.current!.setTransform(0, 0, 2, 0);
      });
      expect(effect).toHaveBeenCalledTimes(1);
      const [firstCall] = effect.mock.calls[0];
      expect(firstCall.instance).toBe(ref.current!.instance);
      expect(firstCall.state).toBe(ref.current!.instance.state);
      expect(firstCall.state.scale).toBe(2);

      act(() => {
        ref.current!.setTransform(0, 0, 3, 0);
      });
      expect(effect).toHaveBeenCalledTimes(2);

      view.unmount();
      expect(cleanup).toHaveBeenCalled();
    });
  });

  describe("useTransformInit", () => {
    it("runs once immediately when the components are already mounted", () => {
      const init = jest.fn();
      const Init = () => {
        useTransformInit(init);
        return null;
      };
      const ref = React.createRef<ReactZoomPanPinchContentRef>();
      render(
        <TransformWrapper ref={ref}>
          <Canvas />
          <Init />
        </TransformWrapper>,
      );

      expect(init).toHaveBeenCalledTimes(1);
      const [initCall] = init.mock.calls[0];
      expect(initCall.instance).toBe(ref.current!.instance);
      expect(initCall.state).toBe(ref.current!.instance.state);
      expect(initCall.state.scale).toBe(1);
    });

    it("waits for a deferred TransformComponent and then runs once", () => {
      const init = jest.fn();
      const Init = () => {
        useTransformInit(init);
        return null;
      };
      function App() {
        const [show, setShow] = useState(false);
        return (
          <TransformWrapper>
            <Init />
            <button
              type="button"
              data-testid="show"
              onClick={() => setShow(true)}
            >
              show
            </button>
            {show && <Canvas />}
          </TransformWrapper>
        );
      }
      render(<App />);

      expect(init).not.toHaveBeenCalled();

      fireEvent.click(screen.getByTestId("show"));

      expect(init).toHaveBeenCalledTimes(1);
    });

    it("runs its cleanup on unmount", () => {
      const cleanup = jest.fn();
      const Init = () => {
        useTransformInit(() => cleanup);
        return null;
      };
      const view = render(
        <TransformWrapper>
          <Canvas />
          <Init />
        </TransformWrapper>,
      );

      expect(cleanup).not.toHaveBeenCalled();
      view.unmount();
      expect(cleanup).toHaveBeenCalledTimes(1);
    });
  });

  describe("useZoomPanPinch (headless hook)", () => {
    function Headless({
      onTransform,
    }: {
      onTransform: (data: { scale: number }) => void;
    }) {
      const { wrapperRef, contentRef, useTransform } = useZoomPanPinch({
        wheel: { step: 0.1 },
      });
      useTransform(onTransform);
      return (
        <div
          ref={wrapperRef}
          data-testid="hook-wrapper"
          style={{ width: "500px", height: "500px" }}
        >
          <div
            ref={contentRef}
            data-testid="hook-content"
            style={{ width: "1000px", height: "1000px" }}
          />
        </div>
      );
    }

    it("wires zoom and pan to custom markup", () => {
      const onTransform = jest.fn();
      render(<Headless onTransform={onTransform} />);
      const content = screen.getByTestId("hook-content");

      wheel(content, -1);

      expect(content.style.transform).toBe("translate(0px, 0px) scale(1.1)");
      expect(onTransform).toHaveBeenLastCalledWith(
        expect.objectContaining({ scale: 1.1, positionX: 0, positionY: 0 }),
      );

      fireEvent.mouseDown(content, { clientX: 0, clientY: 0, buttons: 1 });
      fireEvent.mouseMove(content, { clientX: -50, clientY: -20, buttons: 1 });
      fireEvent.mouseUp(content);

      expect(content.style.transform).toBe(
        "translate(-50px, -20px) scale(1.1)",
      );
    });

    it("stops reacting after unmount", () => {
      const onTransform = jest.fn();
      const view = render(<Headless onTransform={onTransform} />);
      const content = screen.getByTestId("hook-content");
      view.unmount();
      onTransform.mockClear();

      wheel(content, -1);

      expect(onTransform).not.toHaveBeenCalled();
    });

    it("is part of the public package API (#329)", () => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require
      const pkg = require("../../../src") as Record<string, unknown>;
      expect(pkg.useZoomPanPinch).toBe(useZoomPanPinch);
    });
  });
});
