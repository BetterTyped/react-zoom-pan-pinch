import React from "react";
import { render, screen } from "@testing-library/react";

import {
  TransformWrapper,
  TransformComponent,
  useTransformComponent,
  useTransformEffect,
} from "../../../src";
import { renderApp } from "../../utils";

/**
 * The instance initializes in a layout effect so the first transform is on
 * screen before paint. Hooks that subscribe in a passive effect used to miss
 * that first transform and kept showing the pre-init state (scale 1 at 0/0).
 */

const ScaleLabel = () =>
  useTransformComponent(({ state }) => (
    <span data-testid="scale">
      {state.scale}/{state.positionX}/{state.positionY}
    </span>
  ));

const Canvas = () => (
  <TransformComponent
    wrapperStyle={{ width: "500px", height: "500px" }}
    contentStyle={{ width: "2000px", height: "1000px" }}
  >
    <div />
  </TransformComponent>
);

describe("hooks and the initial layout", () => {
  // renderApp patches jsdom's offsetWidth/Height getters for every later
  // render in this file.
  beforeAll(() => renderApp().unmount());

  describe("useTransformComponent", () => {
    it("reflects fitOnInit when rendered before the component", () => {
      render(
        <TransformWrapper fitOnInit minScale={0.1}>
          <ScaleLabel />
          <Canvas />
        </TransformWrapper>,
      );
      expect(screen.getByTestId("scale").textContent).toBe("0.25/0/125");
    });

    it("reflects fitOnInit when rendered after the component", () => {
      render(
        <TransformWrapper fitOnInit minScale={0.1}>
          <Canvas />
          <ScaleLabel />
        </TransformWrapper>,
      );
      expect(screen.getByTestId("scale").textContent).toBe("0.25/0/125");
    });

    it("reflects centerOnInit", () => {
      render(
        <TransformWrapper centerOnInit initialScale={0.5} minScale={0.1}>
          <Canvas />
          <ScaleLabel />
        </TransformWrapper>,
      );
      expect(screen.getByTestId("scale").textContent).toBe("0.5/-250/0");
    });

    it("does not re-render in a loop when the state is unchanged", () => {
      const renders = jest.fn();
      const Counter = () =>
        useTransformComponent(({ state }) => {
          renders();
          return <span data-testid="scale">{state.scale}</span>;
        });
      render(
        <TransformWrapper>
          <Canvas />
          <Counter />
        </TransformWrapper>,
      );
      expect(screen.getByTestId("scale").textContent).toBe("1");
      expect(renders).toHaveBeenCalledTimes(1);
    });
  });

  describe("useTransformEffect", () => {
    it("runs once with the fitted state applied during mount", () => {
      const seen = jest.fn();
      const Observer = () => {
        useTransformEffect(({ state }) => {
          seen({
            scale: state.scale,
            positionX: state.positionX,
            positionY: state.positionY,
          });
        });
        return null;
      };
      render(
        <TransformWrapper fitOnInit minScale={0.1}>
          <Canvas />
          <Observer />
        </TransformWrapper>,
      );
      expect(seen).toHaveBeenCalledTimes(1);
      expect(seen).toHaveBeenCalledWith({
        scale: 0.25,
        positionX: 0,
        positionY: 125,
      });
    });

    it("stays silent when nothing moved during mount", () => {
      const seen = jest.fn();
      const Observer = () => {
        useTransformEffect(() => seen());
        return null;
      };
      render(
        <TransformWrapper>
          <Canvas />
          <Observer />
        </TransformWrapper>,
      );
      expect(seen).not.toHaveBeenCalled();
    });
  });
});
