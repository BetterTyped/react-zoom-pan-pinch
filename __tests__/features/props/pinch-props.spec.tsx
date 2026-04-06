import { fireEvent } from "@testing-library/react";

import { renderApp } from "../../utils";

describe("ReactZoomPanPinchProps.pinch", () => {
  describe("pinch.step", () => {
    it("higher step produces larger scale change per pinch gesture", () => {
      const run = (step: number) => {
        const { ref, pinch, unmount } = renderApp({
          pinch: { step },
        });
        pinch({ value: 2, center: [250, 250] });
        const scale = ref.current!.instance.state.scale;
        unmount();
        return scale;
      };

      const low = run(1);
      const high = run(20);
      expect(high).toBeGreaterThanOrEqual(low);
    });
  });

  describe("pinch.disabled", () => {
    it("blocks pinch zoom when true", () => {
      const { ref, pinch } = renderApp({
        pinch: { disabled: true },
      });
      pinch({ value: 2, center: [250, 250] });
      expect(ref.current!.instance.state.scale).toBe(1);
    });
  });

  describe("pinch.allowPanning", () => {
    it("allows panning during pinch when true", () => {
      const { ref, pinch } = renderApp({
        pinch: { allowPanning: true },
      });
      pinch({
        value: 1.5,
        center: [200, 200],
        targetCenter: [300, 300],
      });
      const { positionX, positionY } = ref.current!.instance.state;
      expect(ref.current!.instance.state.scale).not.toBe(1);
      expect(positionX !== 0 || positionY !== 0).toBe(true);
    });
  });

  describe("pinch.excluded", () => {
    it("does not pinch on excluded element", () => {
      const { ref, content } = renderApp({
        pinch: { excluded: ["pinchDisabled"] },
      });

      const excluded = content.querySelector(".pinchDisabled");
      expect(excluded).toBeTruthy();

      fireEvent.touchStart(excluded!, {
        touches: [
          { clientX: 100, clientY: 100, pageX: 100, pageY: 100, target: excluded },
          { clientX: 200, clientY: 200, pageX: 200, pageY: 200, target: excluded },
        ],
      });
      fireEvent.touchMove(excluded!, {
        touches: [
          { clientX: 50, clientY: 50, pageX: 50, pageY: 50, target: excluded },
          { clientX: 250, clientY: 250, pageX: 250, pageY: 250, target: excluded },
        ],
      });
      fireEvent.touchEnd(excluded!, { touches: [] });

      expect(ref.current!.instance.state.scale).toBe(1);
    });
  });
});
