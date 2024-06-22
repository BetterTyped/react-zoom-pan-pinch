import { waitFor } from "@testing-library/dom";
import { renderApp } from "../../utils";

describe("Zoom [Callbacks]", () => {
  describe("When wheel zooming", () => {
    it("should trigger onZoom callbacks", async () => {
      const spy1 = jest.fn();
      const spy2 = jest.fn();
      const spy3 = jest.fn();
      const { content, zoom } = renderApp({
        onZoomStart: spy1,
        onZoom: spy2,
        onZoomStop: spy3,
      });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      zoom({ value: 2 });
      await waitFor(() => {
        expect(spy1).toBeCalledTimes(1);
        expect(spy2).toBeCalled();
        expect(spy3).toBeCalledTimes(1);
      });
    });

    it("should not trigger onPinch callbacks", async () => {
      const spy1 = jest.fn();
      const spy2 = jest.fn();
      const spy3 = jest.fn();
      const { content, zoom } = renderApp({
        onPinchStart: spy1,
        onPinch: spy2,
        onPinchStop: spy3,
      });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      zoom({ value: 2 });
      expect(spy1).toBeCalledTimes(0);
      expect(spy2).toBeCalledTimes(0);
      expect(spy3).toBeCalledTimes(0);
    });
  });
});
