import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import {
  TransformWrapper,
  TransformComponent,
  MiniMap,
  MiniMapProps,
  ReactZoomPanPinchContentRef,
} from "../../../src";

function renderMiniMap(miniMapProps: Partial<MiniMapProps> = {}) {
  const ref = React.createRef<ReactZoomPanPinchContentRef>();
  render(
    <TransformWrapper
      ref={ref}
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
      <MiniMap offsetScale={0} {...miniMapProps}>
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
  const minimapMask = document.querySelector(
    ".rzpp-minimap-mask path",
  ) as SVGPathElement;

  return {
    ref,
    content,
    wrapper,
    minimapContainer,
    minimapWrapper,
    minimapPreview,
    minimapMask,
  };
}

describe("MiniMap [Sync]", () => {
  describe("initial state", () => {
    it("should size the container to the width and height props", () => {
      const { minimapContainer } = renderMiniMap({ width: 200, height: 150 });
      expect(minimapContainer.style.width).toBe("200px");
      expect(minimapContainer.style.height).toBe("150px");
    });

    it("should set minimap wrapper to content dimensions", () => {
      const { minimapWrapper } = renderMiniMap();
      expect(minimapWrapper.style.width).toBe("1000px");
      expect(minimapWrapper.style.height).toBe("1000px");
    });

    it("should scale the minimap wrapper down to fit", () => {
      const { minimapWrapper } = renderMiniMap();
      // content 1000x1000 into 200x200 → mapScale 0.2
      expect(minimapWrapper.style.transform).toBe(
        "translate(0px, 0px) scale(0.2)",
      );
    });

    it("should set preview dimensions to viewport fraction", () => {
      const { minimapPreview } = renderMiniMap();
      // viewport 500x500 * 0.2 = 100
      expect(minimapPreview.style.width).toBe("100px");
      expect(minimapPreview.style.height).toBe("100px");
    });

    it("should position preview at origin initially", () => {
      const { minimapPreview } = renderMiniMap();
      expect(minimapPreview.style.transform).toBe("translate(0px, 0px)");
    });

    it("should cut the viewport out of the dimming mask", () => {
      const { minimapMask } = renderMiniMap();
      expect(minimapMask.getAttribute("d")).toBe(
        "M0 0H200V200H0Z M0 0h100v100h-100Z",
      );
    });

    it("should pad the map by offsetScale, like React Flow", () => {
      const { minimapWrapper, minimapPreview } = renderMiniMap({
        offsetScale: 5,
      });
      // viewScale = 1000 / 200 = 5, padding = 5 * 5 = 25 content px on
      // each side → 1050 content px into 200 px → mapScale 0.1905 and the
      // content starts 25 * 0.1905 = 4.76 px from the edge.
      expect(minimapWrapper.style.transform).toBe(
        "translate(4.76px, 4.76px) scale(0.1905)",
      );
      expect(minimapPreview.style.transform).toBe("translate(4.76px, 4.76px)");
      expect(minimapPreview.style.width).toBe("95.24px");
    });

    it("should letterbox non-square content in the centre of the box", () => {
      const { ref, minimapWrapper, minimapPreview } = renderMiniMap({
        width: 200,
        height: 100,
      });
      expect(ref.current).toBeTruthy();
      // 1000x1000 into 200x100 → mapScale 0.1, centred horizontally with
      // (2000 - 1000) / 2 = 500 content px of margin.
      expect(minimapWrapper.style.transform).toBe(
        "translate(50px, 0px) scale(0.1)",
      );
      expect(minimapPreview.style.transform).toBe("translate(50px, 0px)");
      expect(minimapPreview.style.width).toBe("50px");
    });
  });

  describe("after pan", () => {
    it("should update preview transform to reflect new viewport position", () => {
      const { content, minimapPreview, minimapMask } = renderMiniMap();

      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");

      userEvent.hover(content);
      fireEvent.mouseDown(content, { clientX: 0, clientY: 0, buttons: 1 });
      fireEvent.mouseMove(content, { clientX: -100, clientY: -50, buttons: 1 });
      fireEvent.mouseUp(content);

      expect(content.style.transform).toBe("translate(-100px, -50px) scale(1)");

      // mapScale = 0.2, x = -(-100) * 0.2 = 20, y = -(-50) * 0.2 = 10
      expect(minimapPreview.style.transform).toBe("translate(20px, 10px)");
      expect(minimapMask.getAttribute("d")).toBe(
        "M0 0H200V200H0Z M20 10h100v100h-100Z",
      );
    });

    it("should not change preview size after pan at same scale", () => {
      const { content, minimapPreview } = renderMiniMap();

      const initialWidth = minimapPreview.style.width;
      const initialHeight = minimapPreview.style.height;

      userEvent.hover(content);
      fireEvent.mouseDown(content, { clientX: 0, clientY: 0, buttons: 1 });
      fireEvent.mouseMove(content, {
        clientX: -100,
        clientY: -100,
        buttons: 1,
      });
      fireEvent.mouseUp(content);

      expect(minimapPreview.style.width).toBe(initialWidth);
      expect(minimapPreview.style.height).toBe(initialHeight);
    });

    it("should grow the map to keep the viewport visible when it leaves the content", () => {
      const { ref, minimapWrapper, minimapPreview } = renderMiniMap();

      // Viewport pushed 200px past the top-left corner of the content.
      ref.current!.instance.setState(1, 200, 200);

      // union = (-200, -200) → (1000, 1000) = 1200 content px into 200 px
      expect(minimapWrapper.style.transform).toBe(
        "translate(33.33px, 33.33px) scale(0.1667)",
      );
      expect(minimapPreview.style.transform).toBe("translate(0px, 0px)");
      expect(minimapPreview.style.width).toBe("83.33px");
    });
  });

  describe("after zoom", () => {
    it("should halve the preview when zooming to scale 2", () => {
      const { ref, minimapPreview, minimapWrapper } = renderMiniMap();

      ref.current!.instance.setState(2, -500, -500);

      // Content is still 1000x1000 content px → map scale stays 0.2; the
      // viewport is 250x250 content px at (250, 250).
      expect(minimapWrapper.style.transform).toBe(
        "translate(0px, 0px) scale(0.2)",
      );
      expect(minimapPreview.style.width).toBe("50px");
      expect(minimapPreview.style.height).toBe("50px");
      expect(minimapPreview.style.transform).toBe("translate(50px, 50px)");
    });

    it("should shrink preview when zooming in with the wheel", () => {
      const { content, minimapPreview } = renderMiniMap();

      const initialWidth = parseFloat(minimapPreview.style.width);
      expect(initialWidth).toBe(100);

      userEvent.hover(content);

      for (let i = 0; i < 10; i += 1) {
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
      for (let i = 0; i < 10; i += 1) {
        fireEvent(
          content,
          new WheelEvent("wheel", { bubbles: true, deltaY: -1 }),
        );
      }

      const zoomedInWidth = parseFloat(minimapPreview.style.width);

      // Zoom back out
      for (let i = 0; i < 10; i += 1) {
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
