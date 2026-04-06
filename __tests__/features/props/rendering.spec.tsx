import { fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderApp } from "../../utils";

describe("ReactZoomPanPinchProps.customTransform", () => {
  it("uses the custom transform function for CSS output", () => {
    const customTransform = (x: number, y: number, scale: number) =>
      `matrix(${scale}, 0, 0, ${scale}, ${x}, ${y})`;

    const { content, pan } = renderApp({ customTransform });
    expect(content.style.transform).toBe("matrix(1, 0, 0, 1, 0, 0)");

    pan({ x: -50, y: -30 });
    expect(content.style.transform).toBe("matrix(1, 0, 0, 1, -50, -30)");
  });
});

describe("ReactZoomPanPinchProps.smooth", () => {
  it("smooth false makes wheel zoom immediate (no animation)", () => {
    const { content, ref } = renderApp({
      smooth: false,
    });
    userEvent.hover(content);
    fireEvent(
      content,
      new WheelEvent("wheel", { bubbles: true, deltaY: -10 }),
    );
    expect(ref.current!.instance.state.scale).toBeGreaterThan(1);
  });
});
