import { ZoomPanPinch } from "../../src/core/instance.core";
import { baseClasses } from "../../src/constants/state.constants";
import {
  getMousePosition,
  handleCalculateWheelZoom,
  isWheelPanningAllowed,
} from "../../src/core/wheel/wheel.utils";
import { handleWheelZoom } from "../../src/core/wheel/wheel.logic";
import { getVelocityPosition } from "../../src/core/pan/velocity.utils";
import {
  clientToContentPoint,
  contentToClientPoint,
  getUnionRect,
} from "../../src/core/handlers/handlers.utils";
import { assignRef, mergeRefs } from "../../src/utils/ref.utils";
import { handleCallback } from "../../src/utils/callback.utils";
import { createSetup } from "../../src/utils/state.utils";
import { ReactZoomPanPinchProps } from "../../src/models";

/**
 * Unit coverage for the small gates and helpers that the gesture specs only
 * reach through their happy path.
 */
const mountedInstance = (props: ReactZoomPanPinchProps = {}) => {
  const instance = new ZoomPanPinch(props);
  const wrapper = document.createElement("div");
  // `excluded` selectors are scoped to the library's wrapper class.
  wrapper.className = baseClasses.wrapperClass;
  const content = document.createElement("div");
  content.className = baseClasses.contentClass;
  wrapper.appendChild(content);
  document.body.appendChild(wrapper);
  instance.wrapperComponent = wrapper;
  instance.contentComponent = content;
  instance.isInitialized = true;
  return { instance, wrapper, content };
};

const wheelOn = (
  target: Element,
  init: WheelEventInit = { deltaY: 10 },
): WheelEvent => {
  const event = new WheelEvent("wheel", { bubbles: true, ...init });
  target.dispatchEvent(event);
  return event;
};

afterEach(() => {
  document.body.innerHTML = "";
});

describe("isWheelPanningAllowed", () => {
  const enabled = {
    trackPadPanning: { disabled: false },
    wheel: { wheelDisabled: true },
  };

  it("is false before the components are mounted", () => {
    const instance = new ZoomPanPinch(enabled);
    const target = document.createElement("div");
    expect(isWheelPanningAllowed(instance, wheelOn(target))).toBe(false);
  });

  it("is false when the wrapper is disabled or trackpad panning is off", () => {
    const disabled = mountedInstance({ ...enabled, disabled: true });
    expect(
      isWheelPanningAllowed(disabled.instance, wheelOn(disabled.content)),
    ).toBe(false);

    const off = mountedInstance({ wheel: { wheelDisabled: true } });
    expect(isWheelPanningAllowed(off.instance, wheelOn(off.content))).toBe(
      false,
    );
  });

  it("is false for ctrl+wheel (trackpad pinch) and while wheel zoom claims the event", () => {
    const pinch = mountedInstance(enabled);
    expect(
      isWheelPanningAllowed(
        pinch.instance,
        wheelOn(pinch.content, { deltaY: 10, ctrlKey: true }),
      ),
    ).toBe(false);

    // Wheel zoom enabled → the vertical wheel is a zoom, not a pan.
    const zooming = mountedInstance({ trackPadPanning: { disabled: false } });
    expect(
      isWheelPanningAllowed(zooming.instance, wheelOn(zooming.content)),
    ).toBe(false);
    // ...but a purely horizontal swipe is never a zoom, so it can pan.
    expect(
      isWheelPanningAllowed(
        zooming.instance,
        wheelOn(zooming.content, { deltaX: 10, deltaY: 0 }),
      ),
    ).toBe(true);
  });

  it("respects excluded targets and activation keys", () => {
    const excluded = mountedInstance({
      ...enabled,
      trackPadPanning: { disabled: false, excluded: ["no-pan"] },
    });
    const blocked = document.createElement("div");
    blocked.className = "no-pan";
    excluded.content.appendChild(blocked);
    expect(isWheelPanningAllowed(excluded.instance, wheelOn(blocked))).toBe(
      false,
    );
    expect(
      isWheelPanningAllowed(excluded.instance, wheelOn(excluded.content)),
    ).toBe(true);

    const keyed = mountedInstance({
      ...enabled,
      trackPadPanning: { disabled: false, activationKeys: ["Shift"] },
    });
    expect(isWheelPanningAllowed(keyed.instance, wheelOn(keyed.content))).toBe(
      false,
    );
    keyed.instance.pressedKeys.Shift = true;
    expect(isWheelPanningAllowed(keyed.instance, wheelOn(keyed.content))).toBe(
      true,
    );
  });
});

describe("isPressingKeys", () => {
  it("supports a predicate over the currently pressed keys", () => {
    const { instance } = mountedInstance();
    instance.pressedKeys.Alt = true;
    instance.pressedKeys.Shift = false;

    const predicate = jest.fn((keys: string[]) => keys.includes("Alt"));
    expect(instance.isPressingKeys(predicate)).toBe(true);
    expect(predicate).toHaveBeenCalledWith(["Alt"]);
    expect(instance.isPressingKeys((keys) => keys.includes("Shift"))).toBe(
      false,
    );
  });

  it("treats an empty key list as always pressed", () => {
    const { instance } = mountedInstance();
    expect(instance.isPressingKeys([])).toBe(true);
    expect(instance.isPressingKeys(["Control"])).toBe(false);
  });
});

describe("getMousePosition", () => {
  it("falls back to the origin and reports when no offset can be read", () => {
    const errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    const content = {
      getBoundingClientRect: () => ({ left: 0, top: 0 }),
    } as HTMLDivElement;
    const event = { touches: [{}] } as unknown as TouchEvent;

    expect(getMousePosition(event, content, 1)).toEqual({ x: 0, y: 0 });
    expect(errorSpy).toHaveBeenCalledWith("No mouse or touch offset found");
    errorSpy.mockRestore();
  });
});

describe("handleCalculateWheelZoom", () => {
  it("returns the raw target when asked and clamps otherwise", () => {
    const { instance } = mountedInstance({
      minScale: 1,
      maxScale: 2,
      zoomAnimation: { size: 0.5 },
    });
    instance.state.scale = 1.9;

    expect(handleCalculateWheelZoom(instance, 1, 0.5, true, true)).toBeCloseTo(
      2.4,
      10,
    );
    // Padding disabled → hard clamp at maxScale.
    expect(handleCalculateWheelZoom(instance, 1, 0.5, true)).toBe(2);
    // Padding enabled → may overshoot by the animation size.
    expect(handleCalculateWheelZoom(instance, 1, 0.5, false)).toBeCloseTo(
      2.4,
      10,
    );
  });

  it("throws before the wrapper is mounted", () => {
    const instance = new ZoomPanPinch({});
    expect(() => handleCalculateWheelZoom(instance, 1, 0.1, true)).toThrow(
      "Wrapper is not mounted",
    );
  });
});

describe("handleWheelZoom", () => {
  it("does nothing when the scale would not change", () => {
    const { instance, content } = mountedInstance({ maxScale: 1 });
    const setState = jest.spyOn(instance, "setState");

    handleWheelZoom(instance, wheelOn(content, { deltaY: -100 }));

    expect(setState).not.toHaveBeenCalled();
  });

  it("throws when the content is missing", () => {
    const { instance, content } = mountedInstance();
    const event = wheelOn(content, { deltaY: -100 });
    instance.contentComponent = null;
    expect(() => handleWheelZoom(instance, event)).toThrow(
      "Component not mounted",
    );
  });
});

describe("getVelocityPosition", () => {
  // (newPosition, startPosition, currentPosition, isLocked, limitToBounds,
  //  minPosition, maxPosition, minTarget, maxTarget, step)
  it("clamps the eased overshoot to the targets beyond the max bound", () => {
    expect(
      getVelocityPosition(500, 10, 10, false, true, -100, 0, -120, 20, 1),
    ).toBe(20);
    expect(
      getVelocityPosition(-50, 10, 10, false, true, -100, 0, -120, 20, 1),
    ).toBe(0);
    expect(
      getVelocityPosition(10, 10, 10, false, true, -100, 0, -120, 20, 0.5),
    ).toBe(5);
  });

  it("clamps the eased overshoot to the targets beyond the min bound", () => {
    expect(
      getVelocityPosition(-500, -110, -110, false, true, -100, 0, -120, 20, 1),
    ).toBe(-120);
    expect(
      getVelocityPosition(50, -110, -110, false, true, -100, 0, -120, 20, 1),
    ).toBe(-100);
    expect(
      getVelocityPosition(
        -110,
        -110,
        -110,
        false,
        true,
        -100,
        0,
        -120,
        20,
        0.5,
      ),
    ).toBe(-105);
  });
});

describe("handlers.utils helpers", () => {
  it("getUnionRect spans every rect", () => {
    const rects = [
      { x: 10, y: 20, width: 30, height: 40 },
      { x: -5, y: 100, width: 10, height: 10 },
    ];
    expect(getUnionRect(rects as unknown as HTMLElement[])).toEqual({
      x: -5,
      y: 20,
      width: 45,
      height: 90,
    });
  });

  it("coordinate helpers return the origin before mount", () => {
    const instance = new ZoomPanPinch({});
    expect(clientToContentPoint(instance, 100, 100)).toEqual({ x: 0, y: 0 });
    expect(contentToClientPoint(instance, 100, 100)).toEqual({ x: 0, y: 0 });
  });
});

describe("small utils", () => {
  it("assignRef handles callback refs, object refs and nothing", () => {
    const callback = jest.fn();
    assignRef(callback, 1);
    expect(callback).toHaveBeenCalledWith(1);

    const objectRef = { current: null as number | null };
    assignRef(objectRef, 2);
    expect(objectRef.current).toBe(2);

    expect(() => assignRef(null, 3)).not.toThrow();
    expect(() => assignRef(undefined, 3)).not.toThrow();
  });

  it("mergeRefs forwards the value to every ref", () => {
    const callback = jest.fn();
    const objectRef = { current: null as string | null };
    const merged = mergeRefs<string>([callback, objectRef, null as never]);

    merged("node");

    expect(callback).toHaveBeenCalledWith("node");
    expect(objectRef.current).toBe("node");
  });

  it("handleCallback ignores non-function callbacks", () => {
    const context = {} as never;
    expect(() =>
      handleCallback(context, undefined, "nope" as unknown as () => void),
    ).not.toThrow();
    const callback = jest.fn();
    handleCallback(context, "event", callback);
    expect(callback).toHaveBeenCalledWith(context, "event");
  });

  it("createSetup guards against a non-positive minScale", () => {
    expect(createSetup({ minScale: 0 }).minScale).toBe(1e-7);
    expect(createSetup({ minScale: -3 }).minScale).toBe(1e-7);
    expect(createSetup({ minScale: 0.5 }).minScale).toBe(0.5);
  });
});
