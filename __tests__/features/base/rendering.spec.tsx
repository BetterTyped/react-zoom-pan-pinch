import { renderApp } from "../../utils/render-app";

describe("Example view", () => {
  describe("When example view has been rendered", () => {
    test("it renders entire example without errors", () => {
      const { wrapper } = renderApp();

      expect(wrapper).toBeDefined();
    });
    test("it renders center in button without errors", () => {
      const { centerBtn } = renderApp();

      expect(centerBtn).toBeDefined();
    });
    test("it renders zoom in button without errors", () => {
      const { zoomInBtn } = renderApp();

      expect(zoomInBtn).toBeDefined();
    });
    test("it renders zoom out button without errors", () => {
      const { zoomOutBtn } = renderApp();

      expect(zoomOutBtn).toBeDefined();
    });
    test("it renders reset button without errors", () => {
      const { resetBtn } = renderApp();

      expect(resetBtn).toBeDefined();
    });
    test("it renders transform component without errors", () => {
      const { content } = renderApp();

      expect(content).toBeDefined();
    });
  });
});
