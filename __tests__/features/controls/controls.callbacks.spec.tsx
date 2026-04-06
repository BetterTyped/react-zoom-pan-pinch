import { fireEvent, waitFor } from "@testing-library/react";

import { renderApp } from "../../utils/render-app";

describe("Controls [Callbacks]", () => {
  describe("When zooming in with controls button", () => {
    it("should fire onZoomStart, onZoom, and onZoomStop callbacks", async () => {
      const onZoomStart = jest.fn();
      const onZoom = jest.fn();
      const onZoomStop = jest.fn();
      const { zoomInBtn } = renderApp({ onZoomStart, onZoom, onZoomStop });

      fireEvent(zoomInBtn, new MouseEvent("click", { bubbles: true }));

      expect(onZoomStart).toHaveBeenCalledTimes(1);
      expect(onZoom).toHaveBeenCalledTimes(1);
      await waitFor(() => {
        expect(onZoomStop).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("When zooming out with controls button", () => {
    it("should fire onZoomStart, onZoom, and onZoomStop callbacks", async () => {
      const onZoomStart = jest.fn();
      const onZoom = jest.fn();
      const onZoomStop = jest.fn();
      const { zoomOutBtn } = renderApp({
        initialScale: 2,
        onZoomStart,
        onZoom,
        onZoomStop,
      });

      fireEvent(zoomOutBtn, new MouseEvent("click", { bubbles: true }));

      expect(onZoomStart).toHaveBeenCalledTimes(1);
      expect(onZoom).toHaveBeenCalledTimes(1);
      await waitFor(() => {
        expect(onZoomStop).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("When resetting with controls button", () => {
    it("should fire onZoomStart, onZoom, and onZoomStop callbacks", async () => {
      const onZoomStart = jest.fn();
      const onZoom = jest.fn();
      const onZoomStop = jest.fn();
      const { resetBtn, zoom } = renderApp({
        onZoomStart,
        onZoom,
        onZoomStop,
      });

      zoom({ value: 2 });
      onZoomStart.mockClear();
      onZoom.mockClear();
      onZoomStop.mockClear();

      fireEvent(resetBtn, new MouseEvent("click", { bubbles: true }));

      expect(onZoomStart).toHaveBeenCalledTimes(1);
      expect(onZoom).toHaveBeenCalledTimes(1);
      await waitFor(() => {
        expect(onZoomStop).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("When callback ref state is provided", () => {
    it("should pass ref with current state to zoom callbacks", async () => {
      const onZoomStart = jest.fn();
      const onZoomStop = jest.fn();
      const { zoomInBtn } = renderApp({ onZoomStart, onZoomStop });

      fireEvent(zoomInBtn, new MouseEvent("click", { bubbles: true }));

      expect(onZoomStart).toHaveBeenCalledWith(
        expect.objectContaining({
          state: expect.objectContaining({ scale: expect.any(Number) }),
          instance: expect.any(Object),
        }),
        expect.any(Event),
      );

      await waitFor(() => {
        expect(onZoomStop).toHaveBeenCalledWith(
          expect.objectContaining({
            state: expect.objectContaining({ scale: expect.any(Number) }),
            instance: expect.any(Object),
          }),
          expect.any(Event),
        );
      });
    });
  });
});
