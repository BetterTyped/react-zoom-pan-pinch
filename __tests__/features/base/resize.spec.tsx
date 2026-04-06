import { renderApp } from "../../utils";

describe("Base [Resize]", () => {
  describe("When wrapper is resized", () => {
    it("should align to bounds after panning", () => {
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
    it("should keep scale after bounds enforcement", () => {
      const { ref, pan } = renderApp({
        disablePadding: true,
        limitToBounds: true,
      });

      ref.current!.setTransform(0, 0, 2);
      pan({ x: -2000, y: -2000 });

      expect(ref.current!.instance.state.scale).toBe(2);
      expect(ref.current!.instance.state.positionX).toBeGreaterThan(-2000);
    });
  });

  describe("When content dimensions change", () => {
    it("should maintain transform state", () => {
      const { ref } = renderApp({
        wrapperWidth: "200px",
        wrapperHeight: "200px",
        contentWidth: "400px",
        contentHeight: "400px",
      });

      ref.current!.setTransform(-50, -50, 1.5);
      expect(ref.current!.instance.state.scale).toBe(1.5);
      expect(ref.current!.instance.state.positionX).toBe(-50);
      expect(ref.current!.instance.state.positionY).toBe(-50);
    });
    it("should allow programmatic resetTransform", () => {
      const { ref } = renderApp();

      ref.current!.setTransform(-100, -100, 2);
      expect(ref.current!.instance.state.scale).toBe(2);

      ref.current!.resetTransform();
      expect(ref.current!.instance.state.scale).toBe(1);
      expect(ref.current!.instance.state.positionX).toBe(0);
      expect(ref.current!.instance.state.positionY).toBe(0);
    });
  });
});
