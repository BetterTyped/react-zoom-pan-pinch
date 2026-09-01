import { act } from "@testing-library/react";

import { renderApp } from "../../utils";

const size = {
  wrapperWidth: "500px",
  wrapperHeight: "500px",
  contentWidth: "1000px",
  contentHeight: "1000px",
};

describe("zoomToPoint and coordinate helpers", () => {
  describe("zoomToPoint (#353)", () => {
    it("keeps the content point under the client coordinates fixed", () => {
      const { ref, content } = renderApp(size);

      act(() => {
        ref.current!.zoomToPoint(2, 250, 250, 0);
      });

      // Content point (250, 250) must stay under client (250, 250):
      // position = 0 - 250 * (2 - 1) = -250 on both axes.
      expect(content.style.transform).toBe(
        "translate(-250px, -250px) scale(2)",
      );
      expect(ref.current!.contentToClient(250, 250)).toEqual({
        x: 250,
        y: 250,
      });
    });

    it("anchors at the wrapper corner when zooming at client (0, 0)", () => {
      const { ref, content } = renderApp(size);

      act(() => {
        ref.current!.zoomToPoint(3, 0, 0, 0);
      });

      expect(content.style.transform).toBe("translate(0px, 0px) scale(3)");
    });

    it("clamps to maxScale and to the pan bounds", () => {
      const { ref } = renderApp({ ...size, maxScale: 2 });

      act(() => {
        ref.current!.zoomToPoint(10, 500, 500, 0);
      });

      // Scale clamps to 2; the unclamped position would be -500 but the
      // bounds at scale 2 (content 2000 in a 500 wrapper) allow it exactly.
      expect(ref.current!.instance.state).toMatchObject({
        scale: 2,
        positionX: -500,
        positionY: -500,
      });
    });

    it("limits the anchored position to the pan bounds", () => {
      const { ref } = renderApp(size);

      act(() => {
        ref.current!.zoomToPoint(2, 5000, 5000, 0);
      });

      // Unclamped position would be -5000; bounds at scale 2 stop at -1500.
      expect(ref.current!.instance.state).toMatchObject({
        scale: 2,
        positionX: -1500,
        positionY: -1500,
      });
    });

    it("fires the zoom callbacks", () => {
      const onZoomStart = jest.fn();
      const onZoom = jest.fn();
      const onZoomStop = jest.fn();
      jest.useFakeTimers();
      const { ref } = renderApp({ ...size, onZoomStart, onZoom, onZoomStop });

      act(() => {
        ref.current!.zoomToPoint(2, 100, 100, 0);
        jest.advanceTimersByTime(1);
      });

      expect(onZoomStart).toHaveBeenCalledTimes(1);
      expect(onZoom).toHaveBeenCalledTimes(1);
      expect(onZoomStop).toHaveBeenCalledTimes(1);
      jest.useRealTimers();
    });

    it("is a no-op when the wrapper is disabled", async () => {
      const { ref, content } = renderApp({ ...size, disabled: true });

      await act(async () => {
        await ref.current!.zoomToPoint(2, 100, 100, 0);
      });

      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
  });

  describe("clientToContent / contentToClient (#378)", () => {
    it("are identity at the initial transform", () => {
      const { ref } = renderApp(size);

      expect(ref.current!.clientToContent(120, 80)).toEqual({ x: 120, y: 80 });
      expect(ref.current!.contentToClient(120, 80)).toEqual({ x: 120, y: 80 });
    });

    it("account for the current pan and zoom", () => {
      const { ref } = renderApp(size);

      act(() => {
        ref.current!.setTransform(-300, -100, 2, 0);
      });

      // client 400 -> (400 - (-300)) / 2 = 350
      expect(ref.current!.clientToContent(400, 300)).toEqual({
        x: 350,
        y: 200,
      });
      expect(ref.current!.contentToClient(350, 200)).toEqual({
        x: 400,
        y: 300,
      });
    });

    it("round-trip for arbitrary points", () => {
      const { ref } = renderApp(size);

      act(() => {
        ref.current!.setTransform(-123.5, -77.25, 1.75, 0);
      });

      const content = ref.current!.clientToContent(33, 410);
      const back = ref.current!.contentToClient(content.x, content.y);

      expect(back.x).toBeCloseTo(33, 10);
      expect(back.y).toBeCloseTo(410, 10);
    });

    it("are exposed through useControls", () => {
      const { ref } = renderApp(size);
      const controls = ref.current!;

      expect(typeof controls.zoomToPoint).toBe("function");
      expect(typeof controls.clientToContent).toBe("function");
      expect(typeof controls.contentToClient).toBe("function");
    });
  });
});
