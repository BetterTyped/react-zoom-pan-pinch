import { act, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderApp, flushAnimationFrames } from "../utils";

describe("regressions: wheel and zoom behavior", () => {
  describe("Ref #241", () => {
    afterEach(() => {
      jest.useRealTimers();
    });

    it("double-click toggle zooms out back to 1 after zoom in (Ref #241)", () => {
      jest.useFakeTimers();
      const { content, ref } = renderApp({
        smooth: false,
        doubleClick: {
          disabled: false,
          mode: "toggle",
          step: 0.7,
          animationTime: 80,
        },
      });

      act(() => {
        fireEvent.doubleClick(content);
      });
      act(() => {
        flushAnimationFrames(40);
        jest.advanceTimersByTime(200);
      });

      act(() => {
        fireEvent.doubleClick(content);
      });
      act(() => {
        flushAnimationFrames(40);
        jest.advanceTimersByTime(200);
      });

      expect(ref.current!.instance.state.scale).toBeCloseTo(1, 5);
    });
  });

  describe("Ref #323", () => {
    it("wheel zoom respects activationKeys (Ref #323)", () => {
      const { content, ref } = renderApp({
        wheel: { activationKeys: ["Control"] },
      });

      userEvent.hover(content);
      fireEvent(
        content,
        new WheelEvent("wheel", { bubbles: true, deltaY: -5 }),
      );
      expect(ref.current!.instance.state.scale).toBe(1);

      fireEvent.keyDown(document, { key: "Control" });
      fireEvent(
        content,
        new WheelEvent("wheel", { bubbles: true, deltaY: -5 }),
      );
      expect(ref.current!.instance.state.scale).toBeGreaterThan(1);
    });
  });

  describe("Ref #404", () => {
    it("wheel.touchPadDisabled blocks ctrl+wheel (trackpad pinch) zoom (Ref #404)", () => {
      const { content, ref } = renderApp({
        smooth: false,
        wheel: { touchPadDisabled: true },
      });

      userEvent.hover(content);
      fireEvent(
        content,
        new WheelEvent("wheel", {
          bubbles: true,
          deltaY: -40,
          ctrlKey: true,
          deltaMode: 0,
        }),
      );

      expect(ref.current!.instance.state.scale).toBe(1);
    });
  });

  describe("Ref #406", () => {
    it("wheel zoom targets the cursor position, not an arbitrary point (Ref #406)", () => {
      const { content, ref } = renderApp({
        smooth: false,
        wheel: { step: 0.2 },
        limitToBounds: false,
      });

      userEvent.hover(content);

      fireEvent(
        content,
        new WheelEvent("wheel", {
          bubbles: true,
          deltaY: -10,
          clientX: 400,
          clientY: 400,
        }),
      );
      const { positionX: x1, positionY: y1 } = ref.current!.instance.state;

      fireEvent(
        content,
        new WheelEvent("wheel", {
          bubbles: true,
          deltaY: -10,
          clientX: 400,
          clientY: 400,
        }),
      );
      const { positionX: x2, positionY: y2 } = ref.current!.instance.state;

      expect(x1).toBeLessThan(0);
      expect(y1).toBeLessThan(0);
      expect(Math.sign(x2)).toBe(Math.sign(x1));
      expect(Math.sign(y2)).toBe(Math.sign(y1));
    });
  });

  describe("Ref #431", () => {
    afterEach(() => {
      jest.useRealTimers();
    });

    it("zoomIn(step) from scale 1 lands on 1 + step (Ref #431)", () => {
      jest.useFakeTimers();
      const { ref } = renderApp({ smooth: false });

      act(() => {
        ref.current!.zoomIn(0.5, 200, "easeOut");
      });
      act(() => {
        flushAnimationFrames(80);
      });

      expect(ref.current!.instance.state.scale).toBeCloseTo(1.5, 10);
    });
  });

  describe("Ref #438", () => {
    it("ctrl+wheel zoom-out respects minScale (Ref #438)", () => {
      const { content, ref } = renderApp({
        minScale: 0.5,
        smooth: false,
        wheel: { step: 0.2 },
      });

      userEvent.hover(content);
      fireEvent(
        content,
        new WheelEvent("wheel", { bubbles: true, deltaY: -20, ctrlKey: true }),
      );
      for (let i = 0; i < 40; i++) {
        fireEvent(
          content,
          new WheelEvent("wheel", {
            bubbles: true,
            deltaY: 50,
            ctrlKey: true,
          }),
        );
        expect(ref.current!.instance.state.scale).toBeGreaterThanOrEqual(0.5);
      }
    });
  });

  describe("Ref #463", () => {
    afterEach(() => {
      jest.useRealTimers();
    });

    it("centerZoomedOut false does not force center when zoomed below 1 (Ref #463)", () => {
      jest.useFakeTimers();
      const { pan, ref } = renderApp({
        centerZoomedOut: false,
        minScale: 0.5,
        limitToBounds: true,
        velocityAnimation: { disabled: true },
      });

      act(() => {
        ref.current!.setTransform(0, 0, 0.75, 0, "easeOut");
      });

      pan({ x: 80, y: 60, moveEventCount: 1 });

      const { positionX, positionY } = ref.current!.instance.state;
      expect(Math.abs(positionX) + Math.abs(positionY)).toBeGreaterThan(1);

      act(() => {
        flushAnimationFrames(40);
        jest.advanceTimersByTime(100);
      });

      expect(ref.current!.instance.state.positionX).toBe(positionX);
      expect(ref.current!.instance.state.positionY).toBe(positionY);
    });
  });

  describe("Ref #495", () => {
    it("wheel.step changes zoom sensitivity (Ref #495)", () => {
      const run = (step: number) => {
        const { content, ref, unmount } = renderApp({
          smooth: false,
          wheel: { step },
        });
        userEvent.hover(content);
        for (let i = 0; i < 6; i++) {
          fireEvent(
            content,
            new WheelEvent("wheel", { bubbles: true, deltaY: -8 }),
          );
        }
        const scale = ref.current!.instance.state.scale;
        unmount();
        return scale;
      };

      const low = run(0.02);
      const high = run(0.12);

      expect(high).toBeGreaterThan(low);
    });
  });
});
