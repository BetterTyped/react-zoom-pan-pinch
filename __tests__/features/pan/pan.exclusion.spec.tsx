import { fireEvent } from "@testing-library/react";

import { renderApp } from "../../utils";

describe("Pan [Exclusion]", () => {
  describe("When excluding element", () => {
    it("should not allow for panning on excluded element", async () => {
      const { wrapper, content } = renderApp({
        panning: { excluded: ["panningDisabled"] },
      });

      const excluded = wrapper.querySelector(".panningDisabled") as HTMLElement;

      fireEvent.mouseDown(excluded, { clientX: 0, clientY: 0 });
      fireEvent.mouseMove(excluded, { clientX: -100, clientY: -100 });
      fireEvent.mouseUp(excluded);

      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
    it("should allow panning on other elements", async () => {
      const { content, pan } = renderApp({
        panning: { excluded: ["panningDisabled"] },
      });

      pan({ x: -100, y: -100 });
      expect(content.style.transform).toBe(
        "translate(-100px, -100px) scale(1)",
      );
    });
  });
});
