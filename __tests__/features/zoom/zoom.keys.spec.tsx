import { fireEvent } from "@testing-library/react";

import { renderApp } from "../../utils";

describe("Zoom [Keys]", () => {
  describe("When zooming with activation keys", () => {
    it("should not change translate without activation", async () => {
      const { content, zoom } = renderApp({
        wheel: {
          activationKeys: ["Control"],
        },
      });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      zoom({ value: 2 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
    it("should change translate with activated key", async () => {
      const { content, zoom } = renderApp({
        wheel: {
          activationKeys: ["Control"],
        },
      });

      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      fireEvent.keyDown(document, { key: "Control" });
      zoom({ value: 2 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(2)");
    });
  });
  describe("When zooming with multiple activation keys", () => {
    it("should not change translate when partially activated", async () => {
      const { content, zoom } = renderApp({
        wheel: {
          activationKeys: ["Control", "Shift"],
        },
      });

      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      fireEvent.keyDown(document, { key: "Control" });
      zoom({ value: 2 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
    it("should change translate when activated", async () => {
      const { content, zoom } = renderApp({
        wheel: {
          activationKeys: ["Control", "Shift"],
        },
      });

      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      fireEvent.keyDown(document, { key: "Control" });
      fireEvent.keyDown(document, { key: "Shift" });
      zoom({ value: 2 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(2)");
    });
  });

  describe("When zooming with callback activation", () => {
    it("should change translate with successful activation", async () => {
      const { content, zoom } = renderApp({
        wheel: {
          activationKeys: (keys) =>
            keys.includes("Control") && keys.includes("Shift"),
        },
      });

      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      fireEvent.keyDown(document, { key: "Control" });
      fireEvent.keyDown(document, { key: "Shift" });
      zoom({ value: 2 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(2)");
    });
    it("should not change translate with partial activation", async () => {
      const { content, zoom } = renderApp({
        wheel: {
          activationKeys: (keys) =>
            keys.includes("Control") && keys.includes("Shift"),
        },
      });

      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      fireEvent.keyDown(document, { key: "Control" });
      zoom({ value: 2 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
  });
});
