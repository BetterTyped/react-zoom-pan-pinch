import React from "react";
import { render } from "@testing-library/react";
import { clickOnComponent } from "./utils";
import App from "../../example/src/App";

describe("Example view", () => {
  describe("When example view has been rendered", () => {
    const environment = {};

    beforeEach(async () => {
      const component = render(<App />);
      const { getByTestId, getByAltText, getAllByText, container } = component;
      environment.component = component;
      // set controls buttons
      environment.toggleBtn = getByTestId("toggle-button");
      environment.zoomInBtn = getByTestId("zoom-in-button");
      environment.zoomOutBtn = getByTestId("zoom-out-button");
      environment.resetBtn = getByTestId("reset-button");
      // set transform content
      environment.transformComponent = container.querySelector(
        ".react-transform-element",
      );
      // set transform element
      environment.getImgElement = () => getByAltText("example-element");
      environment.getTextElement = () => getAllByText(/Lorem ipsum/)[0];
    });
    test("it renders entire example without errors", () => {
      const { container } = environment.component;
      expect(container).toBeDefined();
    });
    test("it renders toggle button without errors", () => {
      const { toggleBtn } = environment;
      expect(toggleBtn).toBeDefined();
    });
    test("it renders zoom in button without errors", () => {
      const { zoomInBtn } = environment;
      expect(zoomInBtn).toBeDefined();
    });
    test("it renders zoom out button without errors", () => {
      const { zoomOutBtn } = environment;
      expect(zoomOutBtn).toBeDefined();
    });
    test("it renders reset button without errors", () => {
      const { resetBtn } = environment;
      expect(resetBtn).toBeDefined();
    });
    test("it renders transform component without errors", () => {
      const { transformComponent } = environment;
      expect(transformComponent).toBeDefined();
    });
    test("it renders image element without errors", () => {
      const { getImgElement } = environment;
      expect(getImgElement()).toBeDefined();
    });
    test("it renders text element without errors when toggle button get clicked", () => {
      const { getTextElement, toggleBtn } = environment;
      clickOnComponent(toggleBtn);
      expect(getTextElement()).toBeDefined();
    });
  });
});
