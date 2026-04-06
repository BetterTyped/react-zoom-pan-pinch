import { fireEvent, waitFor } from "@testing-library/react";

import { renderApp } from "../../utils/render-app";

describe("Controls [State]", () => {
  describe("When resetting after custom initial state", () => {
    it("should return to initialScale", async () => {
      const { content, ref, zoomInBtn, resetBtn } = renderApp({
        initialScale: 1.5,
      });

      expect(content.style.transform).toBe("translate(0px, 0px) scale(1.5)");

      fireEvent(zoomInBtn, new MouseEvent("click", { bubbles: true }));
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeGreaterThan(1.5);
      });

      fireEvent(resetBtn, new MouseEvent("click", { bubbles: true }));
      await waitFor(() => {
        expect(content.style.transform).toBe("translate(0px, 0px) scale(1.5)");
      });
    });

    it("should return to initialPosition", async () => {
      const { content, resetBtn, pan } = renderApp({
        initialPositionX: 50,
        initialPositionY: 50,
        limitToBounds: false,
      });

      expect(content.style.transform).toBe("translate(50px, 50px) scale(1)");

      pan({ x: -100, y: -100 });
      expect(content.style.transform).toBe("translate(-50px, -50px) scale(1)");

      fireEvent(resetBtn, new MouseEvent("click", { bubbles: true }));
      await waitFor(() => {
        expect(content.style.transform).toBe("translate(50px, 50px) scale(1)");
      });
    });
  });

  describe("When resetting after pan and zoom", () => {
    it("should restore both position and scale to defaults", async () => {
      const { content, ref, resetBtn, zoom, pan } = renderApp();

      zoom({ value: 1.5 });
      expect(ref.current?.instance.state.scale).toBe(1.5);

      pan({ x: -100, y: -100 });

      fireEvent(resetBtn, new MouseEvent("click", { bubbles: true }));
      await waitFor(() => {
        expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      });
    });
  });

  describe("When centering after pan", () => {
    it("should reposition content to center at current scale", async () => {
      const { ref, content, centerBtn, zoom, pan } = renderApp();

      zoom({ value: 1.65 });
      expect(ref.current?.instance.state.scale).toBe(1.65);

      pan({ x: -100, y: -100 });
      expect(content.style.transform).toBe(
        "translate(-100px, -100px) scale(1.65)",
      );

      fireEvent(centerBtn, new MouseEvent("click", { bubbles: true }));
      await waitFor(() => {
        expect(content.style.transform).toBe(
          "translate(-162.5px, -162.5px) scale(1.65)",
        );
      });
    });
  });

  describe("When performing sequential operations", () => {
    it("should handle zoom in then zoom out correctly", async () => {
      const { content, zoomInBtn, zoomOutBtn } = renderApp();

      fireEvent(zoomInBtn, new MouseEvent("click", { bubbles: true }));
      await waitFor(() => {
        expect(content.style.transform).toBe(
          "translate(-162.5px, -162.5px) scale(1.65)",
        );
      });

      fireEvent(zoomOutBtn, new MouseEvent("click", { bubbles: true }));
      await waitFor(() => {
        expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      });
    });

    it("should handle zoom in, center, then reset", async () => {
      const { content, zoomInBtn, centerBtn, resetBtn } = renderApp();

      fireEvent(zoomInBtn, new MouseEvent("click", { bubbles: true }));
      await waitFor(() => {
        expect(content.style.transform).toBe(
          "translate(-162.5px, -162.5px) scale(1.65)",
        );
      });

      fireEvent(centerBtn, new MouseEvent("click", { bubbles: true }));
      await waitFor(() => {
        expect(content.style.transform).toBe(
          "translate(-162.5px, -162.5px) scale(1.65)",
        );
      });

      fireEvent(resetBtn, new MouseEvent("click", { bubbles: true }));
      await waitFor(() => {
        expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      });
    });
  });
});
