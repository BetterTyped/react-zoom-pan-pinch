import { waitFor } from "@testing-library/dom";

import { renderApp } from "../../utils/render-app";

describe("Pinch [Base]", () => {
  describe("When content is the same size as wrapper", () => {
    it("should change transform scale", async () => {
      const { ref, content, pinch } = renderApp();
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      pinch({ value: 1.5 });
      await waitFor(() => {
        expect(content.style.transform).toBe("translate(0px, 0px) scale(1.5)");
        expect(ref.current?.instance.state.scale).toBe(1.5);
      });
    });
    it("should zoom to the position of midpoint", async () => {
      const { ref, pinch } = renderApp();

      pinch({ value: 2, center: [100, 100] });
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeCloseTo(2, 0);
      });
      expect(ref.current?.instance.state.positionX).toBeLessThan(0);
      expect(ref.current?.instance.state.positionY).toBeLessThan(0);
    });
    it("should zoom out from position of midpoint", async () => {
      const { ref, pinch } = renderApp();

      pinch({ value: 2 });
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeCloseTo(2, 0);
      });

      pinch({ value: 1, center: [100, 100] });
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeCloseTo(1, 0);
      });
    });
    it("should return to bounds after zooming out", async () => {
      const { ref, pinch } = renderApp({
        limitToBounds: true,
        disablePadding: true,
        minScale: 0.5,
      });

      pinch({ value: 0.5 });
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeCloseTo(0.5, 0);
      });
      expect(ref.current?.instance.state.positionX).toBeGreaterThanOrEqual(0);
      expect(ref.current?.instance.state.positionY).toBeGreaterThanOrEqual(0);
    });
  });
  describe("When content bigger than wrapper", () => {
    it("should center the content", async () => {
      const { ref } = renderApp({
        wrapperWidth: "200px",
        wrapperHeight: "200px",
        contentWidth: "400px",
        contentHeight: "400px",
        centerOnInit: true,
      });

      await waitFor(() => {
        expect(ref.current?.instance.state.positionX).toBe(-100);
        expect(ref.current?.instance.state.positionY).toBe(-100);
      });
    });
    it("should change transform scale", async () => {
      const { ref, content, pinch } = renderApp({
        wrapperWidth: "200px",
        wrapperHeight: "200px",
        contentWidth: "400px",
        contentHeight: "400px",
      });

      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      pinch({ value: 1.5 });
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBe(1.5);
      });
    });
    it("should zoom to the position of midpoint", async () => {
      const { ref, pinch } = renderApp({
        wrapperWidth: "200px",
        wrapperHeight: "200px",
        contentWidth: "400px",
        contentHeight: "400px",
      });

      pinch({ value: 2, center: [100, 100] });
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeCloseTo(2, 0);
      });
      expect(ref.current?.instance.state.positionX).toBeLessThan(0);
      expect(ref.current?.instance.state.positionY).toBeLessThan(0);
    });
    it("should zoom out from position of midpoint", async () => {
      const { ref, pinch } = renderApp({
        wrapperWidth: "200px",
        wrapperHeight: "200px",
        contentWidth: "400px",
        contentHeight: "400px",
      });

      pinch({ value: 2 });
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeCloseTo(2, 0);
      });

      pinch({ value: 1, center: [100, 100] });
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeCloseTo(1, 0);
      });
    });
    it("should return to bounds after zooming out", async () => {
      const { ref, pinch } = renderApp({
        wrapperWidth: "200px",
        wrapperHeight: "200px",
        contentWidth: "400px",
        contentHeight: "400px",
        limitToBounds: true,
        disablePadding: true,
        minScale: 0.5,
      });

      pinch({ value: 0.5 });
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeCloseTo(0.5, 0);
      });
      expect(ref.current?.instance.state.positionX).toBeGreaterThanOrEqual(0);
      expect(ref.current?.instance.state.positionY).toBeGreaterThanOrEqual(0);
    });
  });
});
