import { act, waitFor } from "@testing-library/react";

import { renderApp } from "../../utils";

describe("Base [Resize]", () => {
  describe("When wrapper is resized", () => {
    it("should align to bounds", async () => {
      const { ref, wrapper } = renderApp({
        limitToBounds: true,
        disablePadding: true,
      });

      ref.current!.setTransform(-200, -200, 2);
      expect(ref.current!.instance.state.positionX).toBe(-200);

      wrapper.style.width = "300px";
      wrapper.style.height = "300px";

      act(() => {
        ref.current!.setTransform(
          ref.current!.instance.state.positionX,
          ref.current!.instance.state.positionY,
          ref.current!.instance.state.scale,
        );
      });

      await waitFor(() => {
        expect(ref.current!.instance.state.positionX).toBeGreaterThanOrEqual(
          -200,
        );
      });
    });
  });
});
