import React from "react";
import { render, screen } from "@testing-library/react";

import { TransformWrapper, TransformComponent, MiniMap } from "../../../src";

function renderWithMiniMap(miniMapProps: Record<string, unknown> = {}) {
  return render(
    <TransformWrapper>
      <TransformComponent
        wrapperProps={{ "data-testid": "wrapper" } as React.HTMLAttributes<HTMLDivElement>}
        contentProps={{ "data-testid": "content" } as React.HTMLAttributes<HTMLDivElement>}
        wrapperStyle={{ width: "500px", height: "500px" }}
        contentStyle={{ width: "100%", height: "100%" }}
      >
        <div style={{ width: "1000px", height: "1000px" }}>content</div>
      </TransformComponent>
      <MiniMap {...miniMapProps}>
        <div data-testid="minimap-child">mini</div>
      </MiniMap>
    </TransformWrapper>,
  );
}

describe("MiniMap props", () => {
  describe("children", () => {
    it("renders children inside the minimap", () => {
      renderWithMiniMap();
      expect(screen.getByTestId("minimap-child").textContent).toBe("mini");
    });
  });

  describe("width", () => {
    it("accepts width prop without crashing", () => {
      renderWithMiniMap({ width: 150 });
      const mm = document.querySelector(".rzpp-mini-map");
      expect(mm).toBeTruthy();
    });
  });

  describe("height", () => {
    it("accepts height prop without crashing", () => {
      renderWithMiniMap({ height: 150 });
      const mm = document.querySelector(".rzpp-mini-map");
      expect(mm).toBeTruthy();
    });
  });

  describe("borderColor", () => {
    it("applies borderColor to the preview element", () => {
      renderWithMiniMap({ borderColor: "blue" });
      const preview = document.querySelector(".rzpp-minimap-preview");
      expect(preview).toBeTruthy();
      expect((preview as HTMLElement).style.borderColor).toBe("blue");
    });
  });

  describe("panning", () => {
    it("accepts panning prop without crashing", () => {
      renderWithMiniMap({ panning: false });
      const mm = document.querySelector(".rzpp-mini-map");
      expect(mm).toBeTruthy();
    });
  });

  describe("HTML div attributes (...rest)", () => {
    it("spreads standard HTML attributes on the container", () => {
      renderWithMiniMap({ "aria-label": "mini map", role: "img" });
      const mm = document.querySelector(".rzpp-mini-map");
      expect(mm).toBeTruthy();
      expect(mm!.getAttribute("aria-label")).toBe("mini map");
      expect(mm!.getAttribute("role")).toBe("img");
    });
  });
});
