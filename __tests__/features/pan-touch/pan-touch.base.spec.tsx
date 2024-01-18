import { waitFor } from "@testing-library/react";

import { renderApp } from "../../utils/render-app";

describe("Pan Touch [Base]", () => {
  describe("When panning in with controls button", () => {
    it("should change translate css", async () => {
      const { content, pinch, touchPan } = renderApp();
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      pinch({ value: 1.5 });
      await waitFor(() => {
        expect(content.style.transform).toBe(
          "translate(0px, 0px) scale(1.5012468827930179)",
        );
      });
      touchPan({ x: 100, y: 100 });
      expect(content.style.transform).toBe(
        "translate(100px, 100px) scale(1.5012468827930179)",
      );
    });
  });
});
