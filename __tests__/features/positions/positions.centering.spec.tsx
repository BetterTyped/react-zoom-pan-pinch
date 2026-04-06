import { waitFor } from "@testing-library/react";

import { renderApp } from "../../utils";

describe("Positions [Centering]", () => {
  describe("When rendering initially zoomed out content", () => {
    it("should center the content with centerOnInit", async () => {
      const { ref } = renderApp({
        wrapperWidth: "200px",
        wrapperHeight: "200px",
        contentWidth: "100px",
        contentHeight: "100px",
        centerOnInit: true,
      });

      await waitFor(() => {
        expect(ref.current?.instance.state.positionX).toBe(50);
        expect(ref.current?.instance.state.positionY).toBe(50);
      });
    });
    it("should not center the content with centerOnInit disabled", async () => {
      const { ref } = renderApp({
        wrapperWidth: "200px",
        wrapperHeight: "200px",
        contentWidth: "100px",
        contentHeight: "100px",
        centerOnInit: false,
      });

      expect(ref.current?.instance.state.positionX).toBe(0);
      expect(ref.current?.instance.state.positionY).toBe(0);
    });
  });
  describe("When rendering initially zoomed in content", () => {
    it("should not center the content with centerOnInit", async () => {
      const { ref } = renderApp({
        wrapperWidth: "200px",
        wrapperHeight: "200px",
        contentWidth: "400px",
        contentHeight: "400px",
        centerOnInit: false,
      });

      expect(ref.current?.instance.state.positionX).toBe(0);
      expect(ref.current?.instance.state.positionY).toBe(0);
    });
  });
});
