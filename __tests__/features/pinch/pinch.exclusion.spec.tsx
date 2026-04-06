import { fireEvent } from "@testing-library/react";

import { renderApp } from "../../utils";

describe("Pinch [Exclusion]", () => {
  describe("When excluding element", () => {
    it("should not allow for pinching on excluded element", async () => {
      const { wrapper, ref } = renderApp({
        pinch: { excluded: ["pinchDisabled"] },
      });

      const excluded = wrapper.querySelector(".pinchDisabled") as HTMLElement;

      fireEvent.touchStart(excluded, {
        touches: [
          { clientX: 0, clientY: 0, pageX: 0, pageY: 0, target: excluded },
          {
            clientX: 50,
            clientY: 50,
            pageX: 50,
            pageY: 50,
            target: excluded,
          },
        ],
      });
      fireEvent.touchMove(excluded, {
        touches: [
          {
            clientX: -20,
            clientY: -20,
            pageX: -20,
            pageY: -20,
            target: excluded,
          },
          {
            clientX: 70,
            clientY: 70,
            pageX: 70,
            pageY: 70,
            target: excluded,
          },
        ],
      });
      fireEvent.touchEnd(excluded, { touches: [] });

      expect(ref.current?.instance.state.scale).toBe(1);
    });
    it("should allow pinching on other elements", async () => {
      const { ref, pinch } = renderApp({
        pinch: { excluded: ["pinchDisabled"] },
      });

      pinch({ value: 1.5 });
      expect(ref.current?.instance.state.scale).toBeGreaterThan(1);
    });
  });
});
