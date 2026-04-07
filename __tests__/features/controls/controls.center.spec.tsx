import { fireEvent, waitFor } from "@testing-library/react";

import { renderApp } from "../../utils/render-app";

describe("Controls [Center]", () => {
  describe("When centering with controls button", () => {
    it("should change css transform", async () => {
      const { content, centerBtn, zoom } = renderApp();
      zoom({ value: 1.65 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1.65)");
      fireEvent(centerBtn, new MouseEvent("click", { bubbles: true }));
      await waitFor(() => {
        expect(content.style.transform).toBe(
          "translate(-162.5px, -162.5px) scale(1.65)",
        );
      });
    });

    it("should be a no-op at scale 1 when content fits wrapper", async () => {
      const { content, centerBtn } = renderApp();
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");

      fireEvent(centerBtn, new MouseEvent("click", { bubbles: true }));

      await waitFor(() => {
        expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      });
    });

    it("should update ref state with centered position", async () => {
      const { ref, centerBtn, zoom } = renderApp();
      zoom({ value: 1.65 });

      fireEvent(centerBtn, new MouseEvent("click", { bubbles: true }));

      await waitFor(() => {
        expect(ref.current?.instance.state.positionX).toBe(-162.5);
        expect(ref.current?.instance.state.positionY).toBe(-162.5);
        expect(ref.current?.instance.state.scale).toBe(1.65);
      });
    });

    it("should recenter after panning at zoomed scale", async () => {
      const { content, centerBtn, zoom, pan } = renderApp();
      zoom({ value: 1.65 });
      pan({ x: -50, y: -50 });
      expect(content.style.transform).toBe(
        "translate(-50px, -50px) scale(1.65)",
      );

      fireEvent(centerBtn, new MouseEvent("click", { bubbles: true }));
      await waitFor(() => {
        expect(content.style.transform).toBe(
          "translate(-162.5px, -162.5px) scale(1.65)",
        );
      });
    });

    it("should center correctly when content is larger than wrapper", async () => {
      const { ref, centerBtn } = renderApp({
        wrapperWidth: "200px",
        wrapperHeight: "200px",
        contentWidth: "400px",
        contentHeight: "400px",
      });

      fireEvent(centerBtn, new MouseEvent("click", { bubbles: true }));

      await waitFor(() => {
        expect(ref.current?.instance.state.positionX).toBe(-100);
        expect(ref.current?.instance.state.positionY).toBe(-100);
        expect(ref.current?.instance.state.scale).toBe(1);
      });
    });
  });
});
