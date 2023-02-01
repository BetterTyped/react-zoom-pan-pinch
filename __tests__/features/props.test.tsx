import { renderExample } from "../shared/render.shared";

describe("Library components", () => {
  describe("When library components have been rendered", () => {
    test("it renders transform component without errors", () => {
      const { content, wrapper } = renderExample();
      expect(content).toBeDefined();
      expect(wrapper).toBeDefined();
    });
  });
});
