import { fireEvent } from "@testing-library/react";

import { renderApp } from "../../utils";

describe("Pan Touch [Exclusion]", () => {
  describe("When excluding element", () => {
    it("should not allow for panning on excluded element", async () => {
      const { wrapper, content } = renderApp({
        panning: { excluded: ["panningDisabled"] },
      });

      const excluded = wrapper.querySelector(".panningDisabled") as HTMLElement;

      fireEvent.touchStart(excluded, {
        touches: [
          {
            clientX: 0,
            clientY: 0,
            pageX: 0,
            pageY: 0,
            target: excluded,
          },
        ],
      });
      fireEvent.touchMove(excluded, {
        touches: [
          {
            clientX: -100,
            clientY: -100,
            pageX: -100,
            pageY: -100,
            target: excluded,
          },
        ],
      });
      fireEvent.touchEnd(excluded, { touches: [] });

      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
    it("should allow panning on other elements", async () => {
      const { content, touchPan } = renderApp({
        panning: { excluded: ["panningDisabled"] },
      });

      touchPan({ x: -100, y: -100 });
      expect(content.style.transform).toBe(
        "translate(-100px, -100px) scale(1)",
      );
    });
  });
});
