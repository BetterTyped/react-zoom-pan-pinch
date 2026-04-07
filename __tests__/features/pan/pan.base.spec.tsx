import { waitFor } from "@testing-library/react";

import { renderApp, sleep } from "../../utils";

describe("Pan [Base]", () => {
  describe("When panning to coords", () => {
    it("should not change translate with disabled padding", async () => {
      const { content, pan } = renderApp({
        disablePadding: true,
      });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      pan({ x: -100, y: -100 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
    it("should return to position with padding enabled", async () => {
      const { content, pan } = renderApp({
        disablePadding: false,
        autoAlignment: {
          disabled: false,
        },
      });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      pan({ x: -100, y: -100 });
      expect(content.style.transform).toBe(
        "translate(-100px, -100px) scale(1)",
      );
      await waitFor(() => {
        expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      });
    });
    it("should change translate css when zoomed", async () => {
      const { content, pan, zoom } = renderApp();
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      zoom({ value: 1.5 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1.5)");
      pan({ x: -100, y: -100 });
      await sleep(10);
      expect(content.style.transform).toBe(
        "translate(-100px, -100px) scale(1.5)",
      );
    });
  });

  describe("When locked axis", () => {
    it("should not change x axis transform", async () => {
      const { content, pan } = renderApp({
        panning: {
          lockAxisX: true,
        },
      });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      pan({ x: -100, y: -100 });
      expect(content.style.transform).toBe("translate(0px, -100px) scale(1)");
    });
    it("should not change y axis transform", async () => {
      const { content, pan } = renderApp({
        panning: {
          lockAxisY: true,
        },
      });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      pan({ x: -100, y: -100 });
      expect(content.style.transform).toBe("translate(-100px, 0px) scale(1)");
    });
  });

  describe("When disabled", () => {
    it("should not change transform", async () => {
      const { content, pan } = renderApp({
        disabled: true,
      });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      pan({ x: -100, y: -100 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
    it("should not change transform", async () => {
      const { content, pan } = renderApp({
        panning: {
          disabled: true,
        },
      });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      pan({ x: -100, y: -100 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
  });
});
