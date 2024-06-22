import { fireEvent } from "@testing-library/react";

import { renderApp } from "../../utils";

describe("Pan [Keys]", () => {
  describe("When panning with activation keys", () => {
    it("should not change translate without activation", async () => {
      const { content, pan } = renderApp({
        panning: {
          activationKeys: ["Control"],
        },
      });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      pan({ x: -100, y: -100 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
    it("should change translate with activated key", async () => {
      const { content, pan } = renderApp({
        panning: {
          activationKeys: ["Control"],
        },
      });

      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      fireEvent.keyDown(document, { key: "Control" });
      pan({ x: -100, y: -100 });
      expect(content.style.transform).toBe(
        "translate(-100px, -100px) scale(1)",
      );
    });
  });
  describe("When panning with multiple activation keys", () => {
    it("should not change translate when partially activated", async () => {
      const { content, pan } = renderApp({
        panning: {
          activationKeys: ["Control", "Shift"],
        },
      });

      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      fireEvent.keyDown(document, { key: "Control" });
      pan({ x: -100, y: -100 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
    it("should change translate when activated", async () => {
      const { content, pan } = renderApp({
        panning: {
          activationKeys: ["Control", "Shift"],
        },
      });

      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      fireEvent.keyDown(document, { key: "Control" });
      fireEvent.keyDown(document, { key: "Shift" });
      pan({ x: -100, y: -100 });
      expect(content.style.transform).toBe(
        "translate(-100px, -100px) scale(1)",
      );
    });
  });

  describe("When panning with callback activation", () => {
    it("should change translate with successful activation", async () => {
      const { content, pan } = renderApp({
        panning: {
          activationKeys: (keys) =>
            keys.includes("Control") && keys.includes("Shift"),
        },
      });

      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      fireEvent.keyDown(document, { key: "Control" });
      fireEvent.keyDown(document, { key: "Shift" });
      pan({ x: -100, y: -100 });
      expect(content.style.transform).toBe(
        "translate(-100px, -100px) scale(1)",
      );
    });
    it("should not change translate with partial activation", async () => {
      const { content, pan } = renderApp({
        panning: {
          activationKeys: (keys) =>
            keys.includes("Control") && keys.includes("Shift"),
        },
      });

      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      fireEvent.keyDown(document, { key: "Control" });
      pan({ x: -100, y: -100 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
  });
});
