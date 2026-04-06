import { renderApp } from "../../utils";

describe("Positions [Max]", () => {
  describe("When setting maxPositionX", () => {
    it("should not allow panning above maxPositionX", async () => {
      const { ref, pan } = renderApp({
        maxPositionX: 50,
        limitToBounds: true,
        disablePadding: true,
      });
      ref.current!.setTransform(0, 0, 2, 0);
      pan({ x: 500, y: 0 });
      expect(ref.current!.instance.state.positionX).toBeLessThanOrEqual(50);
    });
    it("should allow panning below maxPositionX", async () => {
      const { ref, pan } = renderApp({
        maxPositionX: 200,
        limitToBounds: true,
        disablePadding: true,
      });
      ref.current!.setTransform(0, 0, 2, 0);
      pan({ x: 50, y: 0 });
      expect(ref.current!.instance.state.positionX).toBe(50);
    });
    it("should allow panning freely below maxPositionX", async () => {
      const { ref, pan } = renderApp({
        maxPositionX: 100,
        limitToBounds: true,
        disablePadding: true,
      });
      ref.current!.setTransform(0, 0, 2, 0);
      pan({ x: -50, y: 0 });
      expect(ref.current!.instance.state.positionX).toBe(-50);
    });
  });

  describe("When setting maxPositionY", () => {
    it("should not allow panning above maxPositionY", async () => {
      const { ref, pan } = renderApp({
        maxPositionY: 50,
        limitToBounds: true,
        disablePadding: true,
      });
      ref.current!.setTransform(0, 0, 2, 0);
      pan({ x: 0, y: 500 });
      expect(ref.current!.instance.state.positionY).toBeLessThanOrEqual(50);
    });
    it("should allow panning below maxPositionY", async () => {
      const { ref, pan } = renderApp({
        maxPositionY: 200,
        limitToBounds: true,
        disablePadding: true,
      });
      ref.current!.setTransform(0, 0, 2, 0);
      pan({ x: 0, y: 50 });
      expect(ref.current!.instance.state.positionY).toBe(50);
    });
  });

  describe("When setting both maxPositionX and maxPositionY", () => {
    it("should clamp both axes simultaneously", async () => {
      const { ref, pan } = renderApp({
        maxPositionX: 50,
        maxPositionY: 50,
        limitToBounds: true,
        disablePadding: true,
      });
      ref.current!.setTransform(0, 0, 2, 0);
      pan({ x: 500, y: 500 });
      expect(ref.current!.instance.state.positionX).toBeLessThanOrEqual(50);
      expect(ref.current!.instance.state.positionY).toBeLessThanOrEqual(50);
    });
  });

  describe("When setting min and max together", () => {
    it("should clamp panning to both bounds", async () => {
      const { ref, pan } = renderApp({
        minPositionX: -30,
        maxPositionX: 30,
        minPositionY: -30,
        maxPositionY: 30,
        limitToBounds: true,
        disablePadding: true,
      });
      ref.current!.setTransform(0, 0, 2, 0);

      pan({ x: 500, y: 500 });
      expect(ref.current!.instance.state.positionX).toBeLessThanOrEqual(30);
      expect(ref.current!.instance.state.positionY).toBeLessThanOrEqual(30);
    });
  });
});
