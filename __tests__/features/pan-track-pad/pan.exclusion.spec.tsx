import { fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderApp } from "../../utils";

describe("Pan TrackPad [Exclusion]", () => {
  describe("When excluding element", () => {
    it("should not allow for panning on excluded element", async () => {
      const { wrapper, content } = renderApp({
        trackPadPanning: { disabled: false, excluded: ["panningDisabled"] },
      });

      const excluded = wrapper.querySelector(".panningDisabled") as HTMLElement;

      userEvent.hover(excluded);
      fireEvent(
        excluded,
        new WheelEvent("wheel", { bubbles: true, deltaX: 0, deltaY: 0 }),
      );
      fireEvent(
        excluded,
        new WheelEvent("wheel", { bubbles: true, deltaX: 50, deltaY: 0 }),
      );
      fireEvent(
        excluded,
        new WheelEvent("wheel", { bubbles: true, deltaX: 50, deltaY: 0 }),
      );

      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
    it("should allow panning on other elements", async () => {
      const { content, trackPadPan } = renderApp({
        trackPadPanning: { disabled: false, excluded: ["panningDisabled"] },
      });

      trackPadPan({ x: -100, y: 0 });
      expect(content.style.transform).toBe("translate(-100px, 0px) scale(1)");
    });
    it("should not change scale on excluded trackpad pan", async () => {
      const { wrapper, ref } = renderApp({
        trackPadPanning: { disabled: false, excluded: ["panningDisabled"] },
      });

      const excluded = wrapper.querySelector(".panningDisabled") as HTMLElement;

      userEvent.hover(excluded);
      fireEvent(
        excluded,
        new WheelEvent("wheel", { bubbles: true, deltaX: 0, deltaY: 0 }),
      );
      fireEvent(
        excluded,
        new WheelEvent("wheel", { bubbles: true, deltaX: 100, deltaY: 0 }),
      );

      expect(ref.current?.instance.state.scale).toBe(1);
    });
  });

  describe("When trackPadPanning is fully disabled", () => {
    it("should not pan via trackpad gestures", async () => {
      const { content } = renderApp({
        trackPadPanning: { disabled: true },
      });

      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
  });
});
