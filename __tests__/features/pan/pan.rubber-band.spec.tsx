import { act, waitFor } from "@testing-library/react";

import {
  getRubberBandPosition,
  getRubberBandSource,
  RUBBER_BAND_CONSTANT,
} from "../../../src/core/bounds/bounds.utils";
import { flushAnimationFrames, renderApp } from "../../utils";

/**
 * Wrapper 500×500, content 100% → at scale 1 the bounds are 0..0, so every
 * pan lands in the padding (`autoAlignment.sizeX/Y`, default 100 px).
 *
 * Expected stretches follow `c·x·d / (d + c·x)` with c = 0.55, d = padding:
 *   x = 100, d = 100 → 35.48    x = 200, d = 100 → 52.38
 *   x = 400, d = 100 → 68.75    x = 100, d = 200 → 43.14
 *   x = 150, d = 100 → 45.21
 */
const withAlignment = { autoAlignment: { disabled: false } };

describe("Pan [Rubber band]", () => {
  describe("rubber band curve", () => {
    it("uses the UIScrollView constant", () => {
      expect(RUBBER_BAND_CONSTANT).toBe(0.55);
    });

    it("leaves positions inside the bounds untouched", () => {
      expect(getRubberBandPosition(-120, -250, 0, 100)).toBe(-120);
      expect(getRubberBandSource(-120, -250, 0, 100)).toBe(-120);
    });

    it("stretches less the further it is pulled and never reaches the padding", () => {
      expect(getRubberBandPosition(100, -250, 0, 100)).toBeCloseTo(35.4839, 4);
      expect(getRubberBandPosition(200, -250, 0, 100)).toBeCloseTo(52.381, 3);
      expect(getRubberBandPosition(-650, -250, 0, 100)).toBeCloseTo(-318.75, 2);
      expect(getRubberBandPosition(1e6, -250, 0, 100)).toBeLessThan(100);
    });

    it("traces a stretched position back to the pointer position", () => {
      [10, 35, 60, 85].forEach((offset) => {
        const source = getRubberBandSource(offset, -250, 0, 100);
        expect(getRubberBandPosition(source, -250, 0, 100)).toBeCloseTo(
          offset,
          6,
        );
        const below = getRubberBandSource(-250 - offset, -250, 0, 100);
        expect(getRubberBandPosition(below, -250, 0, 100)).toBeCloseTo(
          -250 - offset,
          6,
        );
      });
    });

    it("clamps hard when there is no padding", () => {
      expect(getRubberBandPosition(80, -250, 0, 0)).toBe(0);
      expect(getRubberBandSource(80, -250, 0, 0)).toBe(80);
    });
  });

  describe("mouse panning past the bounds", () => {
    it("trails the pointer with growing resistance", () => {
      const first = renderApp(withAlignment);
      first.pan({ x: -100, y: -100 });
      expect(first.content.style.transform).toBe(
        "translate(-35.48px, -35.48px) scale(1)",
      );
      first.unmount();

      const second = renderApp(withAlignment);
      second.pan({ x: -400, y: 200 });
      expect(second.content.style.transform).toBe(
        "translate(-68.75px, 52.38px) scale(1)",
      );
    });

    it("never pulls the content past the padding", () => {
      const { pan, ref } = renderApp(withAlignment);
      pan({ x: -5000, y: 5000 });
      expect(ref.current?.instance.state.positionX).toBeGreaterThan(-100);
      expect(ref.current?.instance.state.positionY).toBeLessThan(100);
    });

    it("stretches up to sizeX / sizeY on each axis", () => {
      const { pan, content } = renderApp({
        autoAlignment: { disabled: false, sizeX: 200, sizeY: 100 },
      });
      pan({ x: -100, y: -100 });
      expect(content.style.transform).toBe(
        "translate(-43.14px, -35.48px) scale(1)",
      );
    });

    it("moves 1:1 inside the bounds and stretches only the overshoot", () => {
      const { pan, zoom, content } = renderApp(withAlignment);
      zoom({ value: 1.5 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1.5)");
      // Bounds at scale 1.5 are -250..0: 250 px free, 150 px of overshoot.
      pan({ x: -400, y: -100 });
      expect(content.style.transform).toBe(
        "translate(-295.21px, -100px) scale(1.5)",
      );
    });

    it("continues from a stretched position without jumping", () => {
      const { pan, content } = renderApp(withAlignment);
      pan({ x: -100, y: 0 });
      expect(content.style.transform).toBe("translate(-35.48px, 0px) scale(1)");
      // Grabbed again before the return animation ran: the pointer side of
      // the band picks up at -100, so another -100 lands where -200 would.
      pan({ x: -100, y: 0 });
      expect(content.style.transform).toBe("translate(-52.38px, 0px) scale(1)");
    });

    it("returns to the bounds on release", async () => {
      const { pan, content } = renderApp(withAlignment);
      pan({ x: -100, y: 100 });
      await waitFor(() => {
        expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      });
    });
  });

  describe("touch panning past the bounds", () => {
    it("stretches like a mouse pan", () => {
      const { touchPan, content } = renderApp(withAlignment);
      touchPan({ x: -100, y: 200 });
      expect(content.style.transform).toBe(
        "translate(-35.48px, 52.38px) scale(1)",
      );
    });
  });

  describe("trackpad panning past the bounds", () => {
    it("stretches like a drag of the summed deltas", () => {
      const { trackPadPan, ref } = renderApp({
        ...withAlignment,
        wheel: { disabled: true },
        trackPadPanning: { disabled: false },
      });
      trackPadPan({ x: -100, y: 0, moveEventCount: 4 });
      expect(ref.current?.instance.state.positionX).toBeCloseTo(-35.48, 1);
      expect(ref.current?.instance.state.positionY).toBe(0);
    });
  });

  describe("without autoAlignment", () => {
    it("follows the pointer 1:1 and stops at the padding edge", () => {
      const first = renderApp({ autoAlignment: { disabled: true } });
      first.pan({ x: -60, y: 60 });
      expect(first.content.style.transform).toBe(
        "translate(-60px, 60px) scale(1)",
      );
      first.unmount();

      const second = renderApp({ autoAlignment: { disabled: true } });
      second.pan({ x: -150, y: 150 });
      expect(second.content.style.transform).toBe(
        "translate(-100px, 100px) scale(1)",
      );
    });
  });

  describe("velocity after a stretched release", () => {
    afterEach(() => {
      jest.useRealTimers();
    });

    it("keeps the fling inside the padding and settles on the bound", () => {
      jest.useFakeTimers();
      const positions: number[] = [];
      const { pan, zoom, content } = renderApp({
        ...withAlignment,
        velocityAnimation: { disabled: false },
        onTransform: (_, state) => {
          positions.push(state.positionX);
        },
      });
      zoom({ value: 1.5 });
      pan({ x: -400, y: 0, moveEventCount: 10 });
      act(() => {
        flushAnimationFrames(120);
      });

      // Bound at -250, padding 100 px: the fling may overshoot up to -350,
      // not a share of the 500 px wrapper.
      expect(Math.min(...positions)).toBeGreaterThanOrEqual(-350);
      expect(content.style.transform).toBe("translate(-250px, 0px) scale(1.5)");
    });
  });
});
