import { fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderApp } from "../../utils";

/** MouseEvent.buttons while the primary button is held (matches renderApp `pan` helper). */
const BUTTONS_WHILE_DOWN: Record<number, number> = {
  0: 1,
  1: 4,
  2: 2,
};

function panWithButton(
  content: HTMLElement,
  button: number,
  x: number,
  y: number,
) {
  const buttons = BUTTONS_WHILE_DOWN[button];
  userEvent.hover(content);
  fireEvent.mouseDown(content, { clientX: 0, clientY: 0, button, buttons });
  fireEvent.mouseMove(content, { clientX: x, clientY: y, buttons });
  fireEvent.mouseUp(content, { button, buttons: 0 });
  fireEvent.blur(content);
}

describe("Pan [Clicks]", () => {
  describe("When allowing for left click pan", () => {
    it("should allow for panning with left click", async () => {
      const { content } = renderApp({
        panning: {
          allowLeftClickPan: true,
          allowMiddleClickPan: false,
          allowRightClickPan: false,
        },
      });

      panWithButton(content, 0, -100, -100);
      expect(content.style.transform).toBe(
        "translate(-100px, -100px) scale(1)",
      );
    });
    it("should not allow for panning with other clicks", async () => {
      const { content } = renderApp({
        panning: {
          allowLeftClickPan: true,
          allowMiddleClickPan: false,
          allowRightClickPan: false,
        },
      });

      panWithButton(content, 1, -100, -100);
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");

      panWithButton(content, 2, -100, -100);
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
  });
  describe("When allowing for middle click pan", () => {
    it("should allow for panning with middle click", async () => {
      const { content } = renderApp({
        panning: {
          allowLeftClickPan: false,
          allowMiddleClickPan: true,
          allowRightClickPan: false,
        },
      });

      panWithButton(content, 1, -100, -100);
      expect(content.style.transform).toBe(
        "translate(-100px, -100px) scale(1)",
      );
    });
    it("should not allow for panning with other clicks", async () => {
      const { content } = renderApp({
        panning: {
          allowLeftClickPan: false,
          allowMiddleClickPan: true,
          allowRightClickPan: false,
        },
      });

      panWithButton(content, 0, -100, -100);
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");

      panWithButton(content, 2, -100, -100);
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
  });
  describe("When allowing for right click pan", () => {
    it("should allow for panning with right click", async () => {
      const { content } = renderApp({
        panning: {
          allowLeftClickPan: false,
          allowMiddleClickPan: false,
          allowRightClickPan: true,
        },
      });

      panWithButton(content, 2, -100, -100);
      expect(content.style.transform).toBe(
        "translate(-100px, -100px) scale(1)",
      );
    });
    it("should not allow for panning with other clicks", async () => {
      const { content } = renderApp({
        panning: {
          allowLeftClickPan: false,
          allowMiddleClickPan: false,
          allowRightClickPan: true,
        },
      });

      panWithButton(content, 0, -100, -100);
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");

      panWithButton(content, 1, -100, -100);
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
  });
  describe("When allowing panning with any click", () => {
    it("should allow for panning with left click", async () => {
      const { content } = renderApp({
        panning: {
          allowLeftClickPan: true,
          allowMiddleClickPan: true,
          allowRightClickPan: true,
        },
      });

      panWithButton(content, 0, -100, -100);
      expect(content.style.transform).toBe(
        "translate(-100px, -100px) scale(1)",
      );
    });
    it("should allow for panning with middle click", async () => {
      const { content } = renderApp({
        panning: {
          allowLeftClickPan: true,
          allowMiddleClickPan: true,
          allowRightClickPan: true,
        },
      });

      panWithButton(content, 1, -100, -100);
      expect(content.style.transform).toBe(
        "translate(-100px, -100px) scale(1)",
      );
    });
    it("should allow for panning with right click", async () => {
      const { content } = renderApp({
        panning: {
          allowLeftClickPan: true,
          allowMiddleClickPan: true,
          allowRightClickPan: true,
        },
      });

      panWithButton(content, 2, -100, -100);
      expect(content.style.transform).toBe(
        "translate(-100px, -100px) scale(1)",
      );
    });
  });
});
