import { waitFor, fireEvent } from "@testing-library/react";

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

  it("pinch with allowPanning updates position when the touch center shifts (Ref #423)", () => {
    const { pinch, ref } = renderApp({
      pinch: { allowPanning: true },
      limitToBounds: false,
    });
    const beforeX = ref.current!.instance.state.positionX;
    const beforeY = ref.current!.instance.state.positionY;
    pinch({
      value: 1.4,
      center: [200, 200],
      targetCenter: [280, 260],
    });
    const { positionX, positionY } = ref.current!.instance.state;
    expect(positionX === beforeX && positionY === beforeY).toBe(false);
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

  it("touchpad pinch (ctrl+wheel) triggers the zoom start path (Ref #498)", async () => {
    const onZoomStart = jest.fn();
    const onPinchStart = jest.fn();
    const { content } = renderApp({
      onZoomStart,
      onPinchStart,
      wheel: { touchPadDisabled: false },
    });
    fireEvent(
      content,
      new WheelEvent("wheel", {
        bubbles: true,
        deltaY: -40,
        ctrlKey: true,
      }),
    );
    await waitFor(() => {
      expect(onZoomStart).toHaveBeenCalled();
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
