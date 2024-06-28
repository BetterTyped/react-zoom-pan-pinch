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
  });
});
