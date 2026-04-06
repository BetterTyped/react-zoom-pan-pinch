import { act, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderApp, flushAnimationFrames } from "../../utils";

describe("ReactZoomPanPinchProps callbacks", () => {
  describe("onInit", () => {
    it("fires on mount with ref", () => {
      const onInit = jest.fn();
      renderApp({ onInit });
      expect(onInit).toHaveBeenCalledTimes(1);
      expect(onInit.mock.calls[0][0]).toHaveProperty("instance");
    });
  });

  describe("onPanningStart", () => {
    it("fires when panning begins", () => {
      const onPanningStart = jest.fn();
      const { pan } = renderApp({ onPanningStart });
      pan({ x: -50, y: -50 });
      expect(onPanningStart).toHaveBeenCalled();
    });
  });

  describe("onPanning", () => {
    it("fires during panning", () => {
      const onPanning = jest.fn();
      const { pan } = renderApp({ onPanning });
      pan({ x: -50, y: -50, moveEventCount: 3 });
      expect(onPanning).toHaveBeenCalled();
    });
  });

  describe("onPanningStop", () => {
    it("fires when panning ends", () => {
      const onPanningStop = jest.fn();
      const { pan } = renderApp({ onPanningStop });
      pan({ x: -50, y: -50 });
      expect(onPanningStop).toHaveBeenCalled();
    });
  });

  describe("onWheelStart", () => {
    it("fires when wheel zoom begins", () => {
      const onWheelStart = jest.fn();
      const { content } = renderApp({ onWheelStart, smooth: false });
      userEvent.hover(content);
      fireEvent(
        content,
        new WheelEvent("wheel", { bubbles: true, deltaY: -5 }),
      );
      expect(onWheelStart).toHaveBeenCalled();
    });
  });

  describe("onWheel", () => {
    it("fires on each wheel tick", () => {
      const onWheel = jest.fn();
      const { content } = renderApp({ onWheel, smooth: false });
      userEvent.hover(content);
      fireEvent(
        content,
        new WheelEvent("wheel", { bubbles: true, deltaY: -5 }),
      );
      expect(onWheel).toHaveBeenCalled();
    });
  });

  describe("onWheelStop", () => {
    it("fires after wheel activity stops", async () => {
      const onWheelStop = jest.fn();
      const { content } = renderApp({ onWheelStop, smooth: false });
      userEvent.hover(content);
      fireEvent(
        content,
        new WheelEvent("wheel", { bubbles: true, deltaY: -5 }),
      );
      await waitFor(() => {
        expect(onWheelStop).toHaveBeenCalled();
      });
    });
  });

  describe("onPinchStart", () => {
    it("fires when pinch gesture starts", () => {
      const onPinchStart = jest.fn();
      const { pinch } = renderApp({ onPinchStart });
      pinch({ value: 1.5, center: [250, 250] });
      expect(onPinchStart).toHaveBeenCalled();
    });
  });

  describe("onPinch", () => {
    it("fires during pinch gesture", () => {
      const onPinch = jest.fn();
      const { pinch } = renderApp({ onPinch });
      pinch({ value: 1.5, center: [250, 250] });
      expect(onPinch).toHaveBeenCalled();
    });
  });

  describe("onPinchStop", () => {
    it("fires when pinch gesture ends", () => {
      const onPinchStop = jest.fn();
      const { pinch } = renderApp({ onPinchStop });
      pinch({ value: 1.5, center: [250, 250] });
      expect(onPinchStop).toHaveBeenCalled();
    });
  });

  describe("onZoomStart", () => {
    it("fires when any zoom starts", () => {
      const onZoomStart = jest.fn();
      const { content } = renderApp({ onZoomStart, smooth: false });
      userEvent.hover(content);
      fireEvent(
        content,
        new WheelEvent("wheel", { bubbles: true, deltaY: -5 }),
      );
      expect(onZoomStart).toHaveBeenCalled();
    });
  });

  describe("onZoom", () => {
    it("fires during zoom", () => {
      const onZoom = jest.fn();
      const { content } = renderApp({ onZoom, smooth: false });
      userEvent.hover(content);
      fireEvent(
        content,
        new WheelEvent("wheel", { bubbles: true, deltaY: -5 }),
      );
      expect(onZoom).toHaveBeenCalled();
    });
  });

  describe("onZoomStop", () => {
    it("fires after zoom ends", async () => {
      const onZoomStop = jest.fn();
      const { content } = renderApp({ onZoomStop, smooth: false });
      userEvent.hover(content);
      fireEvent(
        content,
        new WheelEvent("wheel", { bubbles: true, deltaY: -5 }),
      );
      await waitFor(() => {
        expect(onZoomStop).toHaveBeenCalled();
      });
    });
  });

  describe("onTransform", () => {
    it("fires on every transform change", () => {
      const onTransform = jest.fn();
      const { pan } = renderApp({ onTransform });
      pan({ x: -50, y: -50 });
      expect(onTransform).toHaveBeenCalled();
      const lastCall = onTransform.mock.calls[onTransform.mock.calls.length - 1];
      expect(lastCall[1]).toHaveProperty("scale");
      expect(lastCall[1]).toHaveProperty("positionX");
      expect(lastCall[1]).toHaveProperty("positionY");
    });
  });
});
