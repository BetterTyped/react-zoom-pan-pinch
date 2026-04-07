import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";

import { TransformWrapper, TransformComponent, MiniMap } from "../../../src";

function renderMiniMap(miniMapProps: Record<string, unknown> = {}) {
  render(
    <TransformWrapper
      doubleClick={{ disabled: true }}
      velocityAnimation={{ disabled: true }}
      autoAlignment={{ disabled: true }}
    >
      <TransformComponent
        wrapperProps={
          {
            "data-testid": "wrapper",
          } as React.HTMLAttributes<HTMLDivElement>
        }
        contentProps={
          {
            "data-testid": "content",
          } as React.HTMLAttributes<HTMLDivElement>
        }
        wrapperStyle={{ width: "500px", height: "500px" }}
        contentStyle={{ width: "1000px", height: "1000px" }}
      >
        <div style={{ width: "1000px", height: "1000px" }}>content</div>
      </TransformComponent>
      <MiniMap {...miniMapProps}>
        <div style={{ width: "1000px", height: "1000px" }}>minimap content</div>
      </MiniMap>
    </TransformWrapper>,
  );

  const content = screen.getByTestId("content");
  const wrapper = screen.getByTestId("wrapper");
  const minimapContainer = document.querySelector(
    ".rzpp-mini-map",
  ) as HTMLElement;
  const minimapPreview = document.querySelector(
    ".rzpp-minimap-preview",
  ) as HTMLElement;

  return { content, wrapper, minimapContainer, minimapPreview };
}

describe("MiniMap [Panning]", () => {
  describe("When dragging on the minimap", () => {
    it("should update main content position on mousemove", () => {
      const { content, minimapContainer } = renderMiniMap();

      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");

      act(() => {
        fireEvent.mouseDown(minimapContainer, {
          clientX: 100,
          clientY: 100,
          bubbles: true,
        });
      });

      act(() => {
        fireEvent.mouseMove(document, {
          clientX: 100,
          clientY: 100,
          bubbles: true,
        });
      });

      expect(content.style.transform).not.toBe("translate(0px, 0px) scale(1)");
    });

    it("should stop updating position after mouseup", () => {
      const { content, minimapContainer } = renderMiniMap();

      act(() => {
        fireEvent.mouseDown(minimapContainer, {
          clientX: 50,
          clientY: 50,
          bubbles: true,
        });
      });

      act(() => {
        fireEvent.mouseMove(document, {
          clientX: 50,
          clientY: 50,
          bubbles: true,
        });
      });

      const positionAfterDrag = content.style.transform;

      act(() => {
        fireEvent.mouseUp(document, { bubbles: true });
      });

      act(() => {
        fireEvent.mouseMove(document, {
          clientX: 150,
          clientY: 150,
          bubbles: true,
        });
      });

      expect(content.style.transform).toBe(positionAfterDrag);
    });
  });

  describe("When panning is disabled", () => {
    it("should not change main content position on minimap drag", () => {
      const { content, minimapContainer } = renderMiniMap({
        panning: false,
      });

      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");

      act(() => {
        fireEvent.mouseDown(minimapContainer, {
          clientX: 100,
          clientY: 100,
          bubbles: true,
        });
      });

      act(() => {
        fireEvent.mouseMove(document, {
          clientX: 100,
          clientY: 100,
          bubbles: true,
        });
      });

      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });
  });
});
