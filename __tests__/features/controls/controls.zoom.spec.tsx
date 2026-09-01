import { fireEvent, waitFor } from "@testing-library/react";

import { renderApp } from "../../utils/render-app";
import { sleep } from "../../utils";

describe("Controls [Zoom]", () => {
  describe("When zooming in with controls button", () => {
    it("should change css scale", async () => {
      const { content, zoomInBtn, centerBtn } = renderApp();
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      fireEvent(zoomInBtn, new MouseEvent("click", { bubbles: true }));
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      await waitFor(() => {
        expect(content.style.transform).toBe(
          "translate(-125px, -125px) scale(1.5)",
        );
      });
      fireEvent(centerBtn, new MouseEvent("click", { bubbles: true }));
      await sleep(40);
      await waitFor(() => {
        expect(content.style.transform).toBe(
          "translate(-125px, -125px) scale(1.5)",
        );
      });
    });

    it("should update ref state after animation", async () => {
      const { ref, zoomInBtn } = renderApp();
      expect(ref.current?.instance.state.scale).toBe(1);

      fireEvent(zoomInBtn, new MouseEvent("click", { bubbles: true }));

      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBe(1.5);
      });
    });

    it("should increase scale further on multiple clicks", async () => {
      const { ref, zoomInBtn } = renderApp();

      fireEvent(zoomInBtn, new MouseEvent("click", { bubbles: true }));
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBe(1.5);
      });

      fireEvent(zoomInBtn, new MouseEvent("click", { bubbles: true }));
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBe(2);
      });
    });

    it("should not change transform synchronously (animation is async)", () => {
      const { content, zoomInBtn } = renderApp();
      fireEvent(zoomInBtn, new MouseEvent("click", { bubbles: true }));
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
  });
  describe("When zooming out with controls button", () => {
    it("should change css scale", async () => {
      const { content, zoomOutBtn, zoom } = renderApp();

      zoom({ value: 1.5 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1.5)");
      fireEvent(zoomOutBtn, new MouseEvent("click", { bubbles: true }));
      await waitFor(() => {
        expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      });
    });

    it("should update ref state after animation", async () => {
      const { ref, zoomOutBtn, zoom } = renderApp();
      zoom({ value: 2 });
      expect(ref.current?.instance.state.scale).toBe(2);

      fireEvent(zoomOutBtn, new MouseEvent("click", { bubbles: true }));

      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeLessThan(2);
      });
    });

    it("should not zoom below minScale", async () => {
      const { ref, zoomOutBtn } = renderApp();
      expect(ref.current?.instance.state.scale).toBe(1);

      fireEvent(zoomOutBtn, new MouseEvent("click", { bubbles: true }));

      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeGreaterThanOrEqual(1);
      });
    });
  });
});
