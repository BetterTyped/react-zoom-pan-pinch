import { renderApp } from "../../utils";

describe("Positions [Base]", () => {
  describe("When content is bigger than wrapper", () => {
    describe("When rendering initially original size content", () => {
      it("should start at default position", async () => {
        const { ref } = renderApp({
          wrapperWidth: "200px",
          wrapperHeight: "200px",
          contentWidth: "400px",
          contentHeight: "400px",
        });

        expect(ref.current?.instance.state.positionX).toBe(0);
        expect(ref.current?.instance.state.positionY).toBe(0);
      });
      it("should allow panning within bounds", async () => {
        const { ref, pan } = renderApp({
          wrapperWidth: "200px",
          wrapperHeight: "200px",
          contentWidth: "400px",
          contentHeight: "400px",
          disablePadding: true,
        });

        pan({ x: -100, y: -100 });
        expect(ref.current?.instance.state.positionX).toBe(-100);
        expect(ref.current?.instance.state.positionY).toBe(-100);
      });
    });

    describe("When zoomed in content", () => {
      it("should allow panning when zoomed in", async () => {
        const { ref, pan, zoom } = renderApp({
          wrapperWidth: "200px",
          wrapperHeight: "200px",
          contentWidth: "400px",
          contentHeight: "400px",
          disablePadding: true,
        });

        zoom({ value: 2 });
        pan({ x: -100, y: -100 });
        expect(ref.current?.instance.state.positionX).toBe(-100);
        expect(ref.current?.instance.state.positionY).toBe(-100);
      });
      it("should respect bounds when zoomed in", async () => {
        const { ref, pan, zoom } = renderApp({
          wrapperWidth: "200px",
          wrapperHeight: "200px",
          contentWidth: "400px",
          contentHeight: "400px",
          disablePadding: true,
          limitToBounds: true,
        });

        zoom({ value: 2 });
        pan({ x: 500, y: 500 });
        expect(ref.current?.instance.state.positionX).toBeLessThan(500);
        expect(ref.current?.instance.state.positionY).toBeLessThan(500);
      });
    });

    describe("When zoomed out content", () => {
      it("should not allow panning below scale 1 with disablePadding", async () => {
        const { content, pan } = renderApp({
          wrapperWidth: "200px",
          wrapperHeight: "200px",
          contentWidth: "400px",
          contentHeight: "400px",
          disablePadding: true,
          minScale: 0.5,
          initialScale: 0.5,
        });

        pan({ x: -100, y: -100 });
        expect(content.style.transform).toBe("translate(0px, 0px) scale(0.5)");
      });
      it("should keep position at bounds when zoomed out", async () => {
        const { ref } = renderApp({
          wrapperWidth: "200px",
          wrapperHeight: "200px",
          contentWidth: "400px",
          contentHeight: "400px",
          disablePadding: true,
          limitToBounds: true,
          minScale: 0.5,
          initialScale: 0.5,
        });

        expect(ref.current?.instance.state.positionX).toBeGreaterThanOrEqual(0);
        expect(ref.current?.instance.state.positionY).toBeGreaterThanOrEqual(0);
      });
    });
  });
  describe("When content is smaller than wrapper", () => {
    describe("When rendering initially original size content", () => {
      it("should start at default position", async () => {
        const { ref } = renderApp({
          wrapperWidth: "200px",
          wrapperHeight: "200px",
          contentWidth: "100px",
          contentHeight: "100px",
        });

        expect(ref.current?.instance.state.positionX).toBe(0);
        expect(ref.current?.instance.state.positionY).toBe(0);
      });
      it("should not allow panning with disablePadding", async () => {
        const { content, pan } = renderApp({
          wrapperWidth: "200px",
          wrapperHeight: "200px",
          contentWidth: "100px",
          contentHeight: "100px",
          disablePadding: true,
        });

        pan({ x: -100, y: -100 });
        expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      });
    });

    describe("When zoomed in content", () => {
      it("should allow panning when content exceeds wrapper after zoom", async () => {
        const { ref, pan, zoom } = renderApp({
          wrapperWidth: "200px",
          wrapperHeight: "200px",
          contentWidth: "100px",
          contentHeight: "100px",
        });

        zoom({ value: 3 });
        pan({ x: -50, y: -50 });
        expect(ref.current?.instance.state.positionX).toBe(-50);
        expect(ref.current?.instance.state.positionY).toBe(-50);
      });
      it("should respect bounds when zoomed in", async () => {
        const { ref, pan, zoom } = renderApp({
          wrapperWidth: "200px",
          wrapperHeight: "200px",
          contentWidth: "100px",
          contentHeight: "100px",
          disablePadding: true,
          limitToBounds: true,
        });

        zoom({ value: 3 });
        pan({ x: 500, y: 500 });
        expect(ref.current?.instance.state.positionX).toBeLessThan(500);
      });
    });

    describe("When zoomed out content", () => {
      it("should not allow panning with disablePadding", async () => {
        const { content, pan } = renderApp({
          wrapperWidth: "200px",
          wrapperHeight: "200px",
          contentWidth: "100px",
          contentHeight: "100px",
          disablePadding: true,
          minScale: 0.5,
          initialScale: 0.5,
        });

        pan({ x: -100, y: -100 });
        expect(content.style.transform).toBe("translate(0px, 0px) scale(0.5)");
      });
      it("should keep content within wrapper bounds", async () => {
        const { ref } = renderApp({
          wrapperWidth: "200px",
          wrapperHeight: "200px",
          contentWidth: "100px",
          contentHeight: "100px",
          disablePadding: true,
          limitToBounds: true,
          minScale: 0.5,
          initialScale: 0.5,
        });

        expect(ref.current?.instance.state.positionX).toBeGreaterThanOrEqual(0);
        expect(ref.current?.instance.state.positionY).toBeGreaterThanOrEqual(0);
      });
    });
  });
});
