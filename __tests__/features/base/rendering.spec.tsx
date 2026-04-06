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

  describe("When rendering with initial props", () => {
    it("should render with initial scale", async () => {
      const { ref, content } = renderApp({
        initialScale: 2,
      });
      expect(ref.current!.instance.state.scale).toBe(2);
      expect(content.style.transform).toContain("scale(2)");
    });
    it("should render with limit initial scale to minScale", async () => {
      const { ref } = renderApp({
        initialScale: 0.5,
        minScale: 1,
      });
      expect(ref.current!.instance.state.scale).toBeGreaterThanOrEqual(1);
    });
    it("should render with limit initial scale to maxScale", async () => {
      const { ref } = renderApp({
        initialScale: 10,
        maxScale: 5,
      });
      expect(ref.current!.instance.state.scale).toBeLessThanOrEqual(5);
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
        expect(ref.current!.instance.state.positionX).toBe(-100);
        expect(ref.current!.instance.state.positionY).toBe(-100);
      });
    });
    it("should render with default scale of 1", () => {
      const { ref, content } = renderApp();
      expect(ref.current!.instance.state.scale).toBe(1);
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
    it("should render with default position of 0,0", () => {
      const { ref } = renderApp();
      expect(ref.current!.instance.state.positionX).toBe(0);
      expect(ref.current!.instance.state.positionY).toBe(0);
    });
    it("should render with initial position", () => {
      const { ref } = renderApp({
        initialPositionX: 10,
        initialPositionY: 20,
      });
      expect(ref.current!.instance.state.positionX).toBe(10);
      expect(ref.current!.instance.state.positionY).toBe(20);
    });
  });

  describe("When rendering DOM structure", () => {
    it("should have wrapper with correct class", () => {
      const { wrapper } = renderApp();
      expect(wrapper.className).toContain("react-transform-wrapper");
    });
    it("should have content with correct class", () => {
      const { content } = renderApp();
      expect(content.className).toContain("react-transform-component");
    });
    it("should apply wrapper style dimensions", () => {
      const { wrapper } = renderApp({
        wrapperWidth: "300px",
        wrapperHeight: "400px",
      });
      expect(wrapper.style.width).toBe("300px");
      expect(wrapper.style.height).toBe("400px");
    });
  });
});
