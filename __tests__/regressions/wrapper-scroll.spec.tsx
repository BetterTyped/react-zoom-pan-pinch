import { fireEvent } from "@testing-library/react";

import { renderApp } from "../utils";

/**
 * Ref #280 / #477 —
 * https://github.com/BetterTyped/react-zoom-pan-pinch/issues/280
 * https://github.com/BetterTyped/react-zoom-pan-pinch/issues/477
 *
 * Focusing an input inside the content (the virtual keyboard on mobile) or
 * `scrollIntoView` makes the browser scroll the `overflow: hidden` wrapper.
 * The transform never knew, so the content stayed shifted and could not be
 * panned back. The scroll is now folded into the position.
 *
 * jsdom does not scroll, so the browser's scroll is simulated by setting the
 * offsets and dispatching `scroll`.
 */
const scrollWrapper = (wrapper: HTMLElement, left: number, top: number) => {
  let scrollLeft = left;
  let scrollTop = top;
  Object.defineProperty(wrapper, "scrollLeft", {
    configurable: true,
    get: () => scrollLeft,
    set: (value: number) => {
      scrollLeft = value;
    },
  });
  Object.defineProperty(wrapper, "scrollTop", {
    configurable: true,
    get: () => scrollTop,
    set: (value: number) => {
      scrollTop = value;
    },
  });
  fireEvent.scroll(wrapper);
};

describe("Wrapper scrolled by the browser (#280, #477)", () => {
  it("moves the scroll offset into the transform and resets the scroll", () => {
    const { wrapper, content, ref } = renderApp({
      initialScale: 2,
      initialPositionX: -100,
      initialPositionY: -50,
    });

    scrollWrapper(wrapper, 30, 120);

    // What was on screen stays on screen: position − scroll offset.
    expect(content.style.transform).toBe("translate(-130px, -170px) scale(2)");
    expect(ref.current!.instance.state.positionX).toBe(-130);
    expect(ref.current!.instance.state.positionY).toBe(-170);
    expect(wrapper.scrollLeft).toBe(0);
    expect(wrapper.scrollTop).toBe(0);
  });

  it("fires onTransform with the new position", () => {
    const onTransform = jest.fn();
    const { wrapper } = renderApp({ initialScale: 2, onTransform });
    onTransform.mockClear();

    scrollWrapper(wrapper, 0, 40);

    expect(onTransform).toHaveBeenCalledTimes(1);
    expect(onTransform.mock.calls[0][1]).toEqual({
      scale: 2,
      positionX: 0,
      positionY: -40,
    });
  });

  it("ignores a scroll event that left no offset", () => {
    const onTransform = jest.fn();
    const { wrapper } = renderApp({ onTransform });
    onTransform.mockClear();

    scrollWrapper(wrapper, 0, 0);

    expect(onTransform).not.toHaveBeenCalled();
  });
});
