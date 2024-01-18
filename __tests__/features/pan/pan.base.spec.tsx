import { waitFor } from "@testing-library/react";

import { renderApp } from "../../utils/render-app";

describe("Pan [Base]", () => {
  describe("When panning in with controls button", () => {
    it("should change translate css", async () => {
      const { content, pan, zoom } = renderApp();
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      zoom({ value: 1.5 });
      expect(content.style.transform).toBe(
        "translate(0px, 0px) scale(1.5009999999999448)",
      );
      pan({ x: 100, y: 100 });
      expect(content.style.transform).toBe(
        "translate(100px, 100px) scale(1.5009999999999448)",
      );
    });
  });
});
