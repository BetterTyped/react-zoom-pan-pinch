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
      const { ref, touchPan, pinch } = renderApp({
        wrapperWidth: "100px",
        wrapperHeight: "100px",
        contentWidth: "200px",
        contentHeight: "200px",
        disablePadding: true,
        velocityAnimation: { disabled: false },
      });

      pinch({ value: 2 });
      touchPan({ x: -10, y: -10, moveEventCount: 5 });

      const posAfterPan = ref.current!.instance.state.positionX;
      expect(posAfterPan).toBeLessThan(0);
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
    it("should return to original position", async () => {
      const { content, touchPan } = renderApp({
        wrapperWidth: "100px",
        wrapperHeight: "100px",
        contentWidth: "50px",
        contentHeight: "50px",
        disablePadding: true,
        limitToBounds: true,
      });

      touchPan({ x: -100, y: -100 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
  });
});
