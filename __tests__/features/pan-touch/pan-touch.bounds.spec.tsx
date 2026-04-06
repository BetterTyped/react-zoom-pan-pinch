import { renderApp } from "../../utils";

describe("Pan Touch [Bounds]", () => {
  describe("When zoomed and limitToBounds is true", () => {
    it("prevents touch panning beyond right edge", () => {
      const { touchPan, ref } = renderApp({
        limitToBounds: true,
        disablePadding: true,
      });
      ref.current!.setTransform(0, 0, 2);
      touchPan({ x: 2000, y: 0 });
      expect(ref.current!.instance.state.positionX).toBeLessThan(2000);
      expect(ref.current!.instance.state.positionX).toBeGreaterThanOrEqual(0);
    });

    it("prevents touch panning beyond bottom edge", () => {
      const { touchPan, ref } = renderApp({
        limitToBounds: true,
        disablePadding: true,
      });
      ref.current!.setTransform(0, 0, 2);
      touchPan({ x: 0, y: -2000 });
      expect(ref.current!.instance.state.positionY).toBeGreaterThan(-2000);
    });
  });

  describe("When axis is locked", () => {
    it("lockAxisX prevents horizontal touch panning", () => {
      const { touchPan, content } = renderApp({
        panning: { lockAxisX: true },
      });
      touchPan({ x: -100, y: -100 });
      expect(content.style.transform).toBe("translate(0px, -100px) scale(1)");
    });

    it("lockAxisY prevents vertical touch panning", () => {
      const { touchPan, content } = renderApp({
        panning: { lockAxisY: true },
      });
      touchPan({ x: -100, y: -100 });
      expect(content.style.transform).toBe("translate(-100px, 0px) scale(1)");
    });
  });
});
