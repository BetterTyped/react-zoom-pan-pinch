import { renderApp } from "../../utils";

describe("Positions [Min]", () => {
  describe("When setting minPositionX", () => {
    it("should not pan below minPositionX when zoomed", async () => {
      const { ref, pan } = renderApp({
        minPositionX: -100,
        limitToBounds: true,
        disablePadding: true,
      });

      ref.current!.setTransform(0, 0, 2);
      pan({ x: -500, y: 0 });
      expect(ref.current?.instance.state.positionX).toBeGreaterThanOrEqual(
        -100,
      );
    });
    it("should allow panning above minPositionX", async () => {
      const { ref, pan } = renderApp({
        minPositionX: -100,
        limitToBounds: true,
        disablePadding: true,
      });

      ref.current!.setTransform(0, 0, 2);
      pan({ x: -50, y: 0 });
      expect(ref.current?.instance.state.positionX).toBeGreaterThanOrEqual(
        -100,
      );
    });
  });

  describe("When setting minPositionY", () => {
    it("should not pan below minPositionY when zoomed", async () => {
      const { ref, pan } = renderApp({
        minPositionY: -100,
        limitToBounds: true,
        disablePadding: true,
      });

      ref.current!.setTransform(0, 0, 2);
      pan({ x: 0, y: -500 });
      expect(ref.current?.instance.state.positionY).toBeGreaterThanOrEqual(
        -100,
      );
    });
    it("should allow panning above minPositionY", async () => {
      const { ref, pan } = renderApp({
        minPositionY: -100,
        limitToBounds: true,
        disablePadding: true,
      });

      ref.current!.setTransform(0, 0, 2);
      pan({ x: 0, y: -50 });
      expect(ref.current?.instance.state.positionY).toBeGreaterThanOrEqual(
        -100,
      );
    });
  });
});
