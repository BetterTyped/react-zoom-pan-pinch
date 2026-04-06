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
          { pageX: 0, pageY: 0, clientX: 0, clientY: 0, target: excluded },
          { pageX: 10, pageY: 10, clientX: 10, clientY: 10, target: excluded },
        ],
      });
      fireEvent.touchMove(excluded, {
        touches: [
          { pageX: 0, pageY: 0, clientX: 0, clientY: 0, target: excluded },
          { pageX: 30, pageY: 30, clientX: 30, clientY: 30, target: excluded },
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
    it("should not change position when pinching excluded element", async () => {
      const { wrapper, content } = renderApp({
        pinch: { excluded: ["pinchDisabled"] },
      });

      const excluded = wrapper.querySelector(".pinchDisabled") as HTMLElement;

      fireEvent.touchStart(excluded, {
        touches: [
          { pageX: 50, pageY: 50, clientX: 50, clientY: 50, target: excluded },
          {
            pageX: 100,
            pageY: 100,
            clientX: 100,
            clientY: 100,
            target: excluded,
          },
        ],
      });
      fireEvent.touchMove(excluded, {
        touches: [
          { pageX: 10, pageY: 10, clientX: 10, clientY: 10, target: excluded },
          {
            pageX: 150,
            pageY: 150,
            clientX: 150,
            clientY: 150,
            target: excluded,
          },
        ],
      });
      fireEvent.touchEnd(excluded, { touches: [] });

      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
  });

  describe("When pinch is fully disabled", () => {
    it("should not allow for pinching anywhere", async () => {
      const { ref, pinch } = renderApp({
        pinch: { disabled: true },
      });

      pinch({ value: 2 });
      expect(ref.current?.instance.state.scale).toBe(1);
    });
  });
});
