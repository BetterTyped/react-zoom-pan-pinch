import { fireEvent, waitFor } from "@testing-library/react";

import { renderApp } from "../../utils/render-app";

describe("Controls [Reset + centerOnInit]", () => {
  describe("When resetTransform is called with centerOnInit enabled", () => {
    it("should restore the centered position at initial scale", async () => {
      const { ref, resetBtn, zoom } = renderApp({
        wrapperWidth: "200px",
        wrapperHeight: "200px",
        contentWidth: "100px",
        contentHeight: "100px",
        centerOnInit: true,
      });

      await waitFor(() => {
        expect(ref.current?.instance.state.positionX).toBe(50);
        expect(ref.current?.instance.state.positionY).toBe(50);
      });

      zoom({ value: 2 });
      expect(ref.current?.instance.state.scale).toBe(2);

      fireEvent(resetBtn, new MouseEvent("click", { bubbles: true }));

      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBe(1);
        expect(ref.current?.instance.state.positionX).toBe(50);
        expect(ref.current?.instance.state.positionY).toBe(50);
      });
    });

    it("should restore centered position after panning", async () => {
      const { ref, resetBtn, pan } = renderApp({
        wrapperWidth: "200px",
        wrapperHeight: "200px",
        contentWidth: "400px",
        contentHeight: "400px",
        centerOnInit: true,
        initialScale: 0.5,
        minScale: 0.2,
      });

      await waitFor(() => {
        const posX = ref.current?.instance.state.positionX ?? 0;
        const posY = ref.current?.instance.state.positionY ?? 0;
        expect(posX).toBe(0);
        expect(posY).toBe(0);
      });

      pan({ x: -50, y: -50 });

      fireEvent(resetBtn, new MouseEvent("click", { bubbles: true }));

      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBe(0.5);
        expect(ref.current?.instance.state.positionX).toBe(0);
        expect(ref.current?.instance.state.positionY).toBe(0);
      });
    });

    it("should NOT center when centerOnInit is false", async () => {
      const { ref, resetBtn, zoom } = renderApp({
        wrapperWidth: "200px",
        wrapperHeight: "200px",
        contentWidth: "100px",
        contentHeight: "100px",
        centerOnInit: false,
      });

      expect(ref.current?.instance.state.positionX).toBe(0);
      expect(ref.current?.instance.state.positionY).toBe(0);

      zoom({ value: 2 });

      fireEvent(resetBtn, new MouseEvent("click", { bubbles: true }));

      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBe(1);
        expect(ref.current?.instance.state.positionX).toBe(0);
        expect(ref.current?.instance.state.positionY).toBe(0);
      });
    });
  });
});
