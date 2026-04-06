import React from "react";
import { render, screen } from "@testing-library/react";

import { TransformWrapper, TransformComponent, KeepScale } from "../../../src";

describe("KeepScale props", () => {
  describe("forwardRef", () => {
    it("forwards ref to the inner div", () => {
      const ref = React.createRef<HTMLDivElement>();
      render(
        <TransformWrapper>
          <TransformComponent>
            <KeepScale ref={ref} data-testid="keep-scale">
              <span>label</span>
            </KeepScale>
          </TransformComponent>
        </TransformWrapper>,
      );
      expect(ref.current).toBeInstanceOf(HTMLDivElement);
      expect(screen.getByTestId("keep-scale")).toBe(ref.current);
    });
  });

  describe("HTML div props spread", () => {
    it("renders children and applies data attributes", () => {
      render(
        <TransformWrapper>
          <TransformComponent>
            <KeepScale data-testid="ks" aria-label="marker" className="my-marker">
              <span>pin</span>
            </KeepScale>
          </TransformComponent>
        </TransformWrapper>,
      );
      const el = screen.getByTestId("ks");
      expect(el.getAttribute("aria-label")).toBe("marker");
      expect(el.className).toContain("my-marker");
      expect(el.textContent).toBe("pin");
    });

    it("applies style prop", () => {
      render(
        <TransformWrapper>
          <TransformComponent>
            <KeepScale data-testid="ks-style" style={{ color: "red" }}>
              <span>styled</span>
            </KeepScale>
          </TransformComponent>
        </TransformWrapper>,
      );
      expect(screen.getByTestId("ks-style").style.color).toBe("red");
    });
  });
});
