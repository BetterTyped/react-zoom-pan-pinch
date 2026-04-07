import { waitFor } from "@testing-library/react";

import { renderApp } from "../../utils";

describe("ReactZoomPanPinchProps.autoAlignment", () => {
  describe("autoAlignment.disabled", () => {
    it("does not snap back after overscroll when disabled", () => {
      const { pan, content } = renderApp({
        autoAlignment: { disabled: true },
        disablePadding: false,
      });
      pan({ x: -100, y: -100 });
      expect(content.style.transform).toBe(
        "translate(-100px, -100px) scale(1)",
      );
    });

    it("snaps back after overscroll when enabled", async () => {
      const { pan, content } = renderApp({
        autoAlignment: { disabled: false },
        disablePadding: false,
      });
      pan({ x: -100, y: -100 });
      expect(content.style.transform).toBe(
        "translate(-100px, -100px) scale(1)",
      );
      await waitFor(() => {
        expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      });
    });
  });

  describe("autoAlignment.sizeX", () => {
    it("accepts sizeX without crashing", () => {
      const { ref } = renderApp({
        autoAlignment: { disabled: false, sizeX: 50 },
      });
      expect(ref.current).not.toBeNull();
    });
  });

  describe("autoAlignment.sizeY", () => {
    it("accepts sizeY without crashing", () => {
      const { ref } = renderApp({
        autoAlignment: { disabled: false, sizeY: 50 },
      });
      expect(ref.current).not.toBeNull();
    });
  });

  describe("autoAlignment.animationTime", () => {
    it("accepts animationTime without crashing", () => {
      const { ref } = renderApp({
        autoAlignment: { disabled: false, animationTime: 200 },
      });
      expect(ref.current).not.toBeNull();
    });
  });

  describe("autoAlignment.velocityAlignmentTime", () => {
    it("accepts velocityAlignmentTime without crashing", () => {
      const { ref } = renderApp({
        autoAlignment: { disabled: false, velocityAlignmentTime: 100 },
      });
      expect(ref.current).not.toBeNull();
    });
  });

  describe("autoAlignment.animationType", () => {
    it("accepts easeOut animation type", () => {
      const { ref } = renderApp({
        autoAlignment: { disabled: false, animationType: "easeOut" },
      });
      expect(ref.current).not.toBeNull();
    });
  });
});
