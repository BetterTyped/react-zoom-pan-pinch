import { waitFor } from "@testing-library/react";

import { renderApp } from "../../utils/render-app";

describe("Base [Rendering]", () => {
  describe("When example view has been rendered", () => {
    it("should render entire example without errors", () => {
      const { wrapper } = renderApp();

      expect(wrapper).toBeDefined();
    });
    it("should render center in button without errors", () => {
      const { centerBtn } = renderApp();

      expect(centerBtn).toBeDefined();
    });
    it("should render zoom in button without errors", () => {
      const { zoomInBtn } = renderApp();

      expect(zoomInBtn).toBeDefined();
    });
    it("should render zoom out button without errors", () => {
      const { zoomOutBtn } = renderApp();

      expect(zoomOutBtn).toBeDefined();
    });
    it("should render reset button without errors", () => {
      const { resetBtn } = renderApp();

      expect(resetBtn).toBeDefined();
    });
    it("should render transform component without errors", () => {
      const { content } = renderApp();

      expect(content).toBeDefined();
    });
  });
  describe("When example view has been rendered", () => {
    it("should render with initial scale", async () => {
      const { ref } = renderApp({
        initialScale: 2,
      });

      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBe(2);
      });
    });
    it("should render with limit initial scale to minScale", async () => {
      const { ref } = renderApp({
        initialScale: 0.1,
        minScale: 0.5,
      });

      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeGreaterThanOrEqual(0.5);
      });
    });
    it("should render with limit initial scale to maxScale", async () => {
      const { ref } = renderApp({
        initialScale: 20,
        maxScale: 5,
      });

      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeLessThanOrEqual(5);
      });
    });
    it("should center on initialization", async () => {
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
  });
});
