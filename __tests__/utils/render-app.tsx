import {
  RenderResult,
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { ReactZoomPanPinchProps, ReactZoomPanPinchRef } from "../../src";
import { Example } from "../examples/example";

interface RenderApp {
  ref: { current: ReactZoomPanPinchRef | null };
  renders: number;
  zoomInBtn: HTMLElement;
  zoomOutBtn: HTMLElement;
  resetBtn: HTMLElement;
  center: HTMLElement;
  content: HTMLElement;
  wrapper: HTMLElement;
  pan: (options: { x: number; y: number; steps?: number }) => void;
  touchPan: (options: { x: number; y: number; steps?: number }) => void;
  zoom: (options: { value: number; center?: [number, number] }) => void;
  pinch: (options: {
    value: number;
    center?: [number, number];
    targetCenter?: [number, number];
  }) => void;
}

const waitForPreviousActionToEnd = () => {
  // Synchronous await for 10ms to wait for the previous event to finish (pinching or touching)
  const startTime = Date.now();
  while (Date.now() - startTime < 10) {}
};

function getPinchTouches(
  content: HTMLElement,
  center: [number, number],
  step: number,
  from: number,
) {
  const cx = center[0];
  const cy = center[1];

  const dx = (step + from) / 2;

  const leftTouch = {
    pageX: cx - dx,
    pageY: cy - dx,
    clientX: cx - dx,
    clientY: cy - dx,
    target: content,
  };

  const rightTouch = {
    pageX: cx + dx,
    pageY: cy + dx,
    clientX: cx + dx,
    clientY: cy + dx,
    target: content,
  };

  const touches = [leftTouch, rightTouch];

  return touches;
}

export const renderApp = ({
  contentHeight,
  contentWidth,
  wrapperHeight,
  wrapperWidth,
  ...props
}: ReactZoomPanPinchProps & {
  contentWidth?: string;
  contentHeight?: string;
  wrapperWidth?: string;
  wrapperHeight?: string;
} = {}): RenderResult & RenderApp => {
  let renders = 0;
  let ref: { current: ReactZoomPanPinchRef | null } = { current: null };

  const onRender = () => {
    renders += 1;
  };

  const exampleProps: ReactZoomPanPinchProps = {
    doubleClick: {
      disabled: true,
    },
    velocityAnimation: {
      disabled: true,
    },
    autoAlignment: {
      disabled: true,
    },
    ...props,
    ref: (r) => {
      ref.current = r;
    },
  };

  const view = render(
    <Example
      props={exampleProps}
      onRender={onRender}
      {...{ contentHeight, contentWidth, wrapperHeight, wrapperWidth }}
    />,
  );
  // controls buttons
  const zoomInBtn = screen.getByTestId("zoom-in");
  const zoomOutBtn = screen.getByTestId("zoom-out");
  const resetBtn = screen.getByTestId("reset");
  const center = screen.getByTestId("center");
  // containers
  const content = screen.getByTestId("content");
  const wrapper = screen.getByTestId("wrapper");

  const zoom: RenderApp["zoom"] = (options) => {
    const { value, center } = options;
    if (!ref.current) throw new Error("ref.current is null");

    userEvent.hover(content);
    if (center) {
      fireEvent.mouseMove(content, { clientX: center[0], clientY: center[1] });
    }

    const step = 1;

    const isZoomIn = ref.current.instance.state.scale < value;

    const startTime = Date.now();
    while (Date.now() - startTime < 200) {
      if (
        (isZoomIn
          ? ref.current.instance.state.scale < value
          : ref.current.instance.state.scale > value) &&
        ref.current.instance.state.scale !== value
      ) {
        const isNearScale =
          Math.abs(ref.current.instance.state.scale - value) < 0.05;

        const newStep = isNearScale ? 0.4 : step;

        fireEvent(
          content,
          new WheelEvent("wheel", {
            bubbles: true,
            deltaY: isZoomIn ? -newStep : newStep,
          }),
        );
      } else {
        break;
      }
    }
  };

  const pinch: RenderApp["pinch"] = (options) => {
    const { value, center = [0, 0] } = options;
    if (!ref.current) throw new Error("ref.current is null");

    waitForPreviousActionToEnd();

    const targetCenter = options?.targetCenter || center;
    const isZoomIn = ref.current.instance.state.scale < value;
    const from = isZoomIn ? 1 : 2;
    const step = 0.1;

    let pinchValue = 0;

    fireEvent.touchStart(content, {
      touches: getPinchTouches(content, center, step, from),
    });

    const startTime = Date.now();
    while (Date.now() - startTime < 200) {
      if (
        (isZoomIn
          ? ref.current.instance.state.scale < value
          : ref.current.instance.state.scale > value) &&
        ref.current.instance.state.scale !== value
      ) {
        const scaleDifference = Math.abs(
          ref.current.instance.state.scale - value,
        );
        const isNearScale = scaleDifference < 0.1;

        const newStep = isNearScale ? step / 6 : step;

        pinchValue = pinchValue + newStep;

        fireEvent.touchMove(content, {
          touches: getPinchTouches(content, center, pinchValue, from),
        });
      } else {
        break;
      }
    }

    fireEvent.touchMove(content, {
      touches: getPinchTouches(content, targetCenter, pinchValue, from),
    });

    fireEvent.touchEnd(content, {
      touches: getPinchTouches(content, center, pinchValue, from),
    });
  };

  const pan: RenderApp["pan"] = ({ x, y, steps = 1 }) => {
    userEvent.hover(content);
    fireEvent.mouseDown(content);
    const xStep = x / steps;
    const yStep = y / steps;
    [...Array(steps)].forEach((_, index) => {
      if (index !== steps - 1) {
        fireEvent.mouseMove(content, {
          clientX: xStep * index,
          clientY: yStep * index,
        });
      } else {
        fireEvent.mouseMove(content, { clientX: x, clientY: y });
      }
    });
    fireEvent.mouseUp(content);
    fireEvent.blur(content);
  };

  const touchPan: RenderApp["touchPan"] = ({ x, y, steps = 1 }) => {
    waitForPreviousActionToEnd();

    const xStep = x / steps;
    const yStep = y / steps;

    fireEvent.touchStart(content, {
      touches: [
        {
          pageX: 0,
          pageY: 0,
          clientX: 0,
          clientY: 0,
          target: content,
        },
      ],
    });
    [...Array(steps)].forEach((_, index) => {
      if (index !== steps - 1) {
        fireEvent.touchMove(content, {
          touches: [
            {
              pageX: xStep * index,
              pageY: yStep * index,
              clientX: xStep * index,
              clientY: yStep * index,
              target: content,
            },
          ],
        });
      } else {
        fireEvent.touchMove(content, {
          touches: [
            {
              pageX: x,
              pageY: y,
              clientX: x,
              clientY: y,
              target: content,
            },
          ],
        });
      }
    });
    fireEvent.touchEnd(content, {
      touches: [
        {
          pageX: x,
          pageY: y,
          clientX: x,
          clientY: y,
          target: content,
        },
      ],
    });
  };

  return {
    ...view,
    ref,
    renders,
    zoomInBtn,
    zoomOutBtn,
    resetBtn,
    center,
    content,
    wrapper,
    zoom,
    pan,
    pinch,
    touchPan,
  };
};
