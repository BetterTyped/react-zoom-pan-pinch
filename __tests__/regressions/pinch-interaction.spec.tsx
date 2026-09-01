import { fireEvent } from "@testing-library/react";

import { renderApp } from "../utils";

const twoFingerTouches = (
  el: HTMLElement,
  cx: number,
  cy: number,
  halfSpan: number,
) =>
  [
    {
      pageX: cx - halfSpan,
      pageY: cy - halfSpan,
      clientX: cx - halfSpan,
      clientY: cy - halfSpan,
      target: el,
    },
    {
      pageX: cx + halfSpan,
      pageY: cy + halfSpan,
      clientX: cx + halfSpan,
      clientY: cy + halfSpan,
      target: el,
    },
  ] as unknown as Touch[];

const fixedSpreadPinch = (
  content: HTMLElement,
  startHalf: number,
  endHalf: number,
) => {
  const cx = 250;
  const cy = 250;
  fireEvent.touchStart(content, {
    touches: twoFingerTouches(content, cx, cy, startHalf),
  });
  fireEvent.touchMove(content, {
    touches: twoFingerTouches(content, cx, cy, endHalf),
  });
  fireEvent.touchEnd(content, { touches: [], changedTouches: [] });
};

/** Two fingers keep their distance and move together: a pure pinch-pan. */
const twoFingerDrag = (
  content: HTMLElement,
  from: [number, number],
  to: [number, number],
  halfSpan = 40,
) => {
  fireEvent.touchStart(content, {
    touches: twoFingerTouches(content, from[0], from[1], halfSpan),
  });
  fireEvent.touchMove(content, {
    touches: twoFingerTouches(content, to[0], to[1], halfSpan),
  });
};

describe("pinch regressions", () => {
  it("different pinch.step values change scale proportionally for the same finger movement (Ref #418)", () => {
    const stepLow = 1;
    const stepHigh = 2;
    const {
      content: c1,
      ref: r1,
      unmount: u1,
    } = renderApp({
      pinch: { step: stepLow },
      maxScale: 100,
      limitToBounds: false,
    });
    fixedSpreadPinch(c1, 30, 90);
    const scaleLow = r1.current!.instance.state.scale;
    u1();

    const { content: c2, ref: r2 } = renderApp({
      pinch: { step: stepHigh },
      maxScale: 100,
      limitToBounds: false,
    });
    fixedSpreadPinch(c2, 30, 90);
    const scaleHigh = r2.current!.instance.state.scale;

    const dLow = Math.abs(scaleLow - 1);
    const dHigh = Math.abs(scaleHigh - 1);
    expect(dLow).toBeGreaterThan(0.001);
    expect(dHigh).toBeGreaterThan(0.001);
    expect(dHigh / dLow).toBeCloseTo(stepHigh / stepLow, 0);
  });

  describe("Ref #423", () => {
    // Constant finger distance keeps the scale, so the only thing that can
    // move the content is the pinch-pan branch.
    it("pinch.allowPanning true moves the content with the finger pair (Ref #423)", () => {
      const { content, ref } = renderApp({
        pinch: { allowPanning: true },
        limitToBounds: false,
      });

      twoFingerDrag(content, [200, 200], [280, 260]);

      expect(ref.current!.instance.state.scale).toBe(1);
      expect(ref.current!.instance.state.positionX).toBeCloseTo(80, 5);
      expect(ref.current!.instance.state.positionY).toBeCloseTo(60, 5);
    });

    it("pinch.allowPanning false ignores the finger pair movement (Ref #423)", () => {
      const { content, ref } = renderApp({
        pinch: { allowPanning: false },
        limitToBounds: false,
      });

      twoFingerDrag(content, [200, 200], [280, 260]);

      expect(ref.current!.instance.state.scale).toBe(1);
      expect(ref.current!.instance.state.positionX).toBe(0);
      expect(ref.current!.instance.state.positionY).toBe(0);
    });

    it("panning.disabled also blocks the pinch-pan (Ref #423)", () => {
      const { content, ref } = renderApp({
        pinch: { allowPanning: true },
        panning: { disabled: true },
        limitToBounds: false,
      });

      twoFingerDrag(content, [200, 200], [280, 260]);

      expect(ref.current!.instance.state.positionX).toBe(0);
      expect(ref.current!.instance.state.positionY).toBe(0);
    });
  });

  it("pinch initializes when both fingers start in one touchstart (Ref #487)", () => {
    const { content, ref } = renderApp({ limitToBounds: false });
    const cx = 250;
    const cy = 250;
    fireEvent.touchStart(content, {
      touches: twoFingerTouches(content, cx, cy, 40),
    });
    fireEvent.touchMove(content, {
      touches: twoFingerTouches(content, cx, cy, 120),
    });
    expect(ref.current!.instance.state.scale).toBeGreaterThan(1);
  });

  describe("Ref #498", () => {
    // A touchpad pinch reaches the browser as a ctrl+wheel event, so the
    // library routes it through the wheel handler. The `pinch.*` props and
    // onPinch* callbacks are touch-only; `wheel.touchPadDisabled` and
    // `wheel.step` are the knobs for touchpad pinch. These tests pin that
    // documented split rather than pretend `pinch.*` applies.
    const trackpadPinch = (content: HTMLElement) =>
      fireEvent(
        content,
        new WheelEvent("wheel", { bubbles: true, deltaY: -40, ctrlKey: true }),
      );

    it("touchpad pinch fires the zoom callbacks, not the pinch callbacks (Ref #498)", () => {
      const onZoomStart = jest.fn();
      const onZoom = jest.fn();
      const onPinchStart = jest.fn();
      const onPinch = jest.fn();
      const { content, ref } = renderApp({
        onZoomStart,
        onZoom,
        onPinchStart,
        onPinch,
      });

      trackpadPinch(content);

      expect(ref.current!.instance.state.scale).toBeGreaterThan(1);
      expect(onZoomStart).toHaveBeenCalledTimes(1);
      expect(onZoom).toHaveBeenCalledTimes(1);
      expect(onPinchStart).not.toHaveBeenCalled();
      expect(onPinch).not.toHaveBeenCalled();
    });

    it("pinch.disabled does not affect touchpad pinch; wheel.touchPadDisabled does (Ref #498)", () => {
      const viaPinch = renderApp({ pinch: { disabled: true } });
      trackpadPinch(viaPinch.content);
      expect(viaPinch.ref.current!.instance.state.scale).toBeGreaterThan(1);
      viaPinch.unmount();

      const viaWheel = renderApp({ wheel: { touchPadDisabled: true } });
      trackpadPinch(viaWheel.content);
      expect(viaWheel.ref.current!.instance.state.scale).toBe(1);
    });

    it("wheel.step, not pinch.step, sets the touchpad pinch sensitivity (Ref #498)", () => {
      const run = (props: Parameters<typeof renderApp>[0]) => {
        const { content, ref, unmount } = renderApp(props);
        trackpadPinch(content);
        const { scale } = ref.current!.instance.state;
        unmount();
        return scale;
      };

      const base = run({});
      expect(run({ pinch: { step: 50 } })).toBe(base);
      expect(run({ wheel: { step: 0.03 } })).toBeGreaterThan(base);
    });
  });

  it("panning.excluded does not block pinch on that element (Ref #547)", () => {
    const { content, ref } = renderApp({
      panning: { excluded: ["pinchDisabled"] },
      limitToBounds: false,
    });
    const pinchTarget = content.querySelector(".pinchDisabled") as HTMLElement;
    expect(pinchTarget).toBeTruthy();
    const cx = 250;
    const cy = 250;
    fireEvent.touchStart(pinchTarget, {
      touches: twoFingerTouches(pinchTarget, cx, cy, 35),
    });
    fireEvent.touchMove(pinchTarget, {
      touches: twoFingerTouches(pinchTarget, cx, cy, 95),
    });
    expect(ref.current!.instance.state.scale).toBeGreaterThan(1);
  });
});
