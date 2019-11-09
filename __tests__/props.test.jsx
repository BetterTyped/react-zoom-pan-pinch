import React from "react";
import { render } from "@testing-library/react";
import {
  TransformWrapper,
  TransformComponent
} from "./node_modules/react-zoom-pan-pinch";
import { clickOnComponent } from "./utils";
import logoImg from "../../logo/logo.png";

const App = (
  <TransformWrapper>
    <TransformComponent>
      <img className="zoom" src={logoImg} alt="example" />
    </TransformComponent>
  </TransformWrapper>
);

describe("Library components", () => {
  describe("When library components have been rendered", () => {
    const environment = {};

    beforeEach(async () => {
      const component = render(<App />);
      const { container } = component;
      environment.component = component;
      environment.transformComponent = container.querySelector(
        ".react-transform-element"
      );
    });
    describe("When library components have been rendered", () => {
      test("it renders transform component without errors", () => {
        const { transformComponent } = environment;
        expect(transformComponent).toBeDefined();
      });
    });
  });
});
