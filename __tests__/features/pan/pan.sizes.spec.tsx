import { renderApp } from "../../utils";

describe("Pan [Sizes]", () => {
  describe("When content is bigger than wrapper", () => {
    it("should allow panning to the bottom-right end without moving back", async () => {
      const { content, pan } = renderApp({
        wrapperWidth: "100px",
        wrapperHeight: "100px",
        contentWidth: "200px",
        contentHeight: "200px",
        disablePadding: true,
      });

      pan({ x: 150, y: 150 });
      expect(content.style.transform).toBe("translate(100px, 100px) scale(1)");
    });
    it("should allow panning with velocity", async () => {
      // TODO: Implement test
      expect(true).toBe(true);
    });
    it("should not allow to move beyond bounds", async () => {
      // TODO: Implement test
      expect(true).toBe(true);
    });
  });
  describe("When content is smaller than wrapper", () => {
    it("should not allow for panning", async () => {
      const { content, pan } = renderApp({
        wrapperWidth: "100px",
        wrapperHeight: "100px",
        contentWidth: "50px",
        contentHeight: "50px",
        disablePadding: true,
      });

      pan({ x: 150, y: 150 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
    it("should not allow for panning with centering", async () => {
      // TODO: Implement test
      expect(true).toBe(true);
    });
    it("should allow to move content around the wrapper body", async () => {
      // TODO: Implement test
      expect(true).toBe(true);
    });
    it("should not allow to move beyond bounds", async () => {
      // TODO: Implement test
      expect(true).toBe(true);
    });
  });
  describe("When content is equal to wrapper", () => {
    it("should not allow for panning", async () => {
      const { content, pan } = renderApp({
        wrapperWidth: "100px",
        wrapperHeight: "100px",
        contentWidth: "100px",
        contentHeight: "100px",
        disablePadding: true,
      });

      pan({ x: 150, y: 150 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
    it("should allow to move content around the wrapper body", async () => {
      // TODO: Implement test
      expect(true).toBe(true);
    });
    it("should not allow to move beyond bounds", async () => {
      // TODO: Implement test
      expect(true).toBe(true);
    });
  });
});
