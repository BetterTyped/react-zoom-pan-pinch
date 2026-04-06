import { fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderApp } from "../../utils";

describe("ReactZoomPanPinchProps.disabled", () => {
  it("blocks all panning when disabled is true", () => {
    const { content, pan } = renderApp({ disabled: true });
    expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    pan({ x: -100, y: -100 });
    expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
  });

  it("blocks wheel zoom when disabled is true", () => {
    const { content, ref } = renderApp({ disabled: true });
    userEvent.hover(content);
    fireEvent(
      content,
      new WheelEvent("wheel", { bubbles: true, deltaY: -10 }),
    );
    expect(ref.current!.instance.state.scale).toBe(1);
  });

  it("blocks pinch zoom when disabled is true", () => {
    const { ref, pinch } = renderApp({ disabled: true });
    pinch({ value: 2 });
    expect(ref.current!.instance.state.scale).toBe(1);
  });

  it("allows interactions when disabled is false", () => {
    const { content, pan } = renderApp({ disabled: false });
    pan({ x: -100, y: -100 });
    expect(content.style.transform).toBe(
      "translate(-100px, -100px) scale(1)",
    );
  });
});
