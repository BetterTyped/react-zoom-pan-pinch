import { renderApp } from "../../utils";

describe("Positions [Max]", () => {
  describe("When setting maxPositionX", () => {
    it("should not pan above maxPositionX when zoomed", async () => {
      const { ref, pan } = renderApp({
        maxPositionX: 100,
        limitToBounds: true,
        disablePadding: true,
      });

      ref.current!.setTransform(0, 0, 2);
      pan({ x: 500, y: 0 });
      expect(ref.current?.instance.state.positionX).toBeLessThanOrEqual(100);
    });
    it("should allow panning below maxPositionX", async () => {
      const { ref, pan } = renderApp({
        maxPositionX: 100,
        limitToBounds: true,
        disablePadding: true,
      });

      ref.current!.setTransform(0, 0, 2);
      pan({ x: 50, y: 0 });
      expect(ref.current?.instance.state.positionX).toBeLessThanOrEqual(100);
    });
  });

  describe("When setting maxPositionY", () => {
    it("should not pan above maxPositionY when zoomed", async () => {
      const { ref, pan } = renderApp({
        maxPositionY: 100,
        limitToBounds: true,
        disablePadding: true,
      });

      ref.current!.setTransform(0, 0, 2);
      pan({ x: 0, y: 500 });
      expect(ref.current?.instance.state.positionY).toBeLessThanOrEqual(100);
    });
    it("should allow panning below maxPositionY", async () => {
      const { ref, pan } = renderApp({
        maxPositionY: 100,
        limitToBounds: true,
        disablePadding: true,
      });

      ref.current!.setTransform(0, 0, 2);
      pan({ x: 0, y: 50 });
      expect(ref.current?.instance.state.positionY).toBeLessThanOrEqual(100);
    });
  });
});
