import React from "react";
import { render, screen } from "@testing-library/react";

import { TransformWrapper, TransformComponent, MiniMap } from "../../../src";

function renderMiniMap(miniMapProps: Record<string, unknown> = {}) {
  return render(
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
        <div data-testid="minimap-child">minimap content</div>
      </MiniMap>
    </TransformWrapper>,
  );
}

describe("MiniMap [Rendering]", () => {
  describe("DOM structure", () => {
    it("should render the minimap container", () => {
      renderMiniMap();
      const container = document.querySelector(".rzpp-mini-map");
      expect(container).toBeTruthy();
    });

    it("should render the minimap wrapper inside the container", () => {
      renderMiniMap();
      const wrapper = document.querySelector(".rzpp-minimap-wrapper");
      expect(wrapper).toBeTruthy();
    });

    it("should render the preview element", () => {
      renderMiniMap();
      const preview = document.querySelector(".rzpp-minimap-preview");
      expect(preview).toBeTruthy();
    });

    it("should render children inside the wrapper", () => {
      renderMiniMap();
      const wrapper = document.querySelector(".rzpp-minimap-wrapper");
      const child = screen.getByTestId("minimap-child");
      expect(wrapper!.contains(child)).toBe(true);
    });
  });

  describe("preview styles", () => {
    it("should use default red border on preview", () => {
      renderMiniMap();
      const preview = document.querySelector(
        ".rzpp-minimap-preview",
      ) as HTMLElement;
      expect(preview.style.border).toBe("3px solid red");
      expect(preview.style.borderColor).toBe("red");
    });

    it("should apply custom borderColor", () => {
      renderMiniMap({ borderColor: "blue" });
      const preview = document.querySelector(
        ".rzpp-minimap-preview",
      ) as HTMLElement;
      expect(preview.style.borderColor).toBe("blue");
    });

    it("should merge previewStyle after defaults", () => {
      renderMiniMap({
        previewStyle: { borderRadius: "8px", border: "1px solid lime" },
      });
      const preview = document.querySelector(
        ".rzpp-minimap-preview",
      ) as HTMLElement;
      expect(preview.style.borderRadius).toBe("8px");
      expect(preview.style.border).toBe("1px solid lime");
    });

    it("should have box-shadow for viewport dimming", () => {
      renderMiniMap();
      const preview = document.querySelector(
        ".rzpp-minimap-preview",
      ) as HTMLElement;
      expect(preview.style.boxShadow).toBeTruthy();
    });

    it("should have pointerEvents none on preview", () => {
      renderMiniMap();
      const preview = document.querySelector(
        ".rzpp-minimap-preview",
      ) as HTMLElement;
      expect(preview.style.pointerEvents).toBe("none");
    });
  });

  describe("wrapper styles", () => {
    it("should have pointerEvents none on wrapper", () => {
      renderMiniMap();
      const wrapper = document.querySelector(
        ".rzpp-minimap-wrapper",
      ) as HTMLElement;
      expect(wrapper.style.pointerEvents).toBe("none");
    });
  });
});
