import { fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderApp } from "../../utils";

describe("ReactZoomPanPinchProps.wheel", () => {
  describe("wheel.step", () => {
    it("higher step produces larger scale change per wheel event", () => {
      const run = (step: number) => {
        const { content, ref, unmount } = renderApp({
          smooth: false,
          wheel: { step },
        });
        userEvent.hover(content);
        for (let i = 0; i < 5; i += 1) {
          fireEvent(
            content,
            new WheelEvent("wheel", { bubbles: true, deltaY: -8 }),
          );
        }
        const { scale } = ref.current!.instance.state;
        unmount();
        return scale;
      };
      expect(run(0.1)).toBeGreaterThan(run(0.02));
    });
  });

  describe("wheel.disabled", () => {
    it("blocks all wheel interactions when true", () => {
      const { content, ref } = renderApp({
        wheel: { disabled: true },
      });
      userEvent.hover(content);
      fireEvent(
        content,
        new WheelEvent("wheel", { bubbles: true, deltaY: -10 }),
      );
      expect(ref.current!.instance.state.scale).toBe(1);
    });
  });

  describe("wheel.wheelDisabled", () => {
    it("blocks non-touchpad wheel zoom when true", () => {
      const { content, ref } = renderApp({
        smooth: false,
        wheel: { wheelDisabled: true },
      });
      userEvent.hover(content);
      fireEvent(
        content,
        new WheelEvent("wheel", { bubbles: true, deltaY: -10 }),
      );
      expect(ref.current!.instance.state.scale).toBe(1);
    });
  });

  describe("wheel.touchPadDisabled", () => {
    it("blocks ctrl+wheel (trackpad pinch) zoom when true", () => {
      const { content, ref } = renderApp({
        smooth: false,
        wheel: { touchPadDisabled: true },
      });
      userEvent.hover(content);
      fireEvent(
        content,
        new WheelEvent("wheel", {
          bubbles: true,
          deltaY: -40,
          ctrlKey: true,
          deltaMode: 0,
        }),
      );
      expect(ref.current!.instance.state.scale).toBe(1);
    });
  });

  describe("wheel.activationKeys", () => {
    it("requires specified key to be pressed for wheel zoom", () => {
      const { content, ref } = renderApp({
        wheel: { activationKeys: ["Control"] },
      });
      userEvent.hover(content);
      fireEvent(
        content,
        new WheelEvent("wheel", { bubbles: true, deltaY: -5 }),
      );
      expect(ref.current!.instance.state.scale).toBe(1);

      // Real browsers include ctrlKey on WheelEvent when Control is held;
      // syncModifierKeys reads it so keyDown alone is not enough in tests.
      fireEvent(
        content,
        new WheelEvent("wheel", { bubbles: true, deltaY: -5, ctrlKey: true }),
      );
      expect(ref.current!.instance.state.scale).toBeGreaterThan(1);
    });

    it("supports predicate function for activationKeys", () => {
      const { content, ref } = renderApp({
        wheel: {
          activationKeys: (keys: string[]) => keys.includes("Meta"),
        },
      });
      userEvent.hover(content);
      fireEvent(
        content,
        new WheelEvent("wheel", { bubbles: true, deltaY: -5 }),
      );
      expect(ref.current!.instance.state.scale).toBe(1);

      fireEvent(
        content,
        new WheelEvent("wheel", { bubbles: true, deltaY: -5, metaKey: true }),
      );
      expect(ref.current!.instance.state.scale).toBeGreaterThan(1);
    });
  });

  describe("wheel.excluded", () => {
    it("does not zoom when wheel event originates on excluded element", () => {
      const { wrapper, ref } = renderApp({
        wheel: { excluded: ["wheelDisabled"] },
      });
      const excluded = wrapper.querySelector(".wheelDisabled");
      expect(excluded).toBeTruthy();

      userEvent.hover(excluded!);
      fireEvent(
        excluded!,
        new WheelEvent("wheel", { bubbles: true, deltaY: -10 }),
      );
      expect(ref.current!.instance.state.scale).toBe(1);
    });
  });
});
