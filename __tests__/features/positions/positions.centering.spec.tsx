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
        expect(ref.current!.instance.state.positionX).toBe(50);
        expect(ref.current!.instance.state.positionY).toBe(50);
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

      expect(ref.current!.instance.state.positionX).toBe(0);
      expect(ref.current!.instance.state.positionY).toBe(0);
    });
    it("should center content with centerZoomedOut and disablePadding", async () => {
      const { content } = renderApp({
        wrapperWidth: "100px",
        wrapperHeight: "100px",
        contentWidth: "50px",
        contentHeight: "50px",
        centerZoomedOut: true,
        disablePadding: true,
      });

      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
  });

  describe("When rendering initially zoomed in content", () => {
    it("should not center the content with centerZoomedOut", async () => {
      const { ref } = renderApp({
        wrapperWidth: "200px",
        wrapperHeight: "200px",
        contentWidth: "400px",
        contentHeight: "400px",
        centerZoomedOut: true,
      });

      expect(ref.current!.instance.state.positionX).toBe(0);
      expect(ref.current!.instance.state.positionY).toBe(0);
    });
    it("should center big content with centerOnInit", async () => {
      const { ref } = renderApp({
        wrapperWidth: "200px",
        wrapperHeight: "200px",
        contentWidth: "400px",
        contentHeight: "400px",
        centerOnInit: true,
      });

      await waitFor(() => {
        expect(ref.current!.instance.state.positionX).toBe(-100);
        expect(ref.current!.instance.state.positionY).toBe(-100);
      });
    });
  });

  describe("When using centerView programmatically", () => {
    it("should center via ref.centerView", async () => {
      const { ref } = renderApp({
        wrapperWidth: "200px",
        wrapperHeight: "200px",
        contentWidth: "400px",
        contentHeight: "400px",
      });

      expect(ref.current!.instance.state.positionX).toBe(0);

      ref.current!.centerView();
      await waitFor(() => {
        expect(ref.current!.instance.state.positionX).toBe(-100);
        expect(ref.current!.instance.state.positionY).toBe(-100);
      });
    });
  });
});
