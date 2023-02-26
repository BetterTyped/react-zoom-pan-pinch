import { renderExample } from "../shared/render.shared";

describe("Example view", () => {
  describe("When example view has been rendered", () => {
    test("it renders entire example without errors", () => {
      const { wrapper } = renderExample();

      expect(wrapper).toBeDefined();
    });
    test("it renders center in button without errors", () => {
      const { center } = renderExample();

      expect(center).toBeDefined();
    });
    test("it renders zoom in button without errors", () => {
      const { zoomInBtn } = renderExample();

      expect(zoomInBtn).toBeDefined();
    });
    test("it renders zoom out button without errors", () => {
      const { zoomOutBtn } = renderExample();

      expect(zoomOutBtn).toBeDefined();
    });
    test("it renders reset button without errors", () => {
      const { resetBtn } = renderExample();

      expect(resetBtn).toBeDefined();
    });
    test("it renders transform component without errors", () => {
      const { content } = renderExample();

      expect(content).toBeDefined();
    });
  });
});
