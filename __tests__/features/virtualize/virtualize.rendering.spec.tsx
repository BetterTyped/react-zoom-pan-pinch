import React from "react";
import { render, screen, act, waitFor } from "@testing-library/react";

import {
  TransformWrapper,
  TransformComponent,
  Virtualize,
  ReactZoomPanPinchContentRef,
  ReactZoomPanPinchProps,
} from "../../../src";

function renderVirtualize(
  virtualizeProps: React.ComponentProps<typeof Virtualize>[],
  wrapperProps: ReactZoomPanPinchProps = {},
) {
  const ref: { current: ReactZoomPanPinchContentRef | null } = {
    current: null,
  };

  const view = render(
    <TransformWrapper
      {...wrapperProps}
      ref={(r) => {
        ref.current = r;
      }}
    >
      <TransformComponent
        wrapperStyle={{ width: "500px", height: "500px" }}
        contentStyle={{ width: "2000px", height: "2000px" }}
      >
        {virtualizeProps.map((vProps, i) => (
          <Virtualize key={i} {...vProps} />
        ))}
      </TransformComponent>
    </TransformWrapper>,
  );

  return { ...view, ref };
}

describe("Virtualize [Rendering]", () => {
  describe("basic mount/unmount", () => {
    it("should render children when element is inside viewport", () => {
      renderVirtualize([
        {
          x: 100,
          y: 100,
          width: 100,
          height: 100,
          children: <div data-testid="visible-tile">Visible</div>,
        },
      ]);

      expect(screen.getByTestId("visible-tile")).toBeInTheDocument();
    });

    it("should not render children when element is outside viewport", () => {
      renderVirtualize([
        {
          x: 1000,
          y: 1000,
          width: 100,
          height: 100,
          children: <div data-testid="hidden-tile">Hidden</div>,
        },
      ]);

      expect(screen.queryByTestId("hidden-tile")).not.toBeInTheDocument();
    });

    it("should render visible items and hide non-visible ones", () => {
      renderVirtualize([
        {
          x: 50,
          y: 50,
          width: 100,
          height: 100,
          children: <div data-testid="tile-visible">A</div>,
        },
        {
          x: 800,
          y: 800,
          width: 100,
          height: 100,
          children: <div data-testid="tile-hidden">B</div>,
        },
      ]);

      expect(screen.getByTestId("tile-visible")).toBeInTheDocument();
      expect(screen.queryByTestId("tile-hidden")).not.toBeInTheDocument();
    });
  });

  describe("reacting to transform changes", () => {
    it("should mount element when it enters viewport via pan", async () => {
      const { ref } = renderVirtualize([
        {
          x: 600,
          y: 100,
          width: 100,
          height: 100,
          children: <div data-testid="tile">Tile</div>,
        },
      ]);

      expect(screen.queryByTestId("tile")).not.toBeInTheDocument();

      act(() => {
        ref.current?.setTransform(-200, 0, 1, 0);
      });

      await waitFor(() => {
        expect(screen.getByTestId("tile")).toBeInTheDocument();
      });
    });

    it("should unmount element when it leaves viewport via pan", async () => {
      const { ref } = renderVirtualize([
        {
          x: 100,
          y: 100,
          width: 100,
          height: 100,
          children: <div data-testid="tile">Tile</div>,
        },
      ]);

      expect(screen.getByTestId("tile")).toBeInTheDocument();

      act(() => {
        ref.current?.setTransform(-800, 0, 1, 0);
      });

      await waitFor(() => {
        expect(screen.queryByTestId("tile")).not.toBeInTheDocument();
      });
    });

    it("should unmount element when it leaves viewport via zoom", async () => {
      const { ref } = renderVirtualize([
        {
          x: 300,
          y: 300,
          width: 50,
          height: 50,
          children: <div data-testid="tile">Tile</div>,
        },
      ]);

      expect(screen.getByTestId("tile")).toBeInTheDocument();

      act(() => {
        ref.current?.setTransform(0, 0, 3, 0);
      });

      await waitFor(() => {
        expect(screen.queryByTestId("tile")).not.toBeInTheDocument();
      });
    });
  });

  describe("callbacks", () => {
    it("should fire onShow when element becomes visible", async () => {
      const onShow = jest.fn();
      const { ref } = renderVirtualize([
        {
          x: 600,
          y: 100,
          width: 100,
          height: 100,
          onShow,
          children: <div data-testid="tile">Tile</div>,
        },
      ]);

      expect(onShow).not.toHaveBeenCalled();

      act(() => {
        ref.current?.setTransform(-200, 0, 1, 0);
      });

      await waitFor(() => {
        expect(onShow).toHaveBeenCalledTimes(1);
      });
    });

    it("should fire onHide when element becomes hidden", async () => {
      const onHide = jest.fn();
      const { ref } = renderVirtualize([
        {
          x: 100,
          y: 100,
          width: 100,
          height: 100,
          onHide,
          children: <div data-testid="tile">Tile</div>,
        },
      ]);

      expect(onHide).not.toHaveBeenCalled();

      act(() => {
        ref.current?.setTransform(-800, 0, 1, 0);
      });

      await waitFor(() => {
        expect(onHide).toHaveBeenCalledTimes(1);
      });
    });

    it("should not fire callbacks when visibility does not change", async () => {
      const onShow = jest.fn();
      const onHide = jest.fn();
      const { ref } = renderVirtualize([
        {
          x: 100,
          y: 100,
          width: 200,
          height: 200,
          onShow,
          onHide,
          children: <div data-testid="tile">Tile</div>,
        },
      ]);

      onShow.mockClear();

      act(() => {
        ref.current?.setTransform(-10, -10, 1, 0);
      });

      await waitFor(() => {
        expect(screen.getByTestId("tile")).toBeInTheDocument();
      });

      expect(onHide).not.toHaveBeenCalled();
      expect(onShow).not.toHaveBeenCalled();
    });
  });

  describe("placeholder", () => {
    it("should render placeholder when element is hidden", () => {
      renderVirtualize([
        {
          x: 1000,
          y: 1000,
          width: 100,
          height: 100,
          placeholder: <div data-testid="placeholder">Loading...</div>,
          children: <div data-testid="tile">Tile</div>,
        },
      ]);

      expect(screen.queryByTestId("tile")).not.toBeInTheDocument();
      expect(screen.getByTestId("placeholder")).toBeInTheDocument();
    });

    it("should replace placeholder with children when element becomes visible", async () => {
      const { ref } = renderVirtualize([
        {
          x: 600,
          y: 100,
          width: 100,
          height: 100,
          placeholder: <div data-testid="placeholder">Loading...</div>,
          children: <div data-testid="tile">Tile</div>,
        },
      ]);

      expect(screen.getByTestId("placeholder")).toBeInTheDocument();
      expect(screen.queryByTestId("tile")).not.toBeInTheDocument();

      act(() => {
        ref.current?.setTransform(-200, 0, 1, 0);
      });

      await waitFor(() => {
        expect(screen.getByTestId("tile")).toBeInTheDocument();
        expect(screen.queryByTestId("placeholder")).not.toBeInTheDocument();
      });
    });

    it("should render nothing when hidden and no placeholder provided", () => {
      const { container } = renderVirtualize([
        {
          x: 1000,
          y: 1000,
          width: 100,
          height: 100,
          children: <div data-testid="tile">Tile</div>,
        },
      ]);

      expect(screen.queryByTestId("tile")).not.toBeInTheDocument();
      const content = container.querySelector('[data-testid="tile"]');
      expect(content).toBeNull();
    });
  });

  describe("margin", () => {
    it("should mount element early when margin extends viewport", () => {
      renderVirtualize([
        {
          x: 520,
          y: 100,
          width: 50,
          height: 50,
          margin: 100,
          children: <div data-testid="tile">Tile</div>,
        },
      ]);

      expect(screen.getByTestId("tile")).toBeInTheDocument();
    });

    it("should not mount element when it is beyond the margin", () => {
      renderVirtualize([
        {
          x: 700,
          y: 100,
          width: 50,
          height: 50,
          margin: 100,
          children: <div data-testid="tile">Tile</div>,
        },
      ]);

      expect(screen.queryByTestId("tile")).not.toBeInTheDocument();
    });
  });

  describe("threshold", () => {
    it("should hide partially visible element when threshold requires full visibility", () => {
      renderVirtualize([
        {
          x: 480,
          y: 200,
          width: 50,
          height: 50,
          threshold: 1,
          children: <div data-testid="tile">Tile</div>,
        },
      ]);

      expect(screen.queryByTestId("tile")).not.toBeInTheDocument();
    });

    it("should show fully visible element at threshold=1", () => {
      renderVirtualize([
        {
          x: 200,
          y: 200,
          width: 50,
          height: 50,
          threshold: 1,
          children: <div data-testid="tile">Tile</div>,
        },
      ]);

      expect(screen.getByTestId("tile")).toBeInTheDocument();
    });

    it("should respect threshold=0.5 for half-visible element", () => {
      renderVirtualize([
        {
          x: 450,
          y: 200,
          width: 100,
          height: 100,
          threshold: 0.5,
          children: <div data-testid="tile">Tile</div>,
        },
      ]);

      expect(screen.getByTestId("tile")).toBeInTheDocument();
    });

    it("should hide element when overlap is below threshold", () => {
      renderVirtualize([
        {
          x: 460,
          y: 200,
          width: 100,
          height: 100,
          threshold: 0.5,
          children: <div data-testid="tile">Tile</div>,
        },
      ]);

      expect(screen.queryByTestId("tile")).not.toBeInTheDocument();
    });
  });

  describe("styling", () => {
    it("should forward className and style to wrapper div", () => {
      renderVirtualize([
        {
          x: 100,
          y: 100,
          width: 100,
          height: 100,
          className: "custom-class",
          style: { background: "red" },
          children: <div data-testid="tile">Tile</div>,
        },
      ]);

      const tile = screen.getByTestId("tile");
      const wrapper = tile.parentElement!;
      expect(wrapper).toHaveClass("custom-class");
      expect(wrapper.style.background).toBe("red");
    });
  });
});
