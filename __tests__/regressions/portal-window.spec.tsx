import React from "react";
import { fireEvent, render } from "@testing-library/react";

import {
  TransformWrapper,
  TransformComponent,
  ReactZoomPanPinchRef,
} from "../../src";
import { isPanningStartAllowed } from "../../src/core/pan/panning.utils";

/**
 * Ref #290 / #537 — inside a portal window (`window.open` + `createPortal`)
 * every DOM node belongs to another realm, so `instanceof Element` and
 * `instanceof TouchEvent` from the library's realm are false and panning was
 * refused. jsdom gives an iframe its own realm, which reproduces the setup.
 */
describe("regressions: panning in another window (Ref #290, #537)", () => {
  let iframe: HTMLIFrameElement;

  const mountInOtherWindow = () => {
    iframe = document.createElement("iframe");
    document.body.appendChild(iframe);
    const doc = iframe.contentDocument!;
    // The iframe realm has its own constructors (Element, MouseEvent, …).
    const win = iframe.contentWindow as Window & typeof globalThis;
    const container = doc.createElement("div");
    doc.body.appendChild(container);

    const ref = React.createRef<ReactZoomPanPinchRef>();
    render(
      <TransformWrapper
        ref={ref}
        limitToBounds={false}
        velocityAnimation={{ disabled: true }}
        autoAlignment={{ disabled: true }}
        doubleClick={{ disabled: true }}
      >
        <TransformComponent>
          <div id="portal-target">portal content</div>
        </TransformComponent>
      </TransformWrapper>,
      { container },
    );

    const wrapper = container.querySelector<HTMLElement>(
      ".react-transform-wrapper",
    )!;
    const content = container.querySelector<HTMLElement>(
      ".react-transform-component",
    )!;
    return { ref, doc, win, wrapper, content };
  };

  afterEach(() => {
    iframe?.remove();
    document.body.innerHTML = "";
  });

  it("really is another realm (otherwise this file proves nothing)", () => {
    const { content, win } = mountInOtherWindow();

    expect(content instanceof Element).toBe(false);
    expect(content instanceof win.Element).toBe(true);
    expect(content.ownerDocument).not.toBe(document);
  });

  it("accepts a pan start whose composed path is made of foreign nodes", () => {
    const { ref, content, doc, win } = mountInOtherWindow();
    const { instance } = ref.current!;

    // `composedPath()` is only populated while the event is dispatching, so
    // the gate has to be evaluated from a listener, as the library does.
    const gate = (target: Element) => {
      let allowed: boolean | null = null;
      const listener = (event: Event) => {
        allowed = isPanningStartAllowed(instance, event as MouseEvent);
      };
      doc.addEventListener("mousedown", listener);
      target.dispatchEvent(new win.MouseEvent("mousedown", { bubbles: true }));
      doc.removeEventListener("mousedown", listener);
      return allowed;
    };

    expect(gate(content)).toBe(true);
    expect(gate(doc.body)).toBe(false);
  });

  it("pans with the mouse inside the other window", () => {
    const { ref, content } = mountInOtherWindow();

    fireEvent.mouseDown(content, { clientX: 0, clientY: 0, buttons: 1 });
    expect(ref.current!.instance.isPanning).toBe(true);

    fireEvent.mouseMove(content, { clientX: 40, clientY: 30, buttons: 1 });
    fireEvent.mouseUp(content);

    expect(ref.current!.instance.isPanning).toBe(false);
    expect(content.style.transform).toBe("translate(40px, 30px) scale(1)");
  });

  it("pans with touch inside the other window", () => {
    const { ref, content } = mountInOtherWindow();
    const touch = (clientX: number, clientY: number) => [
      { clientX, clientY, pageX: clientX, pageY: clientY, target: content },
    ];

    fireEvent.touchStart(content, { touches: touch(10, 10) });
    expect(ref.current!.instance.isPanning).toBe(true);

    fireEvent.touchMove(content, { touches: touch(-30, 25) });
    fireEvent.touchEnd(content, { touches: touch(-30, 25) });

    expect(content.style.transform).toBe("translate(-40px, 15px) scale(1)");
  });

  it("zooms with the wheel inside the other window", () => {
    const { ref, content, win } = mountInOtherWindow();

    content.dispatchEvent(
      new win.WheelEvent("wheel", { bubbles: true, deltaY: -100 }),
    );

    expect(ref.current!.instance.state.scale).toBeGreaterThan(1);
  });

  it("locks and releases text selection across the realm boundary", () => {
    const { content, wrapper } = mountInOtherWindow();

    fireEvent.mouseDown(content, { clientX: 0, clientY: 0, buttons: 1 });
    expect(wrapper.style.userSelect).toBe("none");
    fireEvent.mouseUp(content);
    expect(wrapper.style.userSelect).toBe("");
  });

  it("resolves zoomToElement ids in the other document", () => {
    const { ref, doc } = mountInOtherWindow();
    expect(document.getElementById("portal-target")).toBeNull();
    expect(doc.getElementById("portal-target")).not.toBeNull();

    // The foreign realm has no layout polyfill (sizes are 0), so only the
    // resolution is asserted: an unresolvable id would leave a rejected
    // promise or a thrown error, a resolved one returns a settled promise.
    return expect(
      ref.current!.zoomToElement("portal-target", { animationTime: 0 }),
    ).resolves.toBeUndefined();
  });
});
