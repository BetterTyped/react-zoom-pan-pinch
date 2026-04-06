import { renderApp } from "../../utils";

describe("Pan TrackPad [Bounds]", () => {
  describe("When zoomed and limitToBounds is true", () => {
    it("prevents trackpad panning beyond right edge", () => {
      const { trackPadPan, ref } = renderApp({
        limitToBounds: true,
        disablePadding: true,
      });
      ref.current!.setTransform(0, 0, 2);
      trackPadPan({ x: 2000, y: 0 });
      expect(ref.current!.instance.state.positionX).toBeLessThan(2000);
    });
  });

  describe("When axis is locked", () => {
    it("lockAxisX prevents horizontal trackpad panning", () => {
      const { trackPadPan, content } = renderApp({
        trackPadPanning: { lockAxisX: true },
      });
      trackPadPan({ x: -100, y: -100 });
      expect(content.style.transform).toMatch(/translate\(0px,.*scale/);
    });

    it("lockAxisY prevents vertical trackpad panning", () => {
      const { trackPadPan, content } = renderApp({
        trackPadPanning: { lockAxisY: true },
      });
      trackPadPan({ x: -100, y: -100 });
      expect(content.style.transform).toMatch(/translate\(.*0px\) scale/);
    });
  });
});
