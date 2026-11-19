import { act } from "@testing-library/react";

import { renderApp, flushAnimationFrames } from "../../utils";

/**
 * Named `initialPositionX/Y` (#349 —
 * https://github.com/BetterTyped/react-zoom-pan-pinch/issues/349).
 *
 * Position = (wrapper − content × scale) × share, with share 0 for
 * left/top, 0.5 for center and 1 for right/bottom. Wrapper is 500×500.
 */
describe("Positions [named initial positions] (#349)", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("places zoomed content at the right and bottom edges", () => {
    // 500 − 500 × 2 = −500 on both axes.
    const { content } = renderApp({
      initialScale: 2,
      initialPositionX: "right",
      initialPositionY: "bottom",
    });
    expect(content.style.transform).toBe("translate(-500px, -500px) scale(2)");
  });

  it("mixes a named axis with a numeric one: top-middle", () => {
    // The ask in #349. x: (500 − 1000) × 0.5 = −250; y stays at 0.
    const { content } = renderApp({
      initialScale: 2,
      initialPositionX: "center",
      initialPositionY: "top",
    });
    expect(content.style.transform).toBe("translate(-250px, 0px) scale(2)");
  });

  it("leaves a numeric axis exactly as given", () => {
    const { content } = renderApp({
      initialScale: 2,
      initialPositionX: -120,
      initialPositionY: "center",
    });
    expect(content.style.transform).toBe("translate(-120px, -250px) scale(2)");
  });

  it("returns to the named position on resetTransform", () => {
    jest.useFakeTimers();
    const { content, ref, pan } = renderApp({
      initialScale: 2,
      initialPositionX: "center",
      initialPositionY: "top",
    });

    pan({ x: 100, y: -100 });
    expect(content.style.transform).not.toBe("translate(-250px, 0px) scale(2)");

    act(() => {
      ref.current!.resetTransform(0);
      flushAnimationFrames();
    });
    expect(content.style.transform).toBe("translate(-250px, 0px) scale(2)");
  });

  it("aligns one axis of a fitOnInit layout", () => {
    // 1000×500 content: fit 0.5 → 500×250, centred at y = 125; "top" → 0.
    const { content } = renderApp({
      contentWidth: "1000px",
      contentHeight: "500px",
      minScale: 0.1,
      fitOnInit: true,
      initialPositionY: "top",
    });
    expect(content.style.transform).toBe("translate(0px, 0px) scale(0.5)");
  });

  it("wins over centerOnInit on its own axis", () => {
    // Centred x: (500 − 1000) / 2 = −250; y named "bottom": −500.
    const { content } = renderApp({
      initialScale: 2,
      centerOnInit: true,
      initialPositionY: "bottom",
    });
    expect(content.style.transform).toBe("translate(-250px, -500px) scale(2)");
  });
});
