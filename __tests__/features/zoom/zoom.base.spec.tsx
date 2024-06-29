import { waitFor } from "@testing-library/dom";

import { renderApp } from "../../utils/render-app";

describe("Zoom [Base]", () => {
  describe("When zooming in with controls button", () => {
    it("should change transform scale", async () => {
      const { ref, content, zoom } = renderApp();
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      zoom({ value: 1.5 });
      await waitFor(() => {
        expect(content.style.transform).toBe("translate(0px, 0px) scale(1.5)");
        expect(ref.current?.instance.state.scale).toBe(1.5);
      });
    });
    it("should not move the center during scroll", async () => {
      // TODO: Implement test
      expect(true).toBe(true);
    });
    it("should zoom to the position of cursor", async () => {
      // TODO: Implement test
      expect(true).toBe(true);
    });
    it("should zoom out from position of cursor", async () => {
      // TODO: Implement test
      expect(true).toBe(true);
    });
    it("should return to bounds after zooming out", async () => {
      // TODO: Implement test
      expect(true).toBe(true);
    });
  });
  describe("When content bigger than wrapper", () => {
    it("should center the content", async () => {
      // TODO: Implement test
      expect(true).toBe(true);
    });
    it("should zoom to the position of cursor", async () => {
      // TODO: Implement test
      expect(true).toBe(true);
    });
    it("should zoom out from position of cursor", async () => {
      // TODO: Implement test
      expect(true).toBe(true);
    });
    it("should return to bounds after zooming out", async () => {
      // TODO: Implement test
      expect(true).toBe(true);
    });
  });
});
