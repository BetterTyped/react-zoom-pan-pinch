import { renderApp } from "../../utils";

describe("Positions [Min]", () => {
  describe("When setting minPositionX", () => {
    it("should not allow panning below minPositionX", async () => {
      const { ref, pan } = renderApp({
        minPositionX: -30,
        limitToBounds: true,
        disablePadding: true,
      });
      ref.current!.setTransform(0, 0, 2, 0);
      pan({ x: -500, y: 0 });
      expect(ref.current!.instance.state.positionX).toBeGreaterThanOrEqual(-30);
    });
    it("should allow panning above minPositionX", async () => {
      const { ref, pan } = renderApp({
        minPositionX: -200,
        limitToBounds: true,
        disablePadding: true,
      });
      ref.current!.setTransform(0, 0, 2, 0);
      pan({ x: -50, y: 0 });
      expect(ref.current!.instance.state.positionX).toBe(-50);
    });
    it("should allow panning freely above minPositionX", async () => {
      const { ref, pan } = renderApp({
        minPositionX: -100,
        limitToBounds: true,
        disablePadding: true,
      });
      ref.current!.setTransform(0, 0, 2, 0);
      pan({ x: 50, y: 0 });
      expect(ref.current!.instance.state.positionX).toBeGreaterThanOrEqual(0);
    });
  });

  describe("When setting minPositionY", () => {
    it("should not allow panning below minPositionY", async () => {
      const { ref, pan } = renderApp({
        minPositionY: -30,
        limitToBounds: true,
        disablePadding: true,
      });
      ref.current!.setTransform(0, 0, 2, 0);
      pan({ x: 0, y: -500 });
      expect(ref.current!.instance.state.positionY).toBeGreaterThanOrEqual(-30);
    });
    it("should allow panning above minPositionY", async () => {
      const { ref, pan } = renderApp({
        minPositionY: -200,
        limitToBounds: true,
        disablePadding: true,
      });
      ref.current!.setTransform(0, 0, 2, 0);
      pan({ x: 0, y: -50 });
      expect(ref.current!.instance.state.positionY).toBe(-50);
    });
  });

  describe("When setting both minPositionX and minPositionY", () => {
    it("should clamp both axes simultaneously", async () => {
      const { ref, pan } = renderApp({
        minPositionX: -30,
        minPositionY: -30,
        limitToBounds: true,
        disablePadding: true,
      });
      ref.current!.setTransform(0, 0, 2, 0);
      pan({ x: -500, y: -500 });
      expect(ref.current!.instance.state.positionX).toBeGreaterThanOrEqual(-30);
      expect(ref.current!.instance.state.positionY).toBeGreaterThanOrEqual(-30);
    });
  });
});
