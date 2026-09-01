import { fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { renderApp } from "../utils";
import { parseTransform } from "../utils/parsing";

/**
 * Regression: iframe boundary causes stale mouse/keyboard state.
 *
 * When the library runs inside an iframe (e.g. Storybook), events that fire
 * in the parent frame never reach the iframe's listeners:
 *
 * 1. **Mouse:** mouseup outside the iframe → `isPanning` stays true with
 *    stale `startCoords` → next mousemove inside the iframe causes a jump.
 *    Fix: check `event.buttons === 0` on mousemove.
 *
 * 2. **Keyboard:** keyup outside the iframe → `pressedKeys` has stale
 *    entries → activation-key gating misbehaves.
 *    Fix: clear `pressedKeys` on window `blur`. Modifier keys are also
 *    re-synced from every pointer/wheel event, so the blur fix is only
 *    observable with a non-modifier activation key; the tests use "a".
 */
const drag = (
  content: HTMLElement,
  from: [number, number],
  to: [number, number],
  init: MouseEventInit = {},
) => {
  fireEvent.mouseDown(content, {
    clientX: from[0],
    clientY: from[1],
    buttons: 1,
    ...init,
  });
  fireEvent.mouseMove(content, {
    clientX: to[0],
    clientY: to[1],
    buttons: 1,
    ...init,
  });
  fireEvent.mouseUp(content);
};

describe("iframe pan jump regression", () => {
  it("resets panning when mousemove arrives with no buttons pressed (missed mouseup)", () => {
    const { content } = renderApp({});

    // Start a pan gesture
    fireEvent.mouseDown(content, { clientX: 100, clientY: 100, buttons: 1 });
    fireEvent.mouseMove(content, { clientX: 150, clientY: 150, buttons: 1 });

    // Verify panning moved the content
    const afterPan = parseTransform(content.style.transform);
    expect(afterPan.translate).toBe("50px, 50px");

    // Simulate what happens in an iframe: the mouse leaves the iframe and
    // the mouseup fires in the parent frame. The iframe never sees it.
    // When the mouse re-enters the iframe, a mousemove arrives with buttons=0.
    fireEvent.mouseMove(content, { clientX: 300, clientY: 300, buttons: 0 });

    // The stale panning should have been cleared, not applied — position
    // stays at (50, 50) instead of jumping to (200, 200).
    const afterMissedUp = parseTransform(content.style.transform);
    expect(afterMissedUp.translate).toBe("50px, 50px");
  });

  it("allows normal pan after clearing a stale iframe panning state", () => {
    const { content } = renderApp({});

    // Start pan, then simulate missed mouseup (iframe scenario)
    fireEvent.mouseDown(content, { clientX: 50, clientY: 50, buttons: 1 });
    fireEvent.mouseMove(content, { clientX: 80, clientY: 80, buttons: 1 });

    const afterFirstPan = parseTransform(content.style.transform);
    expect(afterFirstPan.translate).toBe("30px, 30px");

    // Missed mouseup — mousemove with no buttons
    fireEvent.mouseMove(content, { clientX: 200, clientY: 200, buttons: 0 });

    // Position should NOT have jumped
    const afterClear = parseTransform(content.style.transform);
    expect(afterClear.translate).toBe("30px, 30px");

    // Now start a fresh pan — should work from current position without jump
    drag(content, [100, 100], [120, 120]);

    const afterSecondPan = parseTransform(content.style.transform);
    expect(afterSecondPan.translate).toBe("50px, 50px");
  });

  it("keeps panning while a non-left button is held (buttons !== 0)", () => {
    const { content } = renderApp({});

    // Middle-button drag: button 1, buttons bitmask 4.
    fireEvent.mouseDown(content, {
      clientX: 0,
      clientY: 0,
      button: 1,
      buttons: 4,
    });
    fireEvent.mouseMove(content, { clientX: 40, clientY: 40, buttons: 4 });
    fireEvent.mouseMove(content, { clientX: 80, clientY: 80, buttons: 4 });
    fireEvent.mouseUp(content);

    const result = parseTransform(content.style.transform);
    expect(result.translate).toBe("80px, 80px");
  });

  it("handles zoom-then-pan without jump after missed mouseup", () => {
    const { content, zoom } = renderApp({});

    // Start pan, drag outside iframe, miss mouseup
    fireEvent.mouseDown(content, { clientX: 100, clientY: 100, buttons: 1 });
    fireEvent.mouseMove(content, { clientX: 130, clientY: 130, buttons: 1 });

    const afterPan = parseTransform(content.style.transform);
    expect(afterPan.translate).toBe("30px, 30px");

    // Simulate missed mouseup
    fireEvent.mouseMove(content, { clientX: 500, clientY: 500, buttons: 0 });

    // Position should NOT jump
    const posAfterMissedUp = parseTransform(content.style.transform);
    expect(posAfterMissedUp.translate).toBe("30px, 30px");

    // Zoom in
    zoom({ value: 2, center: [250, 250] });
    const [zx, zy] = parseTransform(content.style.transform)
      .translate.replace(/px/g, "")
      .split(", ")
      .map(Number);

    // Pan again — must move by exactly the pointer delta from the zoomed
    // position, with no stale offset from the interrupted gesture.
    userEvent.hover(content);
    drag(content, [100, 100], [110, 110]);

    const final = parseTransform(content.style.transform);
    expect(final.translate).toBe(`${zx + 10}px, ${zy + 10}px`);
  });
});

describe("iframe keyboard state regression", () => {
  it("clears a stale non-modifier activation key on window blur (missed keyup outside iframe)", () => {
    const { ref, content } = renderApp({
      panning: { activationKeys: ["a"] },
    });

    fireEvent.keyDown(window, { key: "a" });
    drag(content, [0, 0], [-50, -50]);
    expect(content.style.transform).toBe("translate(-50px, -50px) scale(1)");

    // Simulate iframe losing focus: window blur fires but keyup never does.
    fireEvent(window, new Event("blur"));

    expect(ref.current!.instance.pressedKeys.a).toBeFalsy();

    // Pan without the key — must be blocked.
    drag(content, [0, 0], [-20, -20]);
    expect(content.style.transform).toBe("translate(-50px, -50px) scale(1)");
  });

  it("clears stale panning state on window blur", () => {
    const { content, ref } = renderApp({});

    // Start panning
    fireEvent.mouseDown(content, { clientX: 100, clientY: 100, buttons: 1 });
    fireEvent.mouseMove(content, { clientX: 130, clientY: 130, buttons: 1 });

    expect(ref.current!.instance.isPanning).toBe(true);

    // Iframe loses focus
    fireEvent(window, new Event("blur"));

    expect(ref.current!.instance.isPanning).toBe(false);
    expect(ref.current!.instance.startCoords).toBeNull();
  });

  it("resumes key-gated panning after blur once the key is pressed again", () => {
    const { content } = renderApp({
      panning: { activationKeys: ["a"] },
    });

    fireEvent.keyDown(window, { key: "a" });
    drag(content, [0, 0], [-30, -30]);
    expect(content.style.transform).toBe("translate(-30px, -30px) scale(1)");

    fireEvent(window, new Event("blur"));

    drag(content, [0, 0], [-20, -20]);
    expect(content.style.transform).toBe("translate(-30px, -30px) scale(1)");

    fireEvent.keyDown(window, { key: "a" });
    drag(content, [0, 0], [-20, -20]);
    expect(content.style.transform).toBe("translate(-50px, -50px) scale(1)");
  });
});

describe("iframe modifier key sync regression", () => {
  it("syncs modifier keys from wheel events even without keydown (unfocused iframe)", () => {
    const { content, ref } = renderApp({
      wheel: { activationKeys: ["Control"] },
    });

    // No keydown has fired (iframe never had focus). The user scrolls while
    // holding Ctrl — the wheel event carries ctrlKey: true.
    userEvent.hover(content);
    fireEvent(
      content,
      new WheelEvent("wheel", {
        bubbles: true,
        deltaY: -5,
        ctrlKey: true,
      }),
    );

    // Zoom should have been applied because syncModifierKeys picked up
    // ctrlKey from the wheel event.
    expect(ref.current!.instance.state.scale).toBeGreaterThan(1);
  });

  it("syncs Meta key from wheel event for Cmd+scroll zoom", () => {
    const { content, ref } = renderApp({
      wheel: {
        activationKeys: (keys: string[]) =>
          ["Meta", "Control"].some((key) => keys.includes(key)),
      },
    });

    userEvent.hover(content);
    fireEvent(
      content,
      new WheelEvent("wheel", {
        bubbles: true,
        deltaY: -5,
        metaKey: true,
      }),
    );

    expect(ref.current!.instance.state.scale).toBeGreaterThan(1);
  });

  it("syncs Shift from mousedown for key-gated panning without focus", () => {
    const { content } = renderApp({
      panning: { activationKeys: ["Shift"] },
    });

    // No keydown — but the mouse events carry shiftKey: true
    drag(content, [100, 100], [150, 150], { shiftKey: true });

    const result = parseTransform(content.style.transform);
    expect(result.translate).toBe("50px, 50px");
  });

  it("releasing the modifier (event flag false) stops the zoom even though keyup never fired", () => {
    const { content, ref } = renderApp({
      wheel: { activationKeys: ["Control"] },
    });

    userEvent.hover(content);
    fireEvent(
      content,
      new WheelEvent("wheel", { bubbles: true, deltaY: -5, ctrlKey: true }),
    );
    const zoomed = ref.current!.instance.state.scale;
    expect(zoomed).toBeGreaterThan(1);

    // Only the `false` branch of syncModifierKeys can block this one.
    fireEvent(
      content,
      new WheelEvent("wheel", { bubbles: true, deltaY: -5, ctrlKey: false }),
    );

    expect(ref.current!.instance.state.scale).toBe(zoomed);
  });
});
