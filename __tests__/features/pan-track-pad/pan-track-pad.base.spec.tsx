import { waitFor } from "@testing-library/react";

import { renderApp } from "../../utils";

describe("Pan TrackPad [Base]", () => {
  describe("When panning to coords", () => {
    it("should not change translate with disabled padding", async () => {
      const { content, trackPadPan } = renderApp({
        wheel: {
          disabled: true,
        },
        trackPadPanning: {
          disabled: false,
        },
        disablePadding: true,
      });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      trackPadPan({ x: -100, y: -100 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
    it("should return to position with padding enabled", async () => {
      const { content, trackPadPan } = renderApp({
        wheel: {
          disabled: true,
        },
        trackPadPanning: {
          disabled: false,
        },
        autoAlignment: {
          disabled: false,
        },
      });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      trackPadPan({ x: -100, y: -100 });
      expect(content.style.transform).toBe(
        "translate(-100px, -100px) scale(1)",
      );
      await waitFor(() => {
        expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      });
    });
  });
  describe("When locked axis", () => {
    it("should not change x axis transform", async () => {
      const { content, trackPadPan } = renderApp({
        wheel: {
          disabled: true,
        },
        trackPadPanning: {
          disabled: false,
          lockAxisX: true,
        },
      });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      trackPadPan({ x: -100, y: -100 });
      expect(content.style.transform).toBe("translate(0px, -100px) scale(1)");
    });
    it("should not change y axis transform", async () => {
      const { content, trackPadPan } = renderApp({
        wheel: {
          disabled: true,
        },
        trackPadPanning: {
          disabled: false,
          lockAxisY: true,
        },
      });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      trackPadPan({ x: -100, y: -100 });
      expect(content.style.transform).toBe("translate(-100px, 0px) scale(1)");
    });
  });
  describe("When disabled", () => {
    it("should not change transform", async () => {
      const { content, trackPadPan } = renderApp({
        disabled: true,
      });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      trackPadPan({ x: -100, y: -100 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
  });
});
