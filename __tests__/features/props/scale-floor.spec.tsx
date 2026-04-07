import { renderApp } from "../../utils/render-app";

describe("Scale floor", () => {
  describe("Scale should never go below 0", () => {
    it("should clamp minScale of 0 to a positive value", () => {
      const { ref } = renderApp({ minScale: 0 });
      expect(ref.current?.instance.setup.minScale).toBeGreaterThan(0);
    });

    it("should clamp negative minScale to a positive value", () => {
      const { ref } = renderApp({ minScale: -5 });
      expect(ref.current?.instance.setup.minScale).toBeGreaterThan(0);
    });

    it("should clamp initialScale of 0 to minScale", () => {
      const { ref } = renderApp({ initialScale: 0, minScale: 0.1 });
      expect(ref.current?.instance.state.scale).toBeGreaterThanOrEqual(0.1);
    });

    it("should clamp negative initialScale to minScale", () => {
      const { ref } = renderApp({ initialScale: -1, minScale: 0.5 });
      expect(ref.current?.instance.state.scale).toBeGreaterThanOrEqual(0.5);
    });

    it("should prevent zooming out past 0 via programmatic setTransform", async () => {
      const { ref } = renderApp({ minScale: 0.01 });
      ref.current?.setTransform(0, 0, -5, 0);
      expect(ref.current?.instance.state.scale).toBeGreaterThan(0);
    });

    it("should handle minScale=0 and initialScale=0 without crashing", () => {
      const { ref } = renderApp({ minScale: 0, initialScale: 0 });
      expect(ref.current?.instance.state.scale).toBeGreaterThan(0);
      expect(ref.current?.instance.setup.minScale).toBeGreaterThan(0);
    });
  });
});
