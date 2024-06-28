import { renderApp } from "../../utils/render-app";

describe("Base [Rendering]", () => {
  describe("When example view has been rendered", () => {
    it("should render entire example without errors", () => {
      const { wrapper } = renderApp();

      expect(wrapper).toBeDefined();
    });
    it("should render center in button without errors", () => {
      const { centerBtn } = renderApp();

      expect(centerBtn).toBeDefined();
    });
    it("should render zoom in button without errors", () => {
      const { zoomInBtn } = renderApp();

      expect(zoomInBtn).toBeDefined();
    });
    it("should render zoom out button without errors", () => {
      const { zoomOutBtn } = renderApp();

      expect(zoomOutBtn).toBeDefined();
    });
    it("should render reset button without errors", () => {
      const { resetBtn } = renderApp();

      expect(resetBtn).toBeDefined();
    });
    it("should render transform component without errors", () => {
      const { content } = renderApp();

      expect(content).toBeDefined();
    });
  });
  describe("When example view has been rendered", () => {
    it("should render with initial scale", async () => {
      // TODO: Implement test
      expect(true).toBe(true);
    });
    it("should render with limit initial scale to minScale", async () => {
      // TODO: Implement test
      expect(true).toBe(true);
    });
    it("should render with limit initial scale to maxScale", async () => {
      // TODO: Implement test
      expect(true).toBe(true);
    });
    it("should center on initialization", async () => {
      // TODO: Implement test
      expect(true).toBe(true);
    });
  });
});
