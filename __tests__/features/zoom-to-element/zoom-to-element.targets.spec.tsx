import React from "react";
import { render, screen, act } from "@testing-library/react";

import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "../../../src";

/**
 * Wrapper 500x500, content 2000x2000, no bounds. Boxes are positioned with
 * inline left/top so the jsdom getBoundingClientRect stub reports them.
 */
const Box = ({ id, left, top }: { id: string; left: number; top: number }) => (
  <div
    id={id}
    data-testid={id}
    style={{
      position: "absolute",
      left: `${left}px`,
      top: `${top}px`,
      width: "100px",
      height: "100px",
    }}
  />
);

const setup = (
  props: Partial<React.ComponentProps<typeof TransformWrapper>> = {},
) => {
  const ref = React.createRef<ReactZoomPanPinchRef>();
  const view = render(
    <TransformWrapper ref={ref} limitToBounds={false} smooth={false} {...props}>
      <TransformComponent
        wrapperStyle={{ width: "500px", height: "500px" }}
        contentStyle={{ width: "2000px", height: "2000px" }}
      >
        <div style={{ position: "relative" }}>
          <Box id="a" left={1000} top={1000} />
          <Box id="b" left={1150} top={1150} />
        </div>
      </TransformComponent>
    </TransformWrapper>,
  );
  return { ref, view };
};

describe("zoomToElement targets and options", () => {
  it("frames the union of several elements (#388)", () => {
    const { ref } = setup();
    const a = screen.getByTestId("a");
    const b = screen.getByTestId("b");

    act(() => {
      ref.current!.zoomToElement([a, b], { animationTime: 0 });
    });

    // Union rect is 250x250 at (1000, 1000): fit scale 500/250 = 2 and the
    // union is centred, so the translation is exactly -1000 * 2.
    expect(ref.current!.instance.state.scale).toBe(2);
    expect(ref.current!.instance.state.positionX).toBe(-2000);
    expect(ref.current!.instance.state.positionY).toBe(-2000);
  });

  it("accepts an array of element ids", () => {
    const { ref } = setup();

    act(() => {
      ref.current!.zoomToElement(["a", "b"], { animationTime: 0 });
    });

    expect(ref.current!.instance.state.scale).toBe(2);
    expect(ref.current!.instance.state.positionX).toBe(-2000);
  });

  it("ignores ids that do not resolve and keeps the ones that do", () => {
    const { ref } = setup();

    act(() => {
      ref.current!.zoomToElement(["missing", "a"], { animationTime: 0 });
    });

    // Only `a` (100x100) is framed: fit scale 5, centred in 500px.
    expect(ref.current!.instance.state.scale).toBe(5);
    expect(ref.current!.instance.state.positionX).toBe(-5000);
  });

  it("does nothing when no target resolves", () => {
    const { ref } = setup();

    act(() => {
      ref.current!.zoomToElement(["missing"], { animationTime: 0 });
    });

    expect(ref.current!.instance.state).toMatchObject({
      scale: 1,
      positionX: 0,
      positionY: 0,
    });
  });

  it("caps the automatic fit scale with options.maxScale (#515)", () => {
    const { ref } = setup();

    act(() => {
      ref.current!.zoomToElement("a", { maxScale: 2, animationTime: 0 });
    });

    // Fit would be 5; capped to 2 and still centred on the element.
    expect(ref.current!.instance.state.scale).toBe(2);
    expect(ref.current!.instance.state.positionX).toBe(-2000 + 150);
    expect(ref.current!.instance.state.positionY).toBe(-2000 + 150);
  });

  it("raises the automatic fit scale with options.minScale", () => {
    const { ref } = setup();

    act(() => {
      ref.current!.zoomToElement([screen.getByTestId("a"), "b"], {
        minScale: 3,
        animationTime: 0,
      });
    });

    expect(ref.current!.instance.state.scale).toBe(3);
  });

  it("never exceeds the wrapper's own maxScale", () => {
    const { ref } = setup({ maxScale: 4 });

    act(() => {
      ref.current!.zoomToElement("a", { minScale: 10, animationTime: 0 });
    });

    expect(ref.current!.instance.state.scale).toBe(4);
  });

  it("options.scale and offsets behave like the positional arguments", () => {
    const first = setup();
    act(() => {
      first.ref.current!.zoomToElement("a", 3, 0, "easeOut", 20, -10);
    });
    const positional = { ...first.ref.current!.instance.state };
    first.view.unmount();

    const second = setup();
    act(() => {
      second.ref.current!.zoomToElement("a", {
        scale: 3,
        animationTime: 0,
        offsetX: 20,
        offsetY: -10,
      });
    });

    expect(second.ref.current!.instance.state).toEqual(positional);
    expect(positional.scale).toBe(3);
  });

  it("resolves the returned promise once the transform is applied", async () => {
    const { ref } = setup();

    await act(async () => {
      await ref.current!.zoomToElement("a", { animationTime: 0 });
    });

    expect(ref.current!.instance.state.scale).toBe(5);
  });
});
