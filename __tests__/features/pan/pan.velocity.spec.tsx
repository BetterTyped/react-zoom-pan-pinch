import { waitFor } from "@testing-library/react";

import { renderApp, sleep } from "../../utils";

describe("Pan [Velocity]", () => {
  describe("When panning to coords", () => {
    it("should trigger velocity", async () => {
      const { content, pan, zoom, ref } = renderApp({
        velocityAnimation: {
          disabled: false,
        },
      });
      zoom({ value: 1.5 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1.5)");
      pan({ x: -10, y: -10, steps: 5 });
      expect(content.style.transform).toBe(
        "translate(-10px, -10px) scale(1.5)",
      );
      await waitFor(() => {
        expect(content.style.transform).not.toBe(
          "translate(-10px, -10px) scale(1.5)",
        );
        expect(ref.current?.instance.state.positionX).toBeLessThan(100);
        expect(ref.current?.instance.state.positionY).toBeLessThan(100);
        expect(ref.current?.instance.state.scale).toBe(1.5);
      });
    });
    it("should not trigger disabled velocity", async () => {
      const { content, pan, zoom } = renderApp({
        velocityAnimation: {
          disabled: true,
        },
      });
      zoom({ value: 1.5 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1.5)");
      pan({ x: -10, y: -10, steps: 5 });
      expect(content.style.transform).toBe(
        "translate(-10px, -10px) scale(1.5)",
      );
      await sleep(20);
      expect(content.style.transform).toBe(
        "translate(-10px, -10px) scale(1.5)",
      );
    });
  });
});
