import React from "react";
import { render, screen } from "@testing-library/react";

import { TransformWrapper, TransformComponent } from "../../../src";

describe("TransformComponent props", () => {
  describe("children", () => {
    it("renders children inside the content div", () => {
      render(
        <TransformWrapper>
          <TransformComponent>
            <span data-testid="tc-child">hello</span>
          </TransformComponent>
        </TransformWrapper>,
      );
      expect(screen.getByTestId("tc-child").textContent).toBe("hello");
    });
  });

  describe("wrapperClass", () => {
    it("appends custom class to the wrapper div", () => {
      render(
        <TransformWrapper>
          <TransformComponent wrapperClass="my-wrapper">
            <div>content</div>
          </TransformComponent>
        </TransformWrapper>,
      );
      const wrapper = document.querySelector(".my-wrapper");
      expect(wrapper).toBeTruthy();
    });
  });

  describe("contentClass", () => {
    it("appends custom class to the content div", () => {
      render(
        <TransformWrapper>
          <TransformComponent contentClass="my-content">
            <div>content</div>
          </TransformComponent>
        </TransformWrapper>,
      );
      const content = document.querySelector(".my-content");
      expect(content).toBeTruthy();
    });
  });

  describe("wrapperStyle", () => {
    it("applies custom style to the wrapper div", () => {
      render(
        <TransformWrapper>
          <TransformComponent
            wrapperStyle={{ backgroundColor: "red" }}
            wrapperProps={{ "data-testid": "styled-wrapper" } as React.HTMLAttributes<HTMLDivElement>}
          >
            <div>content</div>
          </TransformComponent>
        </TransformWrapper>,
      );
      const wrapper = screen.getByTestId("styled-wrapper");
      expect(wrapper.style.backgroundColor).toBe("red");
    });
  });

  describe("contentStyle", () => {
    it("applies custom style to the content div", () => {
      render(
        <TransformWrapper>
          <TransformComponent
            contentStyle={{ backgroundColor: "blue" }}
            contentProps={{ "data-testid": "styled-content" } as React.HTMLAttributes<HTMLDivElement>}
          >
            <div>content</div>
          </TransformComponent>
        </TransformWrapper>,
      );
      const content = screen.getByTestId("styled-content");
      expect(content.style.backgroundColor).toBe("blue");
    });
  });

  describe("wrapperProps", () => {
    it("spreads HTML attributes on the wrapper div", () => {
      render(
        <TransformWrapper>
          <TransformComponent
            wrapperProps={{
              "data-testid": "wrapper-props",
              "aria-label": "zoom area",
            } as React.HTMLAttributes<HTMLDivElement>}
          >
            <div>content</div>
          </TransformComponent>
        </TransformWrapper>,
      );
      const wrapper = screen.getByTestId("wrapper-props");
      expect(wrapper.getAttribute("aria-label")).toBe("zoom area");
    });
  });

  describe("contentProps", () => {
    it("spreads HTML attributes on the content div", () => {
      render(
        <TransformWrapper>
          <TransformComponent
            contentProps={{
              "data-testid": "content-props",
              role: "img",
            } as React.HTMLAttributes<HTMLDivElement>}
          >
            <div>content</div>
          </TransformComponent>
        </TransformWrapper>,
      );
      const content = screen.getByTestId("content-props");
      expect(content.getAttribute("role")).toBe("img");
    });
  });
});
