import { ZoomPanPinch } from "../../src/core/instance.core";
import {
  getContext,
  getControls,
  getState,
} from "../../src/utils/context.utils";

describe("ZoomPanPinch instance (headless)", () => {
  describe("construction", () => {
    it("derives state and setup from props", () => {
      const instance = new ZoomPanPinch({ initialScale: 2, minScale: 0.5 });
      expect(instance.state.scale).toBe(2);
      expect(instance.setup.minScale).toBe(0.5);
      expect(instance.isInitialized).toBe(false);
      expect(instance.wrapperComponent).toBeNull();
    });
  });

  describe("setState", () => {
    it("updates the state, tracks previousScale and notifies subscribers", () => {
      const instance = new ZoomPanPinch({});
      // Transform subscribers and the DOM write need a content element.
      const content = document.createElement("div");
      instance.contentComponent = content;
      const onChange = jest.fn();
      const onTransform = jest.fn();
      instance.onChange(onChange);
      instance.onTransform(onTransform);

      instance.setState(2, 10, 20);

      expect(instance.state).toEqual({
        previousScale: 1,
        scale: 2,
        positionX: 10,
        positionY: 20,
      });
      expect(content.style.transform).toBe("translate(10px, 20px) scale(2)");
      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.calls[0][0].instance).toBe(instance);
      expect(onTransform).toHaveBeenCalledWith(
        expect.objectContaining({
          scale: 2,
          positionX: 10,
          positionY: 20,
          previousScale: 1,
        }),
      );
    });

    it("does not touch the DOM or transform subscribers before a content element exists", () => {
      const instance = new ZoomPanPinch({});
      const onTransform = jest.fn();
      instance.onTransform(onTransform);

      instance.setState(2, 10, 20);

      expect(instance.state.scale).toBe(2);
      expect(onTransform).not.toHaveBeenCalled();
    });

    it("keeps previousScale when only the position changes", () => {
      const instance = new ZoomPanPinch({});
      instance.setState(2, 0, 0);
      instance.setState(2, 5, 5);
      expect(instance.state.previousScale).toBe(1);
    });

    it("rejects NaN values without touching the state", () => {
      const errorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const instance = new ZoomPanPinch({});
      const onChange = jest.fn();
      instance.onChange(onChange);

      instance.setState(NaN, 0, 0);
      instance.setState(1, NaN, 0);

      expect(instance.state).toMatchObject({ scale: 1, positionX: 0 });
      expect(onChange).not.toHaveBeenCalled();
      expect(errorSpy).toHaveBeenCalledTimes(2);
      errorSpy.mockRestore();
    });

    it("never stores a zero or negative scale", () => {
      const instance = new ZoomPanPinch({});
      instance.setState(0, 0, 0);
      expect(instance.state.scale).toBe(1e-7);
      instance.setState(-2, 0, 0);
      expect(instance.state.scale).toBe(1e-7);
    });

    it("calls the onTransform prop with the new state", () => {
      const onTransformProp = jest.fn();
      const instance = new ZoomPanPinch({ onTransform: onTransformProp });
      instance.setState(1.5, 1, 2);
      expect(onTransformProp).toHaveBeenCalledWith(expect.anything(), {
        scale: 1.5,
        positionX: 1,
        positionY: 2,
      });
    });
  });

  describe("subscriptions", () => {
    it.each(["onChange", "onTransform", "onInit"] as const)(
      "%s returns an unsubscribe function and ignores duplicates",
      (method) => {
        const instance = new ZoomPanPinch({});
        const callback = jest.fn();
        const unsubscribe = instance[method](callback);
        instance[method](callback);

        const set = {
          onChange: instance.onChangeCallbacks,
          onTransform: instance.onTransformCallbacks,
          onInit: instance.onInitCallbacks,
        }[method];
        expect(set.size).toBe(1);

        unsubscribe();
        expect(set.size).toBe(0);
      },
    );
  });

  describe("key tracking", () => {
    it("tracks pressed keys and evaluates activation keys", () => {
      const instance = new ZoomPanPinch({});
      expect(instance.isPressingKeys([])).toBe(true);
      expect(instance.isPressingKeys(["Control"])).toBe(false);

      instance.setKeyPressed({ key: "Control" } as KeyboardEvent);
      expect(instance.isPressingKeys(["Control"])).toBe(true);
      expect(instance.isPressingKeys(["Control", "Shift"])).toBe(false);

      instance.setKeyUnPressed({ key: "Control" } as KeyboardEvent);
      expect(instance.isPressingKeys(["Control"])).toBe(false);
    });

    it("supports a predicate over the currently pressed keys", () => {
      const instance = new ZoomPanPinch({});
      instance.setKeyPressed({ key: "Alt" } as KeyboardEvent);
      instance.setKeyPressed({ key: "Meta" } as KeyboardEvent);
      instance.setKeyUnPressed({ key: "Meta" } as KeyboardEvent);

      const predicate = jest.fn((keys: string[]) => keys.includes("Alt"));
      expect(instance.isPressingKeys(predicate)).toBe(true);
      expect(predicate).toHaveBeenCalledWith(["Alt"]);
    });

    it("mirrors modifier flags from pointer events", () => {
      const instance = new ZoomPanPinch({});
      instance.syncModifierKeys({
        ctrlKey: true,
        metaKey: false,
        shiftKey: true,
        altKey: false,
      } as MouseEvent);
      expect(instance.pressedKeys).toEqual({
        Control: true,
        Meta: false,
        Shift: true,
        Alt: false,
      });
    });

    it("forgets every key on window blur", () => {
      const instance = new ZoomPanPinch({});
      instance.setKeyPressed({ key: "Shift" } as KeyboardEvent);
      instance.isPanning = true;
      instance.startCoords = { x: 1, y: 1 };

      instance.handleWindowBlur();

      expect(instance.pressedKeys).toEqual({});
      expect(instance.isPanning).toBe(false);
      expect(instance.startCoords).toBeNull();
    });
  });

  describe("transform styles", () => {
    it("uses the default translate/scale string", () => {
      const instance = new ZoomPanPinch({});
      expect(instance.handleTransformStyles(1, 2, 3)).toBe(
        "translate(1px, 2px) scale(3)",
      );
    });

    it("delegates to customTransform when provided", () => {
      const instance = new ZoomPanPinch({
        customTransform: (x, y, s) => `custom(${x},${y},${s})`,
      });
      expect(instance.handleTransformStyles(1, 2, 3)).toBe("custom(1,2,3)");
    });
  });

  describe("lifecycle without DOM", () => {
    it("mount/unmount toggle the mounted flag and never throw without a wrapper", () => {
      const instance = new ZoomPanPinch({});
      expect(() => instance.mount()).not.toThrow();
      expect(instance.mounted).toBe(true);
      expect(() => instance.unmount()).not.toThrow();
      expect(instance.mounted).toBe(false);
      expect(() => instance.applyTransformation()).not.toThrow();
    });

    it("update replaces the setup without needing mounted components", () => {
      const instance = new ZoomPanPinch({ minScale: 1 });
      instance.update({ minScale: 0.25, wheel: { step: 1 } });
      expect(instance.setup.minScale).toBe(0.25);
      expect(instance.setup.wheel.step).toBe(1);
      expect(instance.bounds).toBeNull();
    });

    it("clearTimers drops every pending timer handle", () => {
      jest.useFakeTimers();
      const instance = new ZoomPanPinch({});
      const spy = jest.fn();
      instance.wheelStopEventTimer = setTimeout(spy, 10);
      instance.wheelAnimationTimer = setTimeout(spy, 10);
      instance.doubleClickStopEventTimer = setTimeout(spy, 10);
      instance.initObserverTimer = setTimeout(spy, 10);

      instance.clearTimers();
      jest.advanceTimersByTime(100);

      expect(spy).not.toHaveBeenCalled();
      expect(instance.wheelStopEventTimer).toBeNull();
      expect(instance.wheelAnimationTimer).toBeNull();
      expect(instance.doubleClickStopEventTimer).toBeNull();
      expect(instance.initObserverTimer).toBeNull();
      jest.useRealTimers();
    });
  });

  describe("context helpers", () => {
    it("getState exposes the live state object", () => {
      const instance = new ZoomPanPinch({});
      const state = getState(instance);
      expect(state.instance).toBe(instance);
      expect(state.state).toBe(instance.state);
    });

    it("getControls exposes every public handler", () => {
      const controls = getControls(new ZoomPanPinch({}));
      expect(Object.keys(controls).sort()).toEqual(
        [
          "centerView",
          "instance",
          "resetTransform",
          "setTransform",
          "state",
          "zoomIn",
          "zoomOut",
          "zoomToElement",
        ].sort(),
      );
    });

    it("getContext merges state and controls", () => {
      const instance = new ZoomPanPinch({});
      const ctx = getContext(instance);
      expect(ctx.instance).toBe(instance);
      expect(ctx.state).toBe(instance.state);
      expect(typeof ctx.setTransform).toBe("function");
    });

    it("handlers are no-ops before the components are mounted", () => {
      const errorSpy = jest
        .spyOn(console, "error")
        .mockImplementation(() => {});
      const instance = new ZoomPanPinch({});
      const controls = getControls(instance);

      expect(() => controls.setTransform(1, 1, 2, 0)).not.toThrow();
      expect(() => controls.centerView(2, 0)).not.toThrow();
      expect(() => controls.resetTransform(0)).not.toThrow();
      expect(() => controls.zoomToElement("missing", 2, 0)).not.toThrow();
      expect(() => controls.zoomIn(0.5, 0)).not.toThrow();
      expect(instance.state.scale).toBe(1);
      errorSpy.mockRestore();
    });
  });
});
