import { waitFor } from "@testing-library/dom";

import { renderApp } from "../../utils/render-app";

describe("Pinch [Panning]", () => {
  describe("When pinch zooming", () => {
    it("should allow for panning during pinch gesture", async () => {
      const { ref, content, pinch } = renderApp();
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      pinch({ value: 1.5, targetCenter: [-20, -20] });
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeCloseTo(1.5, 1);
        expect(ref.current?.instance.state.positionX).toBeCloseTo(-20, 0);
        expect(ref.current?.instance.state.positionY).toBeCloseTo(-20, 0);
      });
    });
  });
});
