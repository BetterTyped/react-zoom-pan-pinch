import { fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderApp } from "../../utils";

/**
 * `panning.suppressClickAfterPan` (#452, #519 —
 * https://github.com/BetterTyped/react-zoom-pan-pinch/issues/452).
 *
 * Browsers fire `click` after `mousedown` + `mouseup` on the same element
 * however far the pointer travelled, so dragging over clickable content also
 * clicked it. A pan that moved the pointer more than 5px (`CLICK_DISTANCE`)
 * now swallows the click right after it.
 */
const mouseDrag = (content: HTMLElement, dx: number, dy: number) => {
  userEvent.hover(content);
  fireEvent.mouseDown(content, { clientX: 100, clientY: 100, buttons: 1 });
  fireEvent.mouseMove(content, {
    clientX: 100 + dx,
    clientY: 100 + dy,
    buttons: 1,
  });
  fireEvent.mouseUp(content, { clientX: 100 + dx, clientY: 100 + dy });
};

const nextTick = () =>
  new Promise<void>((resolve) => {
    setTimeout(resolve, 0);
  });

describe("Pan [click after pan] (#452)", () => {
  it("swallows the click that follows a drag", () => {
    const { content } = renderApp();
    const onClick = jest.fn();
    content.addEventListener("click", onClick);

    mouseDrag(content, -100, 0);
    const notCancelled = fireEvent.click(content);

    expect(onClick).not.toHaveBeenCalled();
    // preventDefault too, so a link inside the content does not navigate.
    expect(notCancelled).toBe(false);
  });

  it("swallows only that click: the next one goes through", async () => {
    const { content } = renderApp();
    const onClick = jest.fn();
    content.addEventListener("click", onClick);

    mouseDrag(content, -100, 0);
    fireEvent.click(content);
    fireEvent.click(content);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("stops listening on the next tick when no click followed", async () => {
    // e.g. mouseup outside the wrapper, where the browser fires no click on
    // the content.
    const { content } = renderApp();
    const onClick = jest.fn();
    content.addEventListener("click", onClick);

    mouseDrag(content, -100, 0);
    await nextTick();
    fireEvent.click(content);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("keeps the click of a press that moved within the click distance", () => {
    const { content } = renderApp();
    const onClick = jest.fn();
    content.addEventListener("click", onClick);

    // 3² + 4² = 25 → exactly 5px, still a click.
    mouseDrag(content, -3, -4);
    fireEvent.click(content);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("swallows the click of a press that moved just past the click distance", () => {
    const { content } = renderApp();
    const onClick = jest.fn();
    content.addEventListener("click", onClick);

    mouseDrag(content, -4, -4); // √32 ≈ 5.66px
    fireEvent.click(content);

    expect(onClick).not.toHaveBeenCalled();
  });

  it("counts pointer travel, not content movement: a drag against the bounds still swallows", () => {
    // Without padding the content cannot move at scale 1, but the user
    // dragged — that is not a click.
    const { content } = renderApp({ disablePadding: true });
    const onClick = jest.fn();
    content.addEventListener("click", onClick);

    mouseDrag(content, -100, 0);
    expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    fireEvent.click(content);

    expect(onClick).not.toHaveBeenCalled();
  });

  it("leaves clicks outside the wrapper alone", () => {
    const { content } = renderApp();
    const onClick = jest.fn();
    document.body.addEventListener("click", onClick);

    mouseDrag(content, -100, 0);
    fireEvent.click(document.body);

    expect(onClick).toHaveBeenCalledTimes(1);
    document.body.removeEventListener("click", onClick);
  });

  it("lets the click through with suppressClickAfterPan: false", () => {
    const { content } = renderApp({
      panning: { suppressClickAfterPan: false },
    });
    const onClick = jest.fn();
    content.addEventListener("click", onClick);

    mouseDrag(content, -100, 0);
    fireEvent.click(content);

    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
