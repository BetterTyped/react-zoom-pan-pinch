import { renderApp } from "../../utils";

describe("Positions [Initial]", () => {
  describe("When setting initialPositionX", () => {
    it("should start at the specified X position", async () => {
      const { ref } = renderApp({
        initialPositionX: 50,
      });
      expect(ref.current!.instance.state.positionX).toBe(50);
    });
    it("should preserve Y at default when only X is set", async () => {
      const { ref } = renderApp({
        initialPositionX: 50,
      });
      expect(ref.current!.instance.state.positionY).toBe(0);
    });
    it("should apply negative initialPositionX", async () => {
      const { ref } = renderApp({
        initialPositionX: -30,
      });
      expect(ref.current!.instance.state.positionX).toBe(-30);
    });
  });

  describe("When setting initialPositionY", () => {
    it("should start at the specified Y position", async () => {
      const { ref } = renderApp({
        initialPositionY: 50,
      });
      expect(ref.current!.instance.state.positionY).toBe(50);
    });
    it("should preserve X at default when only Y is set", async () => {
      const { ref } = renderApp({
        initialPositionY: 50,
      });
      expect(ref.current!.instance.state.positionX).toBe(0);
    });
    it("should apply negative initialPositionY", async () => {
      const { ref } = renderApp({
        initialPositionY: -30,
      });
      expect(ref.current!.instance.state.positionY).toBe(-30);
    });
  });

  describe("When setting both initial positions", () => {
    it("should apply both X and Y", async () => {
      const { ref } = renderApp({
        initialPositionX: 25,
        initialPositionY: 75,
      });
      expect(ref.current!.instance.state.positionX).toBe(25);
      expect(ref.current!.instance.state.positionY).toBe(75);
    });
    it("should apply with initialScale", async () => {
      const { ref } = renderApp({
        initialPositionX: 10,
        initialPositionY: 20,
        initialScale: 2,
      });
      expect(ref.current!.instance.state.positionX).toBe(10);
      expect(ref.current!.instance.state.positionY).toBe(20);
      expect(ref.current!.instance.state.scale).toBe(2);
    });
  });

  describe("When setting is not fitting min-max", () => {
    it("should not allow for using lower value than minPositionX", async () => {
      const { ref } = renderApp({
        initialPositionX: -200,
        minPositionX: -100,
      });
      expect(ref.current!.instance.state.positionX).toBeGreaterThanOrEqual(
        -100,
      );
    });
    it("should not allow for using higher value than maxPositionX", async () => {
      const { ref } = renderApp({
        initialPositionX: 200,
        maxPositionX: 100,
      });
      expect(ref.current!.instance.state.positionX).toBeLessThanOrEqual(100);
    });
    it("should not allow for using lower value than minPositionY", async () => {
      const { ref } = renderApp({
        initialPositionY: -200,
        minPositionY: -100,
      });
      expect(ref.current!.instance.state.positionY).toBeGreaterThanOrEqual(
        -100,
      );
    });
    it("should not allow for using higher value than maxPositionY", async () => {
      const { ref } = renderApp({
        initialPositionY: 200,
        maxPositionY: 100,
      });
      expect(ref.current!.instance.state.positionY).toBeLessThanOrEqual(100);
    });
  });
});
