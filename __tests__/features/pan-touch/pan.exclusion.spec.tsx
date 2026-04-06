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
          { pageX: 0, pageY: 0, clientX: 0, clientY: 0, target: excluded },
        ],
      });
      fireEvent.touchMove(excluded, {
        touches: [
          {
            pageX: -100,
            pageY: -100,
            clientX: -100,
            clientY: -100,
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
    it("should not affect scale when touch panning excluded element", async () => {
      const { wrapper, ref } = renderApp({
        panning: { excluded: ["panningDisabled"] },
      });

      const excluded = wrapper.querySelector(".panningDisabled") as HTMLElement;

      fireEvent.touchStart(excluded, {
        touches: [
          { pageX: 0, pageY: 0, clientX: 0, clientY: 0, target: excluded },
        ],
      });
      fireEvent.touchMove(excluded, {
        touches: [
          {
            pageX: 50,
            pageY: 50,
            clientX: 50,
            clientY: 50,
            target: excluded,
          },
        ],
      });
      fireEvent.touchEnd(excluded, { touches: [] });

      expect(ref.current?.instance.state.scale).toBe(1);
    });
  });
});
