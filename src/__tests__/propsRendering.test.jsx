import React from "react";
import { render } from "@testing-library/react";
import { SharedTestComponent, testComponentCssValueToBe } from "./shared";

describe("Library components", () => {
  const environment = {};

  beforeEach(async () => {
    environment.renderWithProps = props =>
      (environment.component = render(
        <SharedTestComponent
          {...props}
          getComponentState={values => (environment.state = values)}
        />,
      ));
    environment.getTransformComponent = () =>
      environment.component.container.querySelector(".react-transform-element");
  });
  describe("When library components have been rendered", () => {
    test("it renders transform component without errors", () => {
      const { renderWithProps, getTransformComponent } = environment;
      renderWithProps({});
      expect(getTransformComponent()).toBeDefined();
    });
  });
  describe("When library components are in their initial state", () => {
    test("it allows to change initial scale value after passing defaultScale prop", () => {
      const { renderWithProps, getTransformComponent } = environment;
      const defaultScale = 2;
      //re-render
      renderWithProps({ defaultScale });
      //check changed value
      testComponentCssValueToBe(
        getTransformComponent(),
        "transform",
        `scale(${defaultScale})`,
      );
    });
    test("it allows to change initial positionX value after passing defaultPositionX prop", () => {
      const { renderWithProps, getTransformComponent } = environment;
      const defaultPositionX = 100;
      //re-render
      renderWithProps({ defaultPositionX });
      //check changed value
      testComponentCssValueToBe(
        getTransformComponent(),
        "transform",
        `translate(${defaultPositionX}px, 0px)`,
      );
    });
    test("it allows to change initial positionY value after passing defaultPositionY prop", () => {
      const { renderWithProps, getTransformComponent } = environment;
      const defaultPositionY = -100;
      //re-render
      renderWithProps({ defaultPositionY });
      //check changed value
      testComponentCssValueToBe(
        getTransformComponent(),
        "transform",
        `translate(0px, ${defaultPositionY}px)`,
      );
    });
  });
});
