import { act } from "@testing-library/react";

import { renderApp } from "../utils";

const size = {
  wrapperWidth: "500px",
  wrapperHeight: "500px",
  contentWidth: "1000px",
  contentHeight: "1000px",
};

/**
 * A border on the wrapper (e.g. `wrapperStyle={{ border: "2px solid …" }}`)
 * is part of `offsetWidth` but not of the visible area the content is
 * positioned in. Measuring the wrapper with `offsetWidth` centred content 2px
 * off on both axes and let bounds reach 4px too far. The library measures the
 * wrapper with `clientWidth`/`clientHeight` instead.
 */
describe("regressions: bordered wrapper is measured by its client box", () => {
  /** jsdom has no layout: emulate a 2px border on this wrapper only. */
  const addBorder = (wrapper: HTMLElement, border: number) => {
    Object.defineProperty(wrapper, "offsetWidth", {
      configurable: true,
      get: () => parseInt(wrapper.style.width, 10) + 2 * border,
    });
    Object.defineProperty(wrapper, "offsetHeight", {
      configurable: true,
      get: () => parseInt(wrapper.style.height, 10) + 2 * border,
    });
    expect(wrapper.offsetWidth).toBe(504);
    expect(wrapper.clientWidth).toBe(500);
  };

  it("centerView centres on the visible area, not the border box", async () => {
    const { ref, wrapper } = renderApp(size);
    addBorder(wrapper, 2);

    await act(async () => {
      await ref.current!.centerView(0.5, 0);
    });

    // 1000 * 0.5 = 500 fits the 500px client box exactly: no offset.
    expect(ref.current!.instance.state).toMatchObject({
      scale: 0.5,
      positionX: 0,
      positionY: 0,
    });
  });

  it("fitToView uses the visible area for the fit scale", async () => {
    const { ref, wrapper } = renderApp({ ...size, minScale: 0.1 });
    addBorder(wrapper, 2);

    await act(async () => {
      await ref.current!.fitToView({ animationTime: 0 });
    });

    expect(ref.current!.instance.state).toMatchObject({
      scale: 0.5,
      positionX: 0,
      positionY: 0,
    });
  });

  it("pan bounds stop at the visible edge", () => {
    // No alignment padding, so the bound is the exact edge.
    const { ref, wrapper, pan } = renderApp({ ...size, disablePadding: true });
    addBorder(wrapper, 2);

    pan({ x: -2000, y: -2000 });

    // Content 1000 in a 500px client box: the far edge is -500, not -496.
    expect(ref.current!.instance.state).toMatchObject({
      positionX: -500,
      positionY: -500,
    });
  });

  it("zoomIn keeps the centre of the visible area fixed", async () => {
    const { ref, wrapper } = renderApp(size);
    addBorder(wrapper, 2);

    await act(async () => {
      await ref.current!.zoomIn(1, 0);
    });

    // Centre (250, 250) stays put: position = -250 * (2 - 1).
    expect(ref.current!.instance.state).toMatchObject({
      scale: 2,
      positionX: -250,
      positionY: -250,
    });
  });
});
