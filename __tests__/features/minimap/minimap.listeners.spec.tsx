import React from "react";
import { fireEvent, render } from "@testing-library/react";

import {
  TransformWrapper,
  TransformComponent,
  MiniMap,
  ReactZoomPanPinchContentRef,
} from "../../../src";

const ref = React.createRef<ReactZoomPanPinchContentRef>();

const tree = (miniMapWidth: number) => (
  <TransformWrapper
    ref={ref}
    doubleClick={{ disabled: true }}
    velocityAnimation={{ disabled: true }}
    autoAlignment={{ disabled: true }}
  >
    <TransformComponent
      wrapperStyle={{ width: "500px", height: "500px" }}
      contentStyle={{ width: "1000px", height: "1000px" }}
    >
      <div style={{ width: "1000px", height: "1000px" }}>content</div>
    </TransformComponent>
    <MiniMap width={miniMapWidth} height={200}>
      <div style={{ width: "1000px", height: "1000px" }}>mini</div>
    </MiniMap>
  </TransformWrapper>
);

const countCalls = (spy: jest.SpyInstance, type: string) =>
  spy.mock.calls.filter(([eventType]) => eventType === type).length;

const MINI_MAP_EVENTS = ["mousedown", "mousemove", "mouseup"];

/**
 * The MiniMap used to register its document `mousedown` handler on every
 * render and never remove it, so handlers piled up for the lifetime of the page.
 */
describe("MiniMap [Listeners]", () => {
  let addSpy: jest.SpyInstance;
  let removeSpy: jest.SpyInstance;

  beforeEach(() => {
    addSpy = jest.spyOn(document, "addEventListener");
    removeSpy = jest.spyOn(document, "removeEventListener");
  });

  afterEach(() => {
    addSpy.mockRestore();
    removeSpy.mockRestore();
  });

  it("keeps at most one active document listener per event across re-renders", () => {
    const view = render(tree(200));
    view.rerender(tree(210));
    view.rerender(tree(220));
    view.rerender(tree(230));

    MINI_MAP_EVENTS.forEach((type) => {
      const active = countCalls(addSpy, type) - countCalls(removeSpy, type);
      expect({ type, active }).toEqual({ type, active: 1 });
    });
  });

  it("removes every document listener on unmount", () => {
    const view = render(tree(200));
    view.rerender(tree(210));
    view.unmount();

    MINI_MAP_EVENTS.forEach((type) => {
      expect({ type, added: countCalls(addSpy, type) }).toEqual({
        type,
        added: countCalls(removeSpy, type),
      });
    });
  });

  it("handles a mini map drag move exactly once after several re-renders", () => {
    const view = render(tree(200));
    view.rerender(tree(210));
    view.rerender(tree(220));

    const setState = jest.spyOn(ref.current!.instance, "setState");
    const miniMap = document.querySelector(".rzpp-mini-map") as HTMLElement;

    // mousedown arms the drag; the transform is written on mousemove.
    fireEvent.mouseDown(miniMap, { clientX: 50, clientY: 50 });
    fireEvent.mouseMove(miniMap, { clientX: 60, clientY: 60 });

    expect(setState).toHaveBeenCalledTimes(1);
    setState.mockRestore();
  });
});
