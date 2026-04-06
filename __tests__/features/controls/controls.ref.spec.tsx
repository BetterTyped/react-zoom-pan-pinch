import { act, waitFor, screen } from "@testing-library/react";

import { renderApp } from "../../utils/render-app";

describe("Controls [Ref]", () => {
  describe("setTransform", () => {
    it("should change position and scale", async () => {
      const { ref, content } = renderApp();

      act(() => {
        ref.current?.setTransform(100, 50, 2);
      });

      await waitFor(() => {
        expect(content.style.transform).toBe(
          "translate(100px, 50px) scale(2)",
        );
      });
    });

    it("should not change transform when disabled", () => {
      const { ref, content } = renderApp({ disabled: true });

      act(() => {
        ref.current?.setTransform(100, 50, 2);
      });

      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    });

    it("should handle NaN values by preserving current state", async () => {
      const { ref, content } = renderApp();

      act(() => {
        ref.current?.setTransform(NaN, NaN, NaN);
      });

      await waitFor(() => {
        expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      });
    });
  });

  describe("zoomIn via ref", () => {
    it("should increase scale", async () => {
      const { ref } = renderApp();

      act(() => {
        ref.current?.zoomIn();
      });

      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeGreaterThan(1);
      });
    });

    it("should accept custom step", async () => {
      const { ref } = renderApp();

      act(() => {
        ref.current?.zoomIn(0.1);
      });

      await waitFor(() => {
        const scale = ref.current?.instance.state.scale ?? 1;
        expect(scale).toBeGreaterThan(1);
        expect(scale).toBeLessThan(1.5);
      });
    });
  });

  describe("zoomOut via ref", () => {
    it("should decrease scale", async () => {
      const { ref } = renderApp({ initialScale: 2 });

      act(() => {
        ref.current?.zoomOut();
      });

      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeLessThan(2);
      });
    });
  });

  describe("centerView via ref", () => {
    it("should center content at current scale", async () => {
      const { ref, content } = renderApp({ initialScale: 2 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(2)");

      act(() => {
        ref.current?.centerView();
      });

      await waitFor(() => {
        expect(content.style.transform).toBe(
          "translate(-250px, -250px) scale(2)",
        );
      });
    });

    it("should center content at a custom scale", async () => {
      const { ref, content } = renderApp();

      act(() => {
        ref.current?.centerView(1.65);
      });

      await waitFor(() => {
        expect(content.style.transform).toBe(
          "translate(-162.5px, -162.5px) scale(1.65)",
        );
      });
    });
  });

  describe("resetTransform via ref", () => {
    it("should restore default state", async () => {
      const { ref, content, zoom } = renderApp();

      zoom({ value: 2 });
      expect(ref.current?.instance.state.scale).toBe(2);

      act(() => {
        ref.current?.resetTransform();
      });

      await waitFor(() => {
        expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      });
    });

    it("should restore custom initial state", async () => {
      const { ref, content, zoom } = renderApp({
        initialScale: 1.5,
        initialPositionX: 30,
        initialPositionY: 30,
        limitToBounds: false,
      });

      zoom({ value: 3 });
      expect(ref.current?.instance.state.scale).toBe(3);

      act(() => {
        ref.current?.resetTransform();
      });

      await waitFor(() => {
        expect(content.style.transform).toBe(
          "translate(30px, 30px) scale(1.5)",
        );
      });
    });
  });

  describe("zoomToElement via ref", () => {
    it("should zoom and reposition to target element", () => {
      const { ref, wrapper, content } = renderApp();

      const title = screen.getByText("Title");

      jest.spyOn(wrapper, "getBoundingClientRect").mockReturnValue({
        width: 500,
        height: 500,
        top: 0,
        left: 0,
        bottom: 500,
        right: 500,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      } as DOMRect);

      jest.spyOn(content, "getBoundingClientRect").mockReturnValue({
        width: 500,
        height: 500,
        top: 0,
        left: 0,
        bottom: 500,
        right: 500,
        x: 0,
        y: 0,
        toJSON: () => ({}),
      } as DOMRect);

      jest.spyOn(title, "getBoundingClientRect").mockReturnValue({
        width: 100,
        height: 100,
        top: 100,
        left: 100,
        bottom: 200,
        right: 200,
        x: 100,
        y: 100,
        toJSON: () => ({}),
      } as DOMRect);

      act(() => {
        ref.current?.zoomToElement(title, 2, 0);
      });

      expect(ref.current?.instance.state.scale).toBe(2);
      expect(ref.current?.instance.state.positionX).not.toBe(0);
      expect(ref.current?.instance.state.positionY).not.toBe(0);
    });
  });
});
