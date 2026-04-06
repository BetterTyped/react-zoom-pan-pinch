import { fireEvent } from "@testing-library/react";

import { renderApp } from "../../utils";

describe("Zoom [Exclusion]", () => {
  describe("When excluding element", () => {
    it("should not allow for zooming on excluded element", async () => {
      const { wrapper, ref } = renderApp({
        wheel: { excluded: ["wheelDisabled"] },
      });

      const excluded = wrapper.querySelector(".wheelDisabled") as HTMLElement;

      fireEvent(
        excluded,
        new WheelEvent("wheel", { bubbles: true, deltaY: -1 }),
      );
      fireEvent(
        excluded,
        new WheelEvent("wheel", { bubbles: true, deltaY: -1 }),
      );

      expect(ref.current?.instance.state.scale).toBe(1);
    });
    it("should allow zooming on other elements", async () => {
      const { content, ref } = renderApp({
        wheel: { excluded: ["wheelDisabled"] },
      });

      fireEvent(
        content,
        new WheelEvent("wheel", { bubbles: true, deltaY: -1 }),
      );

      expect(ref.current?.instance.state.scale).toBeGreaterThan(1);
    });
  });
});
