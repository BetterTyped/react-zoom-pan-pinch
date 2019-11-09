import React from "react";
import { render } from "@testing-library/react";
import { initialState } from "../store/InitialState";
import { SharedTestComponent, testComponentCssValueToBe } from "./shared";

describe("Library components", () => {
  const environment = {};

  beforeEach(async () => {
    const component = render(<SharedTestComponent />);
    const { container, rerender } = component;
    environment.component = component;
    environment.rerenderWithProps = props =>
      rerender(<SharedTestComponent {...props} />);
    environment.getTransformComponent = () =>
      container.querySelector(".react-transform-element");
  });
  describe("When library components have been rendered", () => {
    test("it renders transform component without errors", () => {
      const { getTransformComponent } = environment;
      expect(getTransformComponent()).toBeDefined();
    });
  });
  describe("When library components are not in their initial state", () => {
    test("it allows to change initial scale value after passing defaultScale prop", () => {
      const { rerenderWithProps, getTransformComponent } = environment;
      const defaultScale = 2;
      //check initial value
      testComponentCssValueToBe(
        getTransformComponent(),
        "transform",
        `scale(${initialState.scale})`,
      );
      //re-render
      rerenderWithProps({ defaultScale });

      //check changed value
      testComponentCssValueToBe(
        getTransformComponent(),
        "transform",
        `scale(${defaultScale})`,
      );
    });
    test("it allows to change initial positionX value after passing defaultPositionX prop", () => {
      const { rerenderWithProps, getTransformComponent } = environment;
      const defaultPositionX = 100;
      //check initial value
      testComponentCssValueToBe(
        getTransformComponent(),
        "transform",
        `transform(${initialState.positionX}px, 0px)`,
      );
      //re-render
      rerenderWithProps({ defaultPositionX });

      //check changed value
      testComponentCssValueToBe(
        getTransformComponent(),
        "transform",
        `transform(${defaultPositionX}px, 0px)`,
      );
    });
    test("it allows to change initial positionY value after passing defaultPositionY prop", () => {
      const { rerenderWithProps, getTransformComponent } = environment;
      const defaultPositionY = -100;
      //check initial value
      testComponentCssValueToBe(
        getTransformComponent(),
        "transform",
        `transform(0px, ${initialState.positionX}px)`,
      );
      //re-render
      rerenderWithProps({ defaultPositionY });

      //check changed value
      testComponentCssValueToBe(
        getTransformComponent(),
        "transform",
        `transform(0px, ${defaultPositionY}px)`,
      );
    });
  });
});
