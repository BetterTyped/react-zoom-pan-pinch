import { waitFor } from "@testing-library/dom";
import { renderApp } from "../../utils/render-app";

describe("Zoom [Base]", () => {
  describe("When zooming in with controls button", () => {
    it("should increase css scale with animated zoom", async () => {
      const { ref, content, zoom } = renderApp();
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      zoom({ value: 1.5 });
      await waitFor(() => {
        expect(content.style.transform).toBe("translate(0px, 0px) scale(1.5)");
        expect(ref.current?.instance.state.scale).toBe(1.5);
      });
    });
  });
});
