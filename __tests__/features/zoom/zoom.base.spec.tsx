import { renderApp } from "../../utils/render-app";

describe("Zoom [Base]", () => {
  describe("When zooming in with controls button", () => {
    it("should increase css scale with animated zoom", async () => {
      const { content, zoom } = renderApp();
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      zoom({ value: 1.5 });
      expect(content.style.transform).toBe(
        "translate(0px, 0px) scale(1.5009999999999448)",
      );
    });
  });
});
