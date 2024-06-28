import { waitFor } from "@testing-library/dom";

import { renderApp } from "../../utils/render-app";

describe("Pinch [Base]", () => {
  describe("When pinch zooming", () => {
    it("should increase transform scale", async () => {
      const { ref, content, pinch } = renderApp();
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      pinch({ value: 1.5 });
      await waitFor(() => {
        expect(content.style.transform).toBe("translate(0px, 0px) scale(1.5)");
        expect(ref.current?.instance.state.scale).toBe(1.5);
      });
    });
  });
});
