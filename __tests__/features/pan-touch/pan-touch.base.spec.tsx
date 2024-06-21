import { waitFor } from "@testing-library/react";

import { renderApp, sleep } from "../../utils";

describe("Pan Touch [Base]", () => {
  describe("When panning to coords", () => {
    it("should not change translate with disabled padding", async () => {
      const { content, touchPan } = renderApp({
        disablePadding: true,
      });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      touchPan({ x: 100, y: 100 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
    it("should return to position with padding enabled", async () => {
      const { content, touchPan, pinch } = renderApp({
        disablePadding: false,
      });
      pinch({ value: 1.2 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      touchPan({ x: 100, y: 100 });
      expect(content.style.transform).toBe("translate(100px, 100px) scale(1)");
      await waitFor(() => {
        expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      });
    });
    it("should change translate css when zoomed", async () => {
      const { content, touchPan, zoom } = renderApp();
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      zoom({ value: 1.5 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1.5)");
      touchPan({ x: 100, y: 100 });
      await sleep(10);
      expect(content.style.transform).toBe(
        "translate(100px, 100px) scale(1.5)",
      );
    });
  });
  describe("When locked axis", () => {
    it("should not change x axis transform", async () => {
      const { content, touchPan } = renderApp({
        panning: {
          lockAxisX: true,
        },
      });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      touchPan({ x: 100, y: 100 });
      expect(content.style.transform).toBe("translate(0px, 100px) scale(1)");
    });
    it("should not change y axis transform", async () => {
      const { content, touchPan } = renderApp({
        panning: {
          lockAxisY: true,
        },
      });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      touchPan({ x: 100, y: 100 });
      expect(content.style.transform).toBe("translate(100px, 0px) scale(1)");
    });
  });
  describe("When disabled", () => {
    it("should not change transform", async () => {
      const { content, touchPan } = renderApp({
        disabled: true,
      });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      touchPan({ x: 100, y: 100 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
    it("should not change transform", async () => {
      const { content, touchPan } = renderApp({
        panning: {
          disabled: true,
        },
      });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      touchPan({ x: 100, y: 100 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
  });
  // describe("When max position is set", () => {
  // it("should not exceed max position", async () => {
  //   const { content, touchPan } = renderApp({
  //     maxPositionX: 20,
  //     maxPositionY: 20,
  //     doubleClick: {
  //       disabled: true,
  //     },
  //   });
  //   expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
  //   touchPan({ x: 200, y: 200 });
  //   expect(content.style.transform).toBe("translate(20px, 20px) scale(1)");
  //   touchPan({ x: -20, y: -20 });
  //   expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
  // });
  // it("should not exceed min position", async () => {
  //   const { content, touchPan, zoom, ref } = renderApp({
  //     minPositionX: 30,
  //     minPositionY: 30,
  //     onTransform: (ctx) => {
  //       console.log(ctx.instance.transformState);
  //     },
  //   });
  //   zoom({ value: 1.5 });
  //   expect(content.style.transform).toBe("translate(30px, 30px) scale(1.5)");
  //   touchPan({ x: -20, y: -20 });
  //   await waitFor(() => {
  //     expect(content.style.transform).toBe(
  //       "translate(30px, 30px) scale(1.5)",
  //     );
  //   });
  //   await sleep(10);
  //   touchPan({ x: 50, y: 50 });
  //   await waitFor(() => {
  //     expect(content.style.transform).toBe(
  //       "translate(80px, 80px) scale(1.5)",
  //     );
  //   });
  // });
  // });
});
