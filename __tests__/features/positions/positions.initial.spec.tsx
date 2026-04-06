import { renderApp } from "../../utils";

describe("Positions [Initial]", () => {
  describe("When setting initialPositionX", () => {
    it("should start at the specified X position", async () => {
      const { ref } = renderApp({
        initialPositionX: 50,
      });

      expect(ref.current?.instance.state.positionX).toBe(50);
    });
    it("should allow panning from initial X position", async () => {
      const { ref, pan } = renderApp({
        initialPositionX: 50,
      });

      pan({ x: -30, y: 0 });
      expect(ref.current?.instance.state.positionX).toBe(20);
    });
  });

  describe("When setting initialPositionY", () => {
    it("should start at the specified Y position", async () => {
      const { ref } = renderApp({
        initialPositionY: 50,
      });

      expect(ref.current?.instance.state.positionY).toBe(50);
    });
    it("should allow panning from initial Y position", async () => {
      const { ref, pan } = renderApp({
        initialPositionY: 50,
      });

      pan({ x: 0, y: -30 });
      expect(ref.current?.instance.state.positionY).toBe(20);
    });
  });

  describe("When setting is not fitting min-max", () => {
    it("should not allow for using lower value than minPositionX", async () => {
      const { ref } = renderApp({
        initialPositionX: -200,
        minPositionX: -50,
      });

      expect(ref.current?.instance.state.positionX).toBeGreaterThanOrEqual(-50);
    });
    it("should not allow for using higher value than maxPositionX", async () => {
      const { ref } = renderApp({
        initialPositionX: 200,
        maxPositionX: 50,
      });

      expect(ref.current?.instance.state.positionX).toBeLessThanOrEqual(50);
    });
    it("should not allow for using lower value than minPositionY", async () => {
      const { ref } = renderApp({
        initialPositionY: -200,
        minPositionY: -50,
      });

      expect(ref.current?.instance.state.positionY).toBeGreaterThanOrEqual(-50);
    });
    it("should not allow for using higher value than maxPositionY", async () => {
      const { ref } = renderApp({
        initialPositionY: 200,
        maxPositionY: 50,
      });

      expect(ref.current?.instance.state.positionY).toBeLessThanOrEqual(50);
    });
  });
});
