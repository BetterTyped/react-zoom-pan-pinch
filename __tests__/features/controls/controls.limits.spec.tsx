import { fireEvent, waitFor } from "@testing-library/react";

import { renderApp } from "../../utils/render-app";

describe("Controls [Limits]", () => {
  describe("When zooming in beyond maxScale", () => {
    it("should not exceed maxScale", async () => {
      const { ref, zoomInBtn } = renderApp({ maxScale: 2 });

      for (let i = 0; i < 10; i++) {
        fireEvent(zoomInBtn, new MouseEvent("click", { bubbles: true }));
      }

      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeGreaterThan(1);
      });
      expect(ref.current?.instance.state.scale).toBeLessThanOrEqual(2);
    });
  });

  describe("When zooming out beyond minScale", () => {
    it("should not go below custom minScale", async () => {
      const { ref, zoomOutBtn } = renderApp({
        initialScale: 2,
        minScale: 0.5,
      });

      for (let i = 0; i < 10; i++) {
        fireEvent(zoomOutBtn, new MouseEvent("click", { bubbles: true }));
      }

      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeLessThan(2);
      });
      expect(ref.current?.instance.state.scale).toBeGreaterThanOrEqual(0.5);
    });

    it("should not go below default minScale of 1", async () => {
      const { ref, zoomOutBtn } = renderApp({ initialScale: 2 });

      for (let i = 0; i < 10; i++) {
        fireEvent(zoomOutBtn, new MouseEvent("click", { bubbles: true }));
      }

      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeLessThan(2);
      });
      expect(ref.current?.instance.state.scale).toBeGreaterThanOrEqual(1);
    });
  });

  describe("When at maxScale", () => {
    it("should not increase scale further on zoomIn", async () => {
      const { ref, zoomInBtn } = renderApp({
        initialScale: 3,
        maxScale: 3,
      });

      fireEvent(zoomInBtn, new MouseEvent("click", { bubbles: true }));

      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBe(3);
      });
    });
  });

  describe("When at minScale", () => {
    it("should not decrease scale further on zoomOut", async () => {
      const { ref, zoomOutBtn } = renderApp({
        initialScale: 1,
        minScale: 1,
      });

      fireEvent(zoomOutBtn, new MouseEvent("click", { bubbles: true }));

      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBe(1);
      });
    });
  });
});
