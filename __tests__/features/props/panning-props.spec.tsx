import { fireEvent } from "@testing-library/react";

import { renderApp } from "../../utils";

describe("ReactZoomPanPinchProps.panning", () => {
  describe("panning.disabled", () => {
    it("blocks all panning when true", () => {
      const { content, pan } = renderApp({
        panning: { disabled: true },
      });
      pan({ x: -100, y: -100 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
  });

  describe("panning.velocityDisabled", () => {
    it("prevents inertia after pan gesture", () => {
      const { content, pan } = renderApp({
        panning: { velocityDisabled: true },
        velocityAnimation: { disabled: false },
      });
      pan({ x: -100, y: -100 });
      const transformAfterPan = content.style.transform;
      expect(transformAfterPan).toBe("translate(-100px, -100px) scale(1)");
    });
  });

  describe("panning.lockAxisX", () => {
    it("locks horizontal movement — only Y changes", () => {
      const { content, pan } = renderApp({
        panning: { lockAxisX: true },
      });
      pan({ x: -100, y: -100 });
      expect(content.style.transform).toBe("translate(0px, -100px) scale(1)");
    });
  });

  describe("panning.lockAxisY", () => {
    it("locks vertical movement — only X changes", () => {
      const { content, pan } = renderApp({
        panning: { lockAxisY: true },
      });
      pan({ x: -100, y: -100 });
      expect(content.style.transform).toBe("translate(-100px, 0px) scale(1)");
    });
  });

  describe("panning.allowLeftClickPan", () => {
    it("disables left-click pan when set to false", () => {
      const { content, pan } = renderApp({
        panning: { allowLeftClickPan: false },
      });
      pan({ x: -100, y: -100 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
  });

  describe("panning.allowMiddleClickPan", () => {
    it("enables middle-click pan when set to true", () => {
      const { content } = renderApp({
        panning: { allowMiddleClickPan: true },
      });
      fireEvent.mouseDown(content, { button: 1, clientX: 100, clientY: 100, buttons: 4 });
      fireEvent.mouseMove(content, { clientX: 50, clientY: 50, buttons: 4 });
      fireEvent.mouseUp(content);
      expect(content.style.transform).not.toBe(
        "translate(0px, 0px) scale(1)",
      );
    });
  });

  describe("panning.allowRightClickPan", () => {
    it("enables right-click pan when set to true", () => {
      const { content } = renderApp({
        panning: { allowRightClickPan: true },
      });
      fireEvent.mouseDown(content, { button: 2, clientX: 100, clientY: 100, buttons: 2 });
      fireEvent.mouseMove(content, { clientX: 50, clientY: 50, buttons: 2 });
      fireEvent.mouseUp(content);
      expect(content.style.transform).not.toBe(
        "translate(0px, 0px) scale(1)",
      );
    });
  });

  describe("panning.activationKeys", () => {
    it("requires specified key for panning when set", () => {
      const { content, pan } = renderApp({
        panning: { activationKeys: ["Shift"] },
      });
      pan({ x: -100, y: -100 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");

      fireEvent.keyDown(document, { key: "Shift" });
      pan({ x: -100, y: -100 });
      expect(content.style.transform).not.toBe(
        "translate(0px, 0px) scale(1)",
      );
    });

    it("supports predicate function for activationKeys", () => {
      const { content, pan } = renderApp({
        panning: {
          activationKeys: (keys: string[]) => keys.includes("Alt"),
        },
      });
      pan({ x: -100, y: -100 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
  });

  describe("panning.excluded", () => {
    it("does not start pan from excluded CSS class", () => {
      const { content, wrapper } = renderApp({
        panning: { excluded: ["panningDisabled"] },
      });
      const excluded = wrapper.querySelector(".panningDisabled");
      expect(excluded).toBeTruthy();

      fireEvent.mouseDown(excluded!, { clientX: 10, clientY: 10 });
      fireEvent.mouseMove(excluded!, { clientX: 60, clientY: 60 });
      fireEvent.mouseUp(excluded!);
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
  });
});
