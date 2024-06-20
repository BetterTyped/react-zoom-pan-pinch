import { waitFor } from "@testing-library/react";

import { renderApp } from "../../utils/render-app";

describe("Pan [Base]", () => {
  describe("When panning to coords", () => {
    it("should not change translate with disabled padding", async () => {
      const { content, pan } = renderApp({
        disablePadding: true,
      });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      pan({ x: 100, y: 100 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
    it("should return to position with padding enabled", async () => {
      const { content, pan } = renderApp({
        disablePadding: false,
      });

      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      pan({ x: 100, y: 100 });
      expect(content.style.transform).toBe("translate(100px, 100px) scale(1)");
      await waitFor(() => {
        expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      });
    });
    it("should change translate css", async () => {
      const { content, pan, zoom } = renderApp();
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      zoom({ value: 1.5 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1.5)");
      pan({ x: 100, y: 100 });
      expect(content.style.transform).toBe(
        "translate(100px, 100px) scale(1.5)",
      );
    });
  });
});
