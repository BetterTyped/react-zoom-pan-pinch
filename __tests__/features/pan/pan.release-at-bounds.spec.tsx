import { fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderApp } from "../../utils";

/**
 * `panning.releaseAtBounds` (#509 —
 * https://github.com/BetterTyped/react-zoom-pan-pinch/issues/509).
 *
 * A viewer inside a carousel or a scrolling page claimed every drag, even
 * when the content could not move that way. With the option on, a gesture
 * whose first move heads into a bound the content already rests on is not
 * claimed: no pan and no `preventDefault`, so the page scrolls (touch) or the
 * parent takes the drag.
 *
 * 500×500 wrapper and content: at scale 1 every bound is 0, at scale 2 the
 * X/Y bounds are −500…0.
 */
const touch = (x: number, y: number) => ({
  touches: [{ clientX: x, clientY: y, pageX: x, pageY: y }],
});

/** Returns whether each touchmove was left uncancelled. */
const touchDrag = (
  content: HTMLElement,
  dx: number,
  dy: number,
  moves = 1,
): boolean[] => {
  fireEvent.touchStart(content, touch(100, 100));
  const results: boolean[] = [];
  for (let i = 1; i <= moves; i += 1) {
    results.push(
      fireEvent.touchMove(
        content,
        touch(100 + (dx * i) / moves, 100 + (dy * i) / moves),
      ),
    );
  }
  fireEvent.touchEnd(content, touch(100 + dx, 100 + dy));
  return results;
};

describe("Pan [releaseAtBounds] (#509)", () => {
  it("does not claim a touch drag at scale 1, so the page can scroll", () => {
    const onPanningStop = jest.fn();
    const { content } = renderApp({
      panning: { releaseAtBounds: true },
      onPanningStop,
    });

    const [notCancelled] = touchDrag(content, 0, -80);

    expect(notCancelled).toBe(true);
    expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    // The started pan is ended right away, once.
    expect(onPanningStop).toHaveBeenCalledTimes(1);
  });

  it("claims the same drag without the option (the default)", () => {
    const { content } = renderApp();

    const [notCancelled] = touchDrag(content, 0, -80);

    expect(notCancelled).toBe(false);
    // Plain padding area (autoAlignment off in renderApp): follows 1:1.
    expect(content.style.transform).toBe("translate(0px, -80px) scale(1)");
  });

  it("pans when the zoomed content can move in the drag direction", () => {
    const { content } = renderApp({
      initialScale: 2,
      panning: { releaseAtBounds: true },
    });

    // At (0, 0) the content rests on its max bound: dragging left moves it
    // towards −500, which is allowed.
    const [notCancelled] = touchDrag(content, -100, 0);

    expect(notCancelled).toBe(false);
    expect(content.style.transform).toBe("translate(-100px, 0px) scale(2)");
  });

  it("releases a drag into the bound the zoomed content rests on", () => {
    const { content } = renderApp({
      initialScale: 2,
      panning: { releaseAtBounds: true },
    });

    const [notCancelled] = touchDrag(content, 100, 0);

    expect(notCancelled).toBe(true);
    expect(content.style.transform).toBe("translate(0px, 0px) scale(2)");
  });

  it("judges the direction on the dominant axis", () => {
    // Mostly vertical drag down, with the content at the top bound (y = 0,
    // the max): released even though x could move left.
    const { content } = renderApp({
      initialScale: 2,
      initialPositionX: -200,
      panning: { releaseAtBounds: true },
    });

    const [notCancelled] = touchDrag(content, -10, 100);

    expect(notCancelled).toBe(true);
    expect(content.style.transform).toBe("translate(-200px, 0px) scale(2)");
  });

  it("keeps a gesture that started inside the bounds when it reaches one", () => {
    const onPanningStop = jest.fn();
    const { content } = renderApp({
      initialScale: 2,
      initialPositionX: -50,
      panning: { releaseAtBounds: true },
      onPanningStop,
    });

    // First move (+20) is allowed; the gesture then runs past the max bound
    // (0) into the padding and is not handed over midway.
    const results = touchDrag(content, 100, 0, 5);

    expect(results).toEqual([false, false, false, false, false]);
    expect(content.style.transform).toBe("translate(50px, 0px) scale(2)");
    expect(onPanningStop).toHaveBeenCalledTimes(1);
  });

  it("releases a mouse drag the same way", () => {
    const { content } = renderApp({ panning: { releaseAtBounds: true } });

    userEvent.hover(content);
    fireEvent.mouseDown(content, { clientX: 100, clientY: 100, buttons: 1 });
    const notCancelled = fireEvent.mouseMove(content, {
      clientX: 200,
      clientY: 100,
      buttons: 1,
    });
    fireEvent.mouseMove(content, { clientX: 300, clientY: 100, buttons: 1 });
    fireEvent.mouseUp(content);

    expect(notCancelled).toBe(true);
    expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
  });

  it("never releases without limitToBounds: there is no bound to rest on", () => {
    const { content } = renderApp({
      limitToBounds: false,
      panning: { releaseAtBounds: true },
    });

    const [notCancelled] = touchDrag(content, 100, 0);

    expect(notCancelled).toBe(false);
    expect(content.style.transform).toBe("translate(100px, 0px) scale(1)");
  });
});
