import { waitFor } from "@testing-library/dom";
import { renderApp } from "../../utils/render-app";

describe("Pinch [Base]", () => {
  describe("When zooming in with controls button", () => {
    it("should increase css scale with animated zoom", async () => {
      const { content, pinch } = renderApp();
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      pinch({ value: 1.5 });
      await waitFor(() => {
        expect(content.style.transform).toBe(
          "translate(0px, 0px) scale(1.5012468827930179)",
        );
      });
    });
  });
});
