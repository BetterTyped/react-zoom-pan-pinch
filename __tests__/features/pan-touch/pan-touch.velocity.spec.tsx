import { waitFor } from "@testing-library/react";

import { renderApp, sleep } from "../../utils";

describe("Pan Touch [Velocity]", () => {
  describe("When panning to coords", () => {
    it("should trigger velocity", async () => {
      const { touchPan, pinch, ref } = renderApp({
        velocityAnimation: {
          disabled: false,
        },
      });
      pinch({ value: 1.5 });
      expect(ref.current?.instance.state.scale).toBeCloseTo(1.5, 1);
      const scaleAfterPinch = ref.current!.instance.state.scale;
      touchPan({ x: -10, y: -10, moveEventCount: 5 });
      expect(ref.current?.instance.state.positionX).toBeCloseTo(-10, 0);
      await waitFor(() => {
        expect(ref.current?.instance.state.positionX).not.toBeCloseTo(-10, 0);
        expect(ref.current?.instance.state.positionX).toBeLessThan(100);
        expect(ref.current?.instance.state.positionY).toBeLessThan(100);
        expect(ref.current?.instance.state.scale).toBe(scaleAfterPinch);
      });
    });
    it("should not trigger disabled velocity", async () => {
      const { touchPan, pinch, ref } = renderApp({
        velocityAnimation: {
          disabled: true,
        },
      });
      pinch({ value: 1.5 });
      expect(ref.current?.instance.state.scale).toBeCloseTo(1.5, 1);
      touchPan({ x: -10, y: -10, moveEventCount: 5 });
      const posAfterPan = ref.current!.instance.state.positionX;
      await sleep(20);
      expect(ref.current?.instance.state.positionX).toBe(posAfterPan);
    });
  });
});
