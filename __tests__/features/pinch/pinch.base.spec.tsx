import { waitFor } from "@testing-library/dom";

import { renderApp } from "../../utils/render-app";

describe("Pinch [Base]", () => {
  describe("When content is the same size as wrapper", () => {
    it("should change transform scale", async () => {
      const { ref, content, pinch } = renderApp();
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      pinch({ value: 1.5 });
      await waitFor(() => {
        expect(content.style.transform).toBe("translate(0px, 0px) scale(1.5)");
        expect(ref.current?.instance.state.scale).toBe(1.5);
      });
    });
    it("should zoom to the position of midpoint", async () => {
      const { ref, pinch } = renderApp();

      pinch({ value: 2, center: [100, 100] });
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeCloseTo(2, 0);
      });
      expect(ref.current?.instance.state.positionX).toBeLessThan(0);
      expect(ref.current?.instance.state.positionY).toBeLessThan(0);
    });
    it("should not exceed maxScale", async () => {
      const { ref, pinch } = renderApp({ maxScale: 3 });

      pinch({ value: 5 });
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeLessThanOrEqual(3);
      });
    });
    it("should zoom out via setTransform after pinch in", async () => {
      const { ref, pinch } = renderApp();

      pinch({ value: 2 });
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeCloseTo(2, 0);
      });

      ref.current!.setTransform(0, 0, 1);
      expect(ref.current?.instance.state.scale).toBe(1);
    });
    it("should keep position within bounds after zooming", async () => {
      const { ref, pinch } = renderApp({
        limitToBounds: true,
        disablePadding: true,
      });

      pinch({ value: 2, center: [250, 250] });
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeCloseTo(2, 0);
      });
      expect(ref.current?.instance.state.positionX).toBeGreaterThanOrEqual(
        -500,
      );
      expect(ref.current?.instance.state.positionY).toBeGreaterThanOrEqual(
        -500,
      );
    });
  });

  describe("When content bigger than wrapper", () => {
    const bigContent = {
      wrapperWidth: "200px",
      wrapperHeight: "200px",
      contentWidth: "400px",
      contentHeight: "400px",
    } as const;

    it("should center the content with centerOnInit", async () => {
      const { ref } = renderApp({
        ...bigContent,
        centerOnInit: true,
      });

      await waitFor(() => {
        expect(ref.current?.instance.state.positionX).toBe(-100);
        expect(ref.current?.instance.state.positionY).toBe(-100);
      });
    });
    it("should change transform scale", async () => {
      const { ref, content, pinch } = renderApp(bigContent);
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      pinch({ value: 1.5 });
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBe(1.5);
      });
    });
    it("should zoom to the position of midpoint", async () => {
      const { ref, pinch } = renderApp(bigContent);

      pinch({ value: 2, center: [100, 100] });
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeCloseTo(2, 0);
      });
      expect(ref.current?.instance.state.positionX).toBeLessThan(0);
      expect(ref.current?.instance.state.positionY).toBeLessThan(0);
    });
    it("should clamp to maxScale on big content", async () => {
      const { ref, pinch } = renderApp({ ...bigContent, maxScale: 3 });

      pinch({ value: 10, center: [100, 100] });
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeLessThanOrEqual(3);
      });
    });
    it("should zoom out via setTransform after pinch in on big content", async () => {
      const { ref, pinch } = renderApp(bigContent);

      pinch({ value: 2 });
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeCloseTo(2, 0);
      });

      ref.current!.setTransform(0, 0, 1);
      expect(ref.current?.instance.state.scale).toBe(1);
    });
    it("should keep position within bounds after zooming", async () => {
      const { ref, pinch } = renderApp({
        ...bigContent,
        limitToBounds: true,
        disablePadding: true,
      });

      pinch({ value: 2, center: [100, 100] });
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeCloseTo(2, 0);
      });
      expect(ref.current?.instance.state.positionX).toBeGreaterThanOrEqual(
        -600,
      );
      expect(ref.current?.instance.state.positionY).toBeGreaterThanOrEqual(
        -600,
      );
    });
  });

  describe("When pinch is disabled", () => {
    it("should not change scale", async () => {
      const { ref, content } = renderApp({
        pinch: { disabled: true },
      });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      expect(ref.current?.instance.state.scale).toBe(1);
    });
  });

  describe("When pinch callbacks are provided", () => {
    it("should trigger onPinchStart and onPinchStop", async () => {
      const onPinchStart = jest.fn();
      const onPinchStop = jest.fn();
      const { pinch } = renderApp({
        onPinchStart,
        onPinchStop,
      });

      pinch({ value: 1.5 });
      expect(onPinchStart).toHaveBeenCalled();
      expect(onPinchStop).toHaveBeenCalled();
    });
  });
});
