import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

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
  const minimapWrapper = document.querySelector(
    ".rzpp-minimap-wrapper",
  ) as HTMLElement;
  const minimapPreview = document.querySelector(
    ".rzpp-minimap-preview",
  ) as HTMLElement;

  return { content, wrapper, minimapContainer, minimapWrapper, minimapPreview };
}

describe("MiniMap [Sync]", () => {
  describe("initial state", () => {
    it("should set minimap container dimensions based on content-to-minimap ratio", () => {
      const { minimapContainer } = renderMiniMap();
      // content 1000x1000, minimap default 200x200
      // miniMapScale = min(200/1000, 200/1000) = 0.2
      // miniMapSize = { width: 200, height: 200 }
      expect(minimapContainer.style.width).toBe("200px");
      expect(minimapContainer.style.height).toBe("200px");
    });

    it("should set minimap wrapper to content dimensions", () => {
      const { minimapWrapper } = renderMiniMap();
      expect(minimapWrapper.style.width).toBe("1000px");
      expect(minimapWrapper.style.height).toBe("1000px");
    });

    it("should scale the minimap wrapper down to fit", () => {
      const { minimapWrapper } = renderMiniMap();
      // miniMapScale = 0.2
      expect(minimapWrapper.style.transform).toBe("scale(0.2)");
    });

    it("should set preview dimensions to viewport fraction", () => {
      const { minimapPreview } = renderMiniMap();
      // viewport 500x500, previewScale = 0.2 * (1/1) = 0.2
      // preview width = 500 * 0.2 = 100
      expect(minimapPreview.style.width).toBe("100px");
      expect(minimapPreview.style.height).toBe("100px");
    });

    it("should position preview at origin initially", () => {
      const { minimapPreview } = renderMiniMap();
      expect(minimapPreview.style.transform).toBe(
        "translate(0px, 0px) scale(1)",
      );
    });
  });

  describe("after pan", () => {
    it("should update preview transform to reflect new viewport position", () => {
      const { content, minimapPreview } = renderMiniMap();

      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");

      userEvent.hover(content);
      fireEvent.mouseDown(content, { clientX: 0, clientY: 0 });
      fireEvent.mouseMove(content, { clientX: -100, clientY: -50 });
      fireEvent.mouseUp(content);

      expect(content.style.transform).toBe(
        "translate(-100px, -50px) scale(1)",
      );

      // previewScale = 0.2, x = -(-100) * 0.2 = 20, y = -(-50) * 0.2 = 10
      expect(minimapPreview.style.transform).toBe(
        "translate(20px, 10px) scale(1)",
      );
    });

    it("should not change preview size after pan at same scale", () => {
      const { content, minimapPreview } = renderMiniMap();

      const initialWidth = minimapPreview.style.width;
      const initialHeight = minimapPreview.style.height;

      userEvent.hover(content);
      fireEvent.mouseDown(content, { clientX: 0, clientY: 0 });
      fireEvent.mouseMove(content, { clientX: -100, clientY: -100 });
      fireEvent.mouseUp(content);

      expect(minimapPreview.style.width).toBe(initialWidth);
      expect(minimapPreview.style.height).toBe(initialHeight);
    });
  });

  describe("after zoom", () => {
    it("should shrink preview when zooming in", () => {
      const { content, minimapPreview } = renderMiniMap();

      const initialWidth = parseFloat(minimapPreview.style.width);
      expect(initialWidth).toBe(100);

      userEvent.hover(content);

      for (let i = 0; i < 10; i++) {
        fireEvent(
          content,
          new WheelEvent("wheel", { bubbles: true, deltaY: -1 }),
        );
      }

      const newWidth = parseFloat(minimapPreview.style.width);
      expect(newWidth).toBeLessThan(initialWidth);
    });

    it("should grow preview when zooming out after zoom in", () => {
      const { content, minimapPreview } = renderMiniMap();

      userEvent.hover(content);

      // Zoom in first
      for (let i = 0; i < 10; i++) {
        fireEvent(
          content,
          new WheelEvent("wheel", { bubbles: true, deltaY: -1 }),
        );
      }

      const zoomedInWidth = parseFloat(minimapPreview.style.width);

      // Zoom back out
      for (let i = 0; i < 10; i++) {
        fireEvent(
          content,
          new WheelEvent("wheel", { bubbles: true, deltaY: 1 }),
        );
      }

      const zoomedOutWidth = parseFloat(minimapPreview.style.width);
      expect(zoomedOutWidth).toBeGreaterThan(zoomedInWidth);
    });
  });
});
