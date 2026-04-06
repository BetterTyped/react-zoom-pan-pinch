import { renderApp } from "../../utils";

describe("Positions [Base]", () => {
  describe("When content is bigger than wrapper", () => {
    describe("When rendering initially original size content", () => {
      it("should start at position 0,0", async () => {
        const { content } = renderApp({
          wrapperWidth: "100px",
          wrapperHeight: "100px",
          contentWidth: "200px",
          contentHeight: "200px",
        });
        expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      });
      it("should allow panning within bounds", async () => {
        const { content, pan } = renderApp({
          wrapperWidth: "100px",
          wrapperHeight: "100px",
          contentWidth: "200px",
          contentHeight: "200px",
          disablePadding: true,
        });
        pan({ x: -50, y: -50 });
        expect(content.style.transform).toBe(
          "translate(-50px, -50px) scale(1)",
        );
      });
      it("should clamp panning to bounds", async () => {
        const { ref, pan } = renderApp({
          wrapperWidth: "100px",
          wrapperHeight: "100px",
          contentWidth: "200px",
          contentHeight: "200px",
          disablePadding: true,
          limitToBounds: true,
        });
        pan({ x: -500, y: -500 });
        expect(ref.current!.instance.state.positionX).toBeGreaterThan(-500);
        expect(ref.current!.instance.state.positionY).toBeGreaterThan(-500);
      });
    });

    describe("When zoomed in content", () => {
      it("should allow panning within expanded bounds", async () => {
        const { ref, pan } = renderApp({
          limitToBounds: true,
          disablePadding: true,
        });
        ref.current!.setTransform(0, 0, 2);
        pan({ x: -100, y: -100 });
        expect(ref.current!.instance.state.positionX).toBe(-100);
        expect(ref.current!.instance.state.positionY).toBe(-100);
      });
      it("should limit panning to zoomed bounds", async () => {
        const { ref, pan } = renderApp({
          disablePadding: true,
          limitToBounds: true,
        });
        ref.current!.setTransform(0, 0, 2);
        pan({ x: -5000, y: -5000 });
        expect(ref.current!.instance.state.positionX).toBeGreaterThan(-5000);
        expect(ref.current!.instance.state.positionY).toBeGreaterThan(-5000);
      });
      it("should prevent panning past the right edge", () => {
        const { ref, pan } = renderApp({
          limitToBounds: true,
          disablePadding: true,
        });
        ref.current!.setTransform(0, 0, 2);
        pan({ x: 2000, y: 0 });
        expect(ref.current!.instance.state.positionX).toBeGreaterThanOrEqual(0);
        expect(ref.current!.instance.state.positionX).toBeLessThan(2000);
      });
    });

    describe("When zoomed out content", () => {
      it("should restrict panning when content fits wrapper", async () => {
        const { content, pan } = renderApp({
          wrapperWidth: "100px",
          wrapperHeight: "100px",
          contentWidth: "100px",
          contentHeight: "100px",
          disablePadding: true,
        });
        pan({ x: -100, y: -100 });
        expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      });
      it("should keep content within bounds", async () => {
        const { content, pan } = renderApp({
          wrapperWidth: "100px",
          wrapperHeight: "100px",
          contentWidth: "100px",
          contentHeight: "100px",
          disablePadding: true,
          limitToBounds: true,
        });
        pan({ x: 100, y: 100 });
        expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      });
    });
  });

  describe("When content is smaller than wrapper", () => {
    describe("When rendering initially original size content", () => {
      it("should start at default transform", async () => {
        const { content } = renderApp({
          wrapperWidth: "100px",
          wrapperHeight: "100px",
          contentWidth: "50px",
          contentHeight: "50px",
        });
        expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      });
      it("should not allow panning with disablePadding", async () => {
        const { content, pan } = renderApp({
          wrapperWidth: "100px",
          wrapperHeight: "100px",
          contentWidth: "50px",
          contentHeight: "50px",
          disablePadding: true,
        });
        pan({ x: -100, y: -100 });
        expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      });
    });

    describe("When zoomed in content", () => {
      it("should allow panning when zoomed beyond wrapper size", async () => {
        const { ref, pan } = renderApp({
          disablePadding: true,
          limitToBounds: true,
        });
        ref.current!.setTransform(0, 0, 2);
        pan({ x: -50, y: -50 });
        expect(ref.current!.instance.state.positionX).toBe(-50);
        expect(ref.current!.instance.state.positionY).toBe(-50);
      });
      it("should limit panning to bounds when zoomed", async () => {
        const { ref, pan } = renderApp({
          disablePadding: true,
          limitToBounds: true,
        });
        ref.current!.setTransform(0, 0, 2);
        pan({ x: -5000, y: -5000 });
        expect(ref.current!.instance.state.positionX).toBeGreaterThan(-5000);
        expect(ref.current!.instance.state.positionY).toBeGreaterThan(-5000);
      });
    });

    describe("When zoomed out content", () => {
      it("should not allow panning", async () => {
        const { content, pan } = renderApp({
          wrapperWidth: "100px",
          wrapperHeight: "100px",
          contentWidth: "50px",
          contentHeight: "50px",
          disablePadding: true,
          limitToBounds: true,
        });
        pan({ x: -100, y: -100 });
        expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      });
      it("should allow movement with limitToBounds disabled", async () => {
        const { content, pan } = renderApp({
          wrapperWidth: "100px",
          wrapperHeight: "100px",
          contentWidth: "50px",
          contentHeight: "50px",
          limitToBounds: false,
        });
        pan({ x: -100, y: -100 });
        expect(content.style.transform).toBe(
          "translate(-100px, -100px) scale(1)",
        );
      });
    });
  });

  describe("When content is equal to wrapper", () => {
    it("should start at position 0,0", () => {
      const { content } = renderApp({
        wrapperWidth: "100px",
        wrapperHeight: "100px",
        contentWidth: "100px",
        contentHeight: "100px",
      });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
    it("should not allow panning with disablePadding", () => {
      const { content, pan } = renderApp({
        wrapperWidth: "100px",
        wrapperHeight: "100px",
        contentWidth: "100px",
        contentHeight: "100px",
        disablePadding: true,
      });
      pan({ x: -100, y: -100 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
  });
});
