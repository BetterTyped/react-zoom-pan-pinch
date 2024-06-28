import { waitFor } from "@testing-library/dom";

import { renderApp } from "../../utils/render-app";

describe("Pinch [Base]", () => {
  describe("When content is the same size as wrapper", () => {
    it("should change transform scale", async () => {
      const { ref, content, pinch } = renderApp();
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      pinch({ value: 1.5 });
      await waitFor(() => {
        expect(content.style.transform).toBe("translate(0px, 0px) scale(1.5)");
        expect(ref.current?.instance.state.scale).toBe(1.5);
      });
    });
    it("should zoom to the position of midpoint", async () => {
      // TODO: Implement test
      expect(true).toBe(true);
    });
    it("should zoom out from position of midpoint", async () => {
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
    it("should change transform scale", async () => {
      // TODO: Implement test
      expect(true).toBe(true);
    });
    it("should zoom to the position of midpoint", async () => {
      // TODO: Implement test
      expect(true).toBe(true);
    });
    it("should zoom out from position of midpoint", async () => {
      // TODO: Implement test
      expect(true).toBe(true);
    });
    it("should return to bounds after zooming out", async () => {
      // TODO: Implement test
      expect(true).toBe(true);
    });
  });
});
