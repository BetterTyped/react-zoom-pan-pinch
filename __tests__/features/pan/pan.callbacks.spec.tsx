import { renderApp } from "../../utils";

describe("Pan [Callbacks]", () => {
  describe("When panning to coords", () => {
    it("should trigger onPanning callbacks", async () => {
      const spy1 = jest.fn();
      const spy2 = jest.fn();
      const spy3 = jest.fn();
      const { content, pan } = renderApp({
        onPanningStart: spy1,
        onPanning: spy2,
        onPanningStop: spy3,
      });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      pan({ x: 100, y: 100 });
      expect(spy1).toBeCalledTimes(1);
      expect(spy2).toBeCalled();
      expect(spy3).toBeCalledTimes(1);
    });
  });
});
