import { fireEvent, waitFor } from "@testing-library/react";

import { renderApp } from "../../utils";

describe("Positions [Centering]", () => {
  describe("When content is smaller than wrapper", () => {
    it("should center with centerOnInit — positive offsets", async () => {
      const { ref } = renderApp({
        wrapperWidth: "200px",
        wrapperHeight: "200px",
        contentWidth: "100px",
        contentHeight: "100px",
        centerOnInit: true,
      });

      // (200 - 100) / 2 = 50
      await waitFor(() => {
        expect(ref.current?.instance.state.positionX).toBe(50);
        expect(ref.current?.instance.state.positionY).toBe(50);
      });
    });

    it("should not center when centerOnInit is disabled", () => {
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

    it("should center via centerView button", async () => {
      const { ref, centerBtn } = renderApp({
        wrapperWidth: "200px",
        wrapperHeight: "200px",
        contentWidth: "100px",
        contentHeight: "100px",
      });

      fireEvent(centerBtn, new MouseEvent("click", { bubbles: true }));

      // (200 - 100) / 2 = 50
      await waitFor(() => {
        expect(ref.current?.instance.state.positionX).toBe(50);
        expect(ref.current?.instance.state.positionY).toBe(50);
        expect(ref.current?.instance.state.scale).toBe(1);
      });
    });

    it("should center via centerView button after zooming", async () => {
      const { ref, centerBtn, zoom } = renderApp({
        wrapperWidth: "200px",
        wrapperHeight: "200px",
        contentWidth: "100px",
        contentHeight: "100px",
      });

      zoom({ value: 2 });

      fireEvent(centerBtn, new MouseEvent("click", { bubbles: true }));

      // (200 - 100*2) / 2 = 0
      await waitFor(() => {
        expect(ref.current?.instance.state.positionX).toBe(0);
        expect(ref.current?.instance.state.positionY).toBe(0);
        expect(ref.current?.instance.state.scale).toBe(2);
      });
    });
  });

  describe("When content is bigger than wrapper", () => {
    it("should center with centerOnInit — negative offsets", async () => {
      const { ref } = renderApp({
        wrapperWidth: "200px",
        wrapperHeight: "200px",
        contentWidth: "400px",
        contentHeight: "400px",
        centerOnInit: true,
      });

      // (200 - 400) / 2 = -100
      await waitFor(() => {
        expect(ref.current?.instance.state.positionX).toBe(-100);
        expect(ref.current?.instance.state.positionY).toBe(-100);
      });
    });

    it("should not center when centerOnInit is disabled", () => {
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

    it("should center via centerView button", async () => {
      const { ref, centerBtn } = renderApp({
        wrapperWidth: "200px",
        wrapperHeight: "200px",
        contentWidth: "400px",
        contentHeight: "400px",
      });

      fireEvent(centerBtn, new MouseEvent("click", { bubbles: true }));

      // (200 - 400) / 2 = -100
      await waitFor(() => {
        expect(ref.current?.instance.state.positionX).toBe(-100);
        expect(ref.current?.instance.state.positionY).toBe(-100);
        expect(ref.current?.instance.state.scale).toBe(1);
      });
    });

    it("should center with centerOnInit at reduced scale", async () => {
      const { ref } = renderApp({
        wrapperWidth: "200px",
        wrapperHeight: "200px",
        contentWidth: "400px",
        contentHeight: "400px",
        centerOnInit: true,
        initialScale: 0.5,
        minScale: 0.1,
      });

      // (200 - 400*0.5) / 2 = 0
      await waitFor(() => {
        expect(ref.current?.instance.state.positionX).toBe(0);
        expect(ref.current?.instance.state.positionY).toBe(0);
        expect(ref.current?.instance.state.scale).toBe(0.5);
      });
    });
  });

  describe("When content and wrapper have asymmetric sizes", () => {
    it("should center with centerOnInit — mixed positive/negative offsets", async () => {
      const { ref } = renderApp({
        wrapperWidth: "200px",
        wrapperHeight: "300px",
        contentWidth: "600px",
        contentHeight: "100px",
        centerOnInit: true,
      });

      // X: (200 - 600) / 2 = -200
      // Y: (300 - 100) / 2 = 100
      await waitFor(() => {
        expect(ref.current?.instance.state.positionX).toBe(-200);
        expect(ref.current?.instance.state.positionY).toBe(100);
      });
    });

    it("should center via centerView button with asymmetric sizes", async () => {
      const { ref, centerBtn } = renderApp({
        wrapperWidth: "300px",
        wrapperHeight: "200px",
        contentWidth: "100px",
        contentHeight: "400px",
      });

      fireEvent(centerBtn, new MouseEvent("click", { bubbles: true }));

      // X: (300 - 100) / 2 = 100
      // Y: (200 - 400) / 2 = -100
      await waitFor(() => {
        expect(ref.current?.instance.state.positionX).toBe(100);
        expect(ref.current?.instance.state.positionY).toBe(-100);
        expect(ref.current?.instance.state.scale).toBe(1);
      });
    });
  });
});
