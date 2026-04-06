import { fireEvent, waitFor } from "@testing-library/react";

import { renderApp } from "../../utils/render-app";

describe("Controls [Reset]", () => {
  describe("When resetting state with controls button", () => {
    it("should change css scale", async () => {
      const { content, resetBtn, zoom } = renderApp();
      zoom({ value: 1.65 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1.65)");
      fireEvent(resetBtn, new MouseEvent("click", { bubbles: true }));
      await waitFor(() => {
        expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      });
    });

    it("should restore ref state to initial values", async () => {
      const { ref, resetBtn, zoom } = renderApp();
      zoom({ value: 2 });
      expect(ref.current?.instance.state.scale).toBe(2);

      fireEvent(resetBtn, new MouseEvent("click", { bubbles: true }));

      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBe(1);
        expect(ref.current?.instance.state.positionX).toBe(0);
        expect(ref.current?.instance.state.positionY).toBe(0);
      });
    });

    it("should restore position after panning", async () => {
      const { content, resetBtn, pan } = renderApp();
      pan({ x: -100, y: -100 });
      expect(content.style.transform).toBe(
        "translate(-100px, -100px) scale(1)",
      );

      fireEvent(resetBtn, new MouseEvent("click", { bubbles: true }));
      await waitFor(() => {
        expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      });
    });

    it("should restore both position and scale after pan and zoom", async () => {
      const { content, ref, resetBtn, zoom, pan } = renderApp();
      zoom({ value: 1.65 });
      pan({ x: -50, y: -50 });
      expect(ref.current?.instance.state.scale).toBe(1.65);
      expect(ref.current?.instance.state.positionX).toBe(-50);

      fireEvent(resetBtn, new MouseEvent("click", { bubbles: true }));
      await waitFor(() => {
        expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      });
    });

    it("should be a no-op when already at initial state", async () => {
      const { content, resetBtn } = renderApp();
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");

      fireEvent(resetBtn, new MouseEvent("click", { bubbles: true }));

      await waitFor(() => {
        expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      });
    });
  });
});
