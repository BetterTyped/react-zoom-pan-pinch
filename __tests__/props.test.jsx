import { render } from "@testing-library/react";
import logoImg from "logo/logo.png";
import React from "react";
import {
  TransformComponent,
  TransformWrapper,
} from "./node_modules/@pronestor/react-zoom-pan-pinch";

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
        ".react-transform-element",
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
