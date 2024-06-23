import { fireEvent, waitFor } from "@testing-library/react";

import { renderApp } from "../../utils/render-app";
import { sleep } from "../../utils";

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
  });
});
