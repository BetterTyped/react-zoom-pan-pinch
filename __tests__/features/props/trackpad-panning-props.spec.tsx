import { fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderApp } from "../../utils";

describe("ReactZoomPanPinchProps.trackPadPanning", () => {
  describe("trackPadPanning.disabled", () => {
    it("blocks trackpad panning when true", () => {
      const { content, trackPadPan } = renderApp({
        trackPadPanning: { disabled: true },
      });
      trackPadPan({ x: -100, y: -100 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
  });

  describe("trackPadPanning.velocityDisabled", () => {
    it("prevents inertia on trackpad pan when true", () => {
      const { content, trackPadPan } = renderApp({
        trackPadPanning: { velocityDisabled: true },
        velocityAnimation: { disabled: false },
      });
      trackPadPan({ x: -100, y: -100 });
      const { transform } = content.style;
      expect(transform).toContain("translate(");
    });
  });

  describe("trackPadPanning.lockAxisX", () => {
    it("locks horizontal trackpad panning", () => {
      const { content, trackPadPan } = renderApp({
        trackPadPanning: { lockAxisX: true },
      });
      trackPadPan({ x: -100, y: -100 });
      expect(content.style.transform).toMatch(/translate\(0px,.*scale/);
    });
  });

  describe("trackPadPanning.lockAxisY", () => {
    it("locks vertical trackpad panning", () => {
      const { content, trackPadPan } = renderApp({
        trackPadPanning: { lockAxisY: true },
      });
      trackPadPan({ x: -100, y: -100 });
      expect(content.style.transform).toMatch(/translate\(.*0px\) scale/);
    });
  });

  describe("trackPadPanning.activationKeys", () => {
    it("requires specified key for trackpad panning", () => {
      const { content, trackPadPan } = renderApp({
        trackPadPanning: { activationKeys: ["Shift"] },
      });
      trackPadPan({ x: -100, y: -100 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
  });

  describe("trackPadPanning.excluded", () => {
    it("does not trackpad-pan from excluded element", () => {
      const { wrapper, ref } = renderApp({
        trackPadPanning: { excluded: ["wheelDisabled"] },
      });
      const excluded = wrapper.querySelector(".wheelDisabled");
      expect(excluded).toBeTruthy();

      userEvent.hover(excluded!);
      fireEvent(
        excluded!,
        new WheelEvent("wheel", {
          bubbles: true,
          deltaX: 0,
          deltaY: 0,
        }),
      );
      fireEvent(
        excluded!,
        new WheelEvent("wheel", {
          bubbles: true,
          deltaX: -50,
          deltaY: 0,
        }),
      );
      expect(ref.current!.instance.state.positionX).toBe(0);
    });
  });

  /**
   * #500 — https://github.com/BetterTyped/react-zoom-pan-pinch/issues/500.
   * Wheel zoom is turned off (`wheelDisabled`) so a vertical wheel pans.
   * 500×500 wrapper and content at scale 1, autoAlignment off: the 100px
   * padding is a plain area, so the content follows the delta 1:1.
   */
  describe("trackPadPanning.speed and wheel units (#500)", () => {
    const wheel = (content: HTMLElement, init: WheelEventInit) => {
      userEvent.hover(content);
      fireEvent(content, new WheelEvent("wheel", { bubbles: true, ...init }));
    };

    it("pans by the delta at the default speed of 1", () => {
      const { content } = renderApp({
        trackPadPanning: { disabled: false },
        wheel: { wheelDisabled: true },
      });
      wheel(content, { deltaX: 30, deltaY: 20 });
      expect(content.style.transform).toBe("translate(-30px, -20px) scale(1)");
    });

    it("multiplies the delta by speed", () => {
      const { content } = renderApp({
        trackPadPanning: { disabled: false, speed: 2 },
        wheel: { wheelDisabled: true },
      });
      wheel(content, { deltaX: 30, deltaY: 20 });
      expect(content.style.transform).toBe("translate(-60px, -40px) scale(1)");
    });

    it("turns line deltas into pixels (Firefox mouse wheel)", () => {
      const { content } = renderApp({
        trackPadPanning: { disabled: false },
        wheel: { wheelDisabled: true },
      });
      // 3 lines × 16px = 48px, not 3px.
      wheel(content, { deltaY: 3, deltaMode: 1 });
      expect(content.style.transform).toBe("translate(0px, -48px) scale(1)");
    });

    it("pans horizontally with Shift when the browser reports only deltaY", () => {
      const { content } = renderApp({
        trackPadPanning: { disabled: false },
        wheel: { wheelDisabled: true },
      });
      wheel(content, { deltaY: 30, shiftKey: true });
      expect(content.style.transform).toBe("translate(-30px, 0px) scale(1)");
    });

    it("keeps the browser's own Shift conversion as it is", () => {
      const { content } = renderApp({
        trackPadPanning: { disabled: false },
        wheel: { wheelDisabled: true },
      });
      wheel(content, { deltaX: 30, shiftKey: true });
      expect(content.style.transform).toBe("translate(-30px, 0px) scale(1)");
    });
  });
});
