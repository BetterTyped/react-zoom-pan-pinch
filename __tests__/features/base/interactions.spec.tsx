import React from "react";
import { render, fireEvent, screen } from "@testing-library/react";

import { TransformWrapper, TransformComponent } from "../../../src";
import { renderApp } from "../../utils";

describe("Base [Interactions]", () => {
  describe("When clicking in nested button", () => {
    it("should allow to trigger button callback", async () => {
      const onClick = jest.fn();
      render(
        <TransformWrapper>
          <TransformComponent>
            <button type="button" data-testid="nested-btn" onClick={onClick}>
              Click me
            </button>
          </TransformComponent>
        </TransformWrapper>,
      );

      const btn = screen.getByTestId("nested-btn");
      fireEvent.click(btn);
      expect(onClick).toHaveBeenCalledTimes(1);
    });
    it("should allow multiple clicks on nested button", async () => {
      const onClick = jest.fn();
      render(
        <TransformWrapper>
          <TransformComponent>
            <button type="button" data-testid="nested-btn" onClick={onClick}>
              Click me
            </button>
          </TransformComponent>
        </TransformWrapper>,
      );

      const btn = screen.getByTestId("nested-btn");
      fireEvent.click(btn);
      fireEvent.click(btn);
      fireEvent.click(btn);
      expect(onClick).toHaveBeenCalledTimes(3);
    });
  });

  describe("When interacting with nested input", () => {
    it("should allow typing in nested input", async () => {
      render(
        <TransformWrapper>
          <TransformComponent>
            <input data-testid="nested-input" type="text" />
          </TransformComponent>
        </TransformWrapper>,
      );

      const input = screen.getByTestId("nested-input") as HTMLInputElement;
      fireEvent.change(input, { target: { value: "hello" } });
      expect(input.value).toBe("hello");
    });
  });

  describe("When using control buttons", () => {
    it("should trigger onZoom callback on zoom in button click", async () => {
      const onZoom = jest.fn();
      const { zoomInBtn } = renderApp({ onZoom });

      fireEvent(zoomInBtn, new MouseEvent("click", { bubbles: true }));
      expect(onZoom).toHaveBeenCalled();
    });
    it("should trigger onZoom callback on zoom out button click", async () => {
      const onZoom = jest.fn();
      const { zoomOutBtn } = renderApp({ onZoom, initialScale: 2 });

      fireEvent(zoomOutBtn, new MouseEvent("click", { bubbles: true }));
      expect(onZoom).toHaveBeenCalled();
    });
  });
});
