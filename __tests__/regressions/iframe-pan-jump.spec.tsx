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
 *    entries (e.g. `{ Shift: true }`) → activation-key gating misbehaves.
 *    Fix: clear `pressedKeys` on window `blur`.
 */
describe("iframe pan jump regression", () => {
  it("resets panning when mousemove arrives with no buttons pressed (missed mouseup)", () => {
    const { content, wrapper } = renderApp({});

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
    fireEvent.mouseDown(content, { clientX: 100, clientY: 100, buttons: 1 });
    fireEvent.mouseMove(content, { clientX: 120, clientY: 120, buttons: 1 });
    fireEvent.mouseUp(content);

    const afterSecondPan = parseTransform(content.style.transform);
    expect(afterSecondPan.translate).toBe("50px, 50px");
  });

  it("does not interfere with normal panning when buttons are pressed", () => {
    const { content } = renderApp({});

    // Normal pan with button held throughout
    fireEvent.mouseDown(content, { clientX: 0, clientY: 0, buttons: 1 });
    fireEvent.mouseMove(content, { clientX: 40, clientY: 40, buttons: 1 });
    fireEvent.mouseMove(content, { clientX: 80, clientY: 80, buttons: 1 });
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

    // Pan again — should work cleanly from current position
    userEvent.hover(content);
    fireEvent.mouseDown(content, { clientX: 100, clientY: 100, buttons: 1 });
    fireEvent.mouseMove(content, { clientX: 110, clientY: 110, buttons: 1 });
    fireEvent.mouseUp(content);

    const final = parseTransform(content.style.transform);
    const [fx, fy] = final.translate.replace(/px/g, "").split(", ").map(Number);
    expect(typeof fx).toBe("number");
    expect(typeof fy).toBe("number");
    expect(Number.isNaN(fx)).toBe(false);
    expect(Number.isNaN(fy)).toBe(false);
  });
});

describe("iframe keyboard state regression", () => {
  it("clears pressed keys on window blur (missed keyup outside iframe)", () => {
    const { ref, content } = renderApp({
      panning: { activationKeys: ["Shift"] },
    });

    // Pan with Shift held — mouse events carry shiftKey: true (matching
    // real browser behavior when the key is physically held)
    userEvent.hover(content);
    fireEvent.mouseDown(content, { clientX: 0, clientY: 0, buttons: 1, shiftKey: true });
    fireEvent.mouseMove(content, { clientX: -50, clientY: -50, buttons: 1, shiftKey: true });
    fireEvent.mouseUp(content);
    expect(content.style.transform).toBe("translate(-50px, -50px) scale(1)");

    // Simulate iframe losing focus: window blur fires but keyup never does.
    fireEvent(window, new Event("blur"));

    // Shift should no longer be considered pressed
    expect(ref.current!.instance.pressedKeys["Shift"]).toBeFalsy();

    // Pan without Shift — should be blocked
    fireEvent.mouseDown(content, { clientX: 0, clientY: 0, buttons: 1 });
    fireEvent.mouseMove(content, { clientX: -20, clientY: -20, buttons: 1 });
    fireEvent.mouseUp(content);
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

  it("resumes normal key-gated panning after blur + re-press", () => {
    const { content } = renderApp({
      panning: { activationKeys: ["Shift"] },
    });

    userEvent.hover(content);
    fireEvent.mouseDown(content, { clientX: 0, clientY: 0, buttons: 1, shiftKey: true });
    fireEvent.mouseMove(content, { clientX: -30, clientY: -30, buttons: 1, shiftKey: true });
    fireEvent.mouseUp(content);
    expect(content.style.transform).toBe("translate(-30px, -30px) scale(1)");

    // Blur clears the key state
    fireEvent(window, new Event("blur"));

    // Re-hold Shift — panning should work again
    fireEvent.mouseDown(content, { clientX: 0, clientY: 0, buttons: 1, shiftKey: true });
    fireEvent.mouseMove(content, { clientX: -20, clientY: -20, buttons: 1, shiftKey: true });
    fireEvent.mouseUp(content);
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

    // No keydown — but the mousedown carries shiftKey: true
    fireEvent.mouseDown(content, {
      clientX: 100,
      clientY: 100,
      buttons: 1,
      shiftKey: true,
    });
    fireEvent.mouseMove(content, {
      clientX: 150,
      clientY: 150,
      buttons: 1,
      shiftKey: true,
    });
    fireEvent.mouseUp(content);

    const result = parseTransform(content.style.transform);
    expect(result.translate).toBe("50px, 50px");
  });

  it("does not zoom when modifier key is not held on wheel event", () => {
    const { content, ref } = renderApp({
      wheel: { activationKeys: ["Control"] },
    });

    userEvent.hover(content);
    fireEvent(
      content,
      new WheelEvent("wheel", {
        bubbles: true,
        deltaY: -5,
        ctrlKey: false,
      }),
    );

    expect(ref.current!.instance.state.scale).toBe(1);
  });
});
