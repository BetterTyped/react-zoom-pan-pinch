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
      const transform = content.style.transform;
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
});
