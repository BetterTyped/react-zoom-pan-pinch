import { waitFor } from "@testing-library/react";

import { renderApp } from "../../utils";

describe("Pan Touch [Sizes]", () => {
  describe("When content is bigger than wrapper", () => {
    it("should allow panning to the bottom-right end without moving back", async () => {
      const { content, touchPan } = renderApp({
        wrapperWidth: "100px",
        wrapperHeight: "100px",
        contentWidth: "200px",
        contentHeight: "200px",
        disablePadding: true,
      });

      touchPan({ x: 150, y: 150 });
      expect(content.style.transform).toBe("translate(100px, 100px) scale(1)");
    });
    it("should allow panning with velocity", async () => {
      const { ref, touchPan } = renderApp({
        wrapperWidth: "100px",
        wrapperHeight: "100px",
        contentWidth: "200px",
        contentHeight: "200px",
        disablePadding: true,
        velocityAnimation: { disabled: false },
      });

      ref.current!.setTransform(0, 0, 2);
      touchPan({ x: -10, y: -10, moveEventCount: 5 });

      const posAfterPan = ref.current!.instance.state.positionX;

      await waitFor(() => {
        expect(ref.current!.instance.state.positionX).toBeLessThanOrEqual(
          posAfterPan,
        );
      });
    });
    it("should not allow to move beyond bounds", async () => {
      const { ref, touchPan } = renderApp({
        wrapperWidth: "100px",
        wrapperHeight: "100px",
        contentWidth: "200px",
        contentHeight: "200px",
        disablePadding: true,
        limitToBounds: true,
      });

      touchPan({ x: -500, y: -500 });
      expect(ref.current!.instance.state.positionX).toBeGreaterThan(-500);
      expect(ref.current!.instance.state.positionY).toBeGreaterThan(-500);
    });
    it("should allow touch panning in both directions", async () => {
      const { content, touchPan } = renderApp({
        wrapperWidth: "100px",
        wrapperHeight: "100px",
        contentWidth: "200px",
        contentHeight: "200px",
        disablePadding: true,
      });

      touchPan({ x: -50, y: -50 });
      expect(content.style.transform).toBe(
        "translate(-50px, -50px) scale(1)",
      );
    });
  });

  describe("When content is smaller than wrapper", () => {
    it("should not allow for panning", async () => {
      const { content, touchPan } = renderApp({
        wrapperWidth: "100px",
        wrapperHeight: "100px",
        contentWidth: "50px",
        contentHeight: "50px",
        disablePadding: true,
      });

      touchPan({ x: 150, y: 150 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
    it("should return to original position with auto alignment", async () => {
      const { content, touchPan } = renderApp({
        autoAlignment: { disabled: false },
        disablePadding: false,
      });

      touchPan({ x: -100, y: -100 });
      expect(content.style.transform).toBe(
        "translate(-100px, -100px) scale(1)",
      );
      await waitFor(() => {
        expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      });
    });
    it("should allow to move with limitToBounds disabled", async () => {
      const { content, touchPan } = renderApp({
        wrapperWidth: "100px",
        wrapperHeight: "100px",
        contentWidth: "50px",
        contentHeight: "50px",
        limitToBounds: false,
      });

      touchPan({ x: -100, y: -100 });
      expect(content.style.transform).toBe(
        "translate(-100px, -100px) scale(1)",
      );
    });
  });

  describe("When content is equal to wrapper", () => {
    it("should not allow for panning", async () => {
      const { content, touchPan } = renderApp({
        wrapperWidth: "100px",
        wrapperHeight: "100px",
        contentWidth: "100px",
        contentHeight: "100px",
        disablePadding: true,
      });

      touchPan({ x: 150, y: 150 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
    it("should allow to move with limitToBounds disabled", async () => {
      const { content, touchPan } = renderApp({
        wrapperWidth: "100px",
        wrapperHeight: "100px",
        contentWidth: "100px",
        contentHeight: "100px",
        limitToBounds: false,
      });

      touchPan({ x: -100, y: -100 });
      expect(content.style.transform).toBe(
        "translate(-100px, -100px) scale(1)",
      );
    });
  });

  describe("When axis is locked", () => {
    it("should lock X axis with touch panning", () => {
      const { touchPan, content } = renderApp({
        panning: { lockAxisX: true },
      });
      touchPan({ x: -100, y: -100 });
      expect(content.style.transform).toBe("translate(0px, -100px) scale(1)");
    });
    it("should lock Y axis with touch panning", () => {
      const { touchPan, content } = renderApp({
        panning: { lockAxisY: true },
      });
      touchPan({ x: -100, y: -100 });
      expect(content.style.transform).toBe("translate(-100px, 0px) scale(1)");
    });
  });

  describe("When touch panning is disabled", () => {
    it("should not allow for panning", async () => {
      const { content, touchPan } = renderApp({
        panning: { disabled: true },
      });
      touchPan({ x: -100, y: -100 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
  });
});
