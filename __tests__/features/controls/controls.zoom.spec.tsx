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
          "translate(-162.5px, -162.5px) scale(1.65)",
        );
      });
      fireEvent(centerBtn, new MouseEvent("click", { bubbles: true }));
      await sleep(40);
      await waitFor(() => {
        expect(content.style.transform).toBe(
          "translate(-162.5px, -162.5px) scale(1.65)",
        );
      });
    });
  });
  describe("When zooming out with controls button", () => {
    it("should change css scale", async () => {
      const { content, zoomOutBtn, zoom } = renderApp();

      zoom({ value: 1.65 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1.65)");
      fireEvent(zoomOutBtn, new MouseEvent("click", { bubbles: true }));
      await waitFor(() => {
        expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      });
    });
  });
});
