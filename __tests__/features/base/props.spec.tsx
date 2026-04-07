import { renderApp } from "../../utils/render-app";

describe("Library components", () => {
  describe("When library components have been rendered", () => {
    test("it renders transform component without errors", () => {
      const { content, wrapper } = renderApp();
      expect(content).toBeDefined();
      expect(wrapper).toBeDefined();
    });
  });
});
