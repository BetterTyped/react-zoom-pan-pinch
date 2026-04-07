import { fireEvent } from "@testing-library/react";

import { renderApp } from "../../utils";

describe("Pan TrackPad [Exclusion]", () => {
  describe("When excluding element", () => {
    it("should not allow for panning on excluded element", async () => {
      const { wrapper, ref } = renderApp({
        wheel: { disabled: true },
        trackPadPanning: {
          disabled: false,
          excluded: ["panningDisabled"],
        },
      });

      const excluded = wrapper.querySelector(".panningDisabled") as HTMLElement;

      fireEvent(
        excluded,
        new WheelEvent("wheel", { bubbles: true, deltaX: 0, deltaY: 0 }),
      );
      fireEvent(
        excluded,
        new WheelEvent("wheel", {
          bubbles: true,
          deltaX: 100,
          deltaY: 100,
        }),
      );

      expect(ref.current?.instance.state.positionX).toBe(0);
      expect(ref.current?.instance.state.positionY).toBe(0);
    });
    it("should allow panning on other elements", async () => {
      const { content, trackPadPan } = renderApp({
        wheel: { disabled: true },
        trackPadPanning: {
          disabled: false,
          excluded: ["panningDisabled"],
        },
      });

      trackPadPan({ x: -100, y: -100 });
      expect(content.style.transform).toBe(
        "translate(-100px, -100px) scale(1)",
      );
    });
  });
});
