import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import {
  TransformWrapper,
  TransformComponent,
  MiniMap,
  MiniMapProps,
  ReactZoomPanPinchContentRef,
} from "../../../src";

type Options = {
  miniMap?: Partial<MiniMapProps>;
  limitToBounds?: boolean;
};

/**
 * Layout used by every test here:
 *  - viewport 500x500, content 1000x1000, scale 1 at (0, 0)
 *  - mini map 200x200 with no padding, so 1 mini map px = 5 content px
 *    (mapScale 0.2) and the viewport indicator is 100x100 at (0, 0).
 *  - bounds at scale 1: positionX/Y in [-500, 0].
 */
function renderMiniMap({ miniMap = {}, limitToBounds = true }: Options = {}) {
  const ref = React.createRef<ReactZoomPanPinchContentRef>();
  render(
    <TransformWrapper
      ref={ref}
      doubleClick={{ disabled: true }}
      velocityAnimation={{ disabled: true }}
      autoAlignment={{ disabled: true }}
      limitToBounds={limitToBounds}
    >
      <TransformComponent
        wrapperProps={
          { "data-testid": "wrapper" } as React.HTMLAttributes<HTMLDivElement>
        }
        contentProps={
          { "data-testid": "content" } as React.HTMLAttributes<HTMLDivElement>
        }
        wrapperStyle={{ width: "500px", height: "500px" }}
        contentStyle={{ width: "1000px", height: "1000px" }}
      >
        <div style={{ width: "1000px", height: "1000px" }}>content</div>
      </TransformComponent>
      <MiniMap offsetScale={0} {...miniMap}>
        <div style={{ width: "1000px", height: "1000px" }}>minimap content</div>
      </MiniMap>
    </TransformWrapper>,
  );

  const content = screen.getByTestId("content");
  const miniMapEl = document.querySelector(".rzpp-mini-map") as HTMLElement;
  const preview = document.querySelector(
    ".rzpp-minimap-preview",
  ) as HTMLElement;

  const mouseDown = (x: number, y: number) =>
    fireEvent.mouseDown(miniMapEl, { clientX: x, clientY: y, buttons: 1 });
  const mouseMove = (x: number, y: number) =>
    fireEvent.mouseMove(document, { clientX: x, clientY: y, buttons: 1 });
  const mouseUp = (x: number, y: number) =>
    fireEvent.mouseUp(document, { clientX: x, clientY: y });

  const touch = (x: number, y: number) => [
    { clientX: x, clientY: y, pageX: x, pageY: y, target: miniMapEl },
  ];
  const touchStart = (x: number, y: number) =>
    fireEvent.touchStart(miniMapEl, { touches: touch(x, y) });
  const touchMove = (x: number, y: number) =>
    fireEvent.touchMove(document, { touches: touch(x, y) });
  const touchEnd = (x: number, y: number) =>
    fireEvent.touchEnd(document, {
      touches: [],
      changedTouches: touch(x, y),
    });

  return {
    ref,
    content,
    miniMapEl,
    preview,
    mouseDown,
    mouseMove,
    mouseUp,
    touchStart,
    touchMove,
    touchEnd,
  };
}

const AT_ORIGIN = "translate(0px, 0px) scale(1)";

describe("MiniMap [Panning]", () => {
  describe("grabbing the viewport indicator", () => {
    it("does not move the view on mousedown, even far from the indicator", () => {
      const { content, preview, mouseDown } = renderMiniMap();

      // (190, 190) is the far corner of the map, well outside the 100x100
      // indicator sitting at (0, 0). The old implementation centred the
      // indicator on the cursor here, which threw the view into a corner.
      mouseDown(190, 190);

      expect(content.style.transform).toBe(AT_ORIGIN);
      expect(preview.style.transform).toBe("translate(0px, 0px)");
    });

    it("moves the view relative to the pointer movement (1 map px = 1/mapScale content px)", () => {
      const { content, preview, mouseDown, mouseMove } = renderMiniMap();

      mouseDown(100, 100);
      mouseMove(110, 115);

      // +10 / +15 map px → viewport moves by +50 / +75 content px.
      expect(content.style.transform).toBe("translate(-50px, -75px) scale(1)");
      // The indicator follows the pointer 1:1.
      expect(preview.style.transform).toBe("translate(10px, 15px)");
    });

    it("accumulates successive moves incrementally", () => {
      const { content, mouseDown, mouseMove } = renderMiniMap();

      mouseDown(100, 100);
      mouseMove(110, 115);
      mouseMove(120, 115);

      expect(content.style.transform).toBe("translate(-100px, -75px) scale(1)");
    });

    it("starts the drag from the current position, not from the pointer position", () => {
      const { ref, content, mouseDown, mouseMove } = renderMiniMap();

      ref.current!.instance.setState(1, -200, -100);
      expect(content.style.transform).toBe(
        "translate(-200px, -100px) scale(1)",
      );

      // Press outside the indicator (which now sits at (40, 20)) and move
      // by 5 px: only the delta matters.
      mouseDown(150, 150);
      mouseMove(155, 155);

      expect(content.style.transform).toBe(
        "translate(-225px, -125px) scale(1)",
      );
    });

    it("scales the movement with the current zoom level", () => {
      const { ref, content, preview, mouseDown, mouseMove } = renderMiniMap();

      ref.current!.instance.setState(2, 0, 0);
      expect(preview.style.width).toBe("50px");

      mouseDown(20, 20);
      mouseMove(30, 30);

      // +10 map px = +50 content px = +100 screen px at scale 2.
      expect(content.style.transform).toBe(
        "translate(-100px, -100px) scale(2)",
      );
      expect(preview.style.transform).toBe("translate(10px, 10px)");
    });

    it("keeps the view inside the bounds while dragging", () => {
      const { content, mouseDown, mouseMove } = renderMiniMap();

      mouseDown(100, 100);
      mouseMove(50, 50);
      expect(content.style.transform).toBe(AT_ORIGIN);

      mouseMove(350, 350);
      expect(content.style.transform).toBe(
        "translate(-500px, -500px) scale(1)",
      );
    });

    it("can leave the content when limitToBounds is off, and the map keeps the indicator visible", () => {
      const { content, preview, mouseDown, mouseMove } = renderMiniMap({
        limitToBounds: false,
      });

      mouseDown(100, 100);
      mouseMove(60, 60);

      expect(content.style.transform).toBe("translate(200px, 200px) scale(1)");

      // The map now covers the union of content and viewport, so the
      // indicator is drawn at the top-left corner instead of overflowing.
      expect(preview.style.transform).toBe("translate(0px, 0px)");
      expect(preview.style.width).toBe("83.33px");
    });
  });

  describe("ending the drag", () => {
    it("stops following the pointer after mouseup", () => {
      const { content, mouseDown, mouseMove, mouseUp } = renderMiniMap();

      mouseDown(100, 100);
      mouseMove(110, 110);
      mouseUp(110, 110);
      mouseMove(200, 200);

      expect(content.style.transform).toBe("translate(-50px, -50px) scale(1)");
    });

    it("stops when the mouse button was released outside the window", () => {
      const { content, mouseDown, mouseMove } = renderMiniMap();

      mouseDown(100, 100);
      mouseMove(110, 110);
      fireEvent.mouseMove(document, { clientX: 150, clientY: 150, buttons: 0 });
      mouseMove(200, 200);

      expect(content.style.transform).toBe("translate(-50px, -50px) scale(1)");
    });

    it("does not start a drag with a non-primary button", () => {
      const { content, mouseMove, miniMapEl } = renderMiniMap();

      fireEvent.mouseDown(miniMapEl, {
        clientX: 100,
        clientY: 100,
        button: 2,
        buttons: 2,
      });
      mouseMove(110, 110);

      expect(content.style.transform).toBe(AT_ORIGIN);
    });

    it("ignores presses that start outside the mini map", () => {
      const { content, mouseMove } = renderMiniMap();

      fireEvent.mouseDown(document.body, {
        clientX: 100,
        clientY: 100,
        buttons: 1,
      });
      mouseMove(110, 110);

      expect(content.style.transform).toBe(AT_ORIGIN);
    });
  });

  describe("touch", () => {
    it("drags with one finger", () => {
      const { content, preview, touchStart, touchMove } = renderMiniMap();

      touchStart(50, 50);
      expect(content.style.transform).toBe(AT_ORIGIN);

      touchMove(60, 70);

      expect(content.style.transform).toBe("translate(-50px, -100px) scale(1)");
      expect(preview.style.transform).toBe("translate(10px, 20px)");
    });

    it("stops following the finger after touchend", () => {
      const { content, touchStart, touchMove, touchEnd } = renderMiniMap();

      touchStart(50, 50);
      touchMove(60, 60);
      touchEnd(60, 60);
      touchMove(100, 100);

      expect(content.style.transform).toBe("translate(-50px, -50px) scale(1)");
    });
  });

  describe("inversePan", () => {
    it("moves the content with the pointer instead of the indicator", () => {
      const { ref, content, mouseDown, mouseMove } = renderMiniMap({
        miniMap: { inversePan: true },
      });

      ref.current!.instance.setState(1, -200, -200);

      mouseDown(100, 100);
      mouseMove(110, 110);

      expect(content.style.transform).toBe(
        "translate(-150px, -150px) scale(1)",
      );
    });
  });

  describe("panning={false}", () => {
    it("does not move the view on drag", () => {
      const {
        content,
        miniMapEl,
        mouseDown,
        mouseMove,
        touchStart,
        touchMove,
      } = renderMiniMap({ miniMap: { panning: false } });

      mouseDown(100, 100);
      mouseMove(110, 110);
      touchStart(50, 50);
      touchMove(60, 60);

      expect(content.style.transform).toBe(AT_ORIGIN);
      expect(miniMapEl.style.cursor).toBe("");
    });
  });

  describe("cursor", () => {
    it("shows a grab cursor and grabbing while dragging", () => {
      const { miniMapEl, mouseDown, mouseUp } = renderMiniMap();

      expect(miniMapEl.style.cursor).toBe("grab");
      mouseDown(100, 100);
      expect(miniMapEl.style.cursor).toBe("grabbing");
      mouseUp(100, 100);
      expect(miniMapEl.style.cursor).toBe("grab");
    });
  });

  describe("onClick", () => {
    it("reports the clicked point in content coordinates when the pointer did not move", () => {
      const onClick = jest.fn();
      const { mouseDown, mouseUp } = renderMiniMap({ miniMap: { onClick } });

      mouseDown(50, 50);
      mouseUp(50, 50);

      expect(onClick).toHaveBeenCalledTimes(1);
      expect(onClick.mock.calls[0][1]).toEqual({ x: 250, y: 250 });
    });

    it("is not fired after a drag", () => {
      const onClick = jest.fn();
      const { mouseDown, mouseMove, mouseUp } = renderMiniMap({
        miniMap: { onClick },
      });

      mouseDown(50, 50);
      mouseMove(60, 60);
      mouseUp(60, 60);

      expect(onClick).not.toHaveBeenCalled();
    });

    it("fires for a tap", () => {
      const onClick = jest.fn();
      const { touchStart, touchEnd } = renderMiniMap({ miniMap: { onClick } });

      touchStart(20, 40);
      touchEnd(20, 40);

      expect(onClick).toHaveBeenCalledTimes(1);
      expect(onClick.mock.calls[0][1]).toEqual({ x: 100, y: 200 });
    });
  });

  describe("zoomable", () => {
    const wheel = (element: HTMLElement, deltaY: number) => {
      const event = new WheelEvent("wheel", {
        bubbles: true,
        cancelable: true,
        deltaY,
      });
      fireEvent(element, event);
      return event;
    };

    it("does not zoom by default", () => {
      const { content, miniMapEl } = renderMiniMap();

      const event = wheel(miniMapEl, -100);

      expect(content.style.transform).toBe(AT_ORIGIN);
      expect(event.defaultPrevented).toBe(false);
    });

    it("zooms the main view around the viewport centre by zoomStep per notch", () => {
      const { content, miniMapEl } = renderMiniMap({
        miniMap: { zoomable: true, zoomStep: 0.2 },
      });

      const event = wheel(miniMapEl, -100);

      // Centre of the viewport is (250, 250) in content coordinates:
      // position = 0 - 250 * (1.2 - 1) = -50.
      expect(content.style.transform).toBe(
        "translate(-50px, -50px) scale(1.2)",
      );
      expect(event.defaultPrevented).toBe(true);

      wheel(miniMapEl, 100);
      expect(content.style.transform).toBe(AT_ORIGIN);
    });
  });
});
