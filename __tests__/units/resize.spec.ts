import { ZoomPanPinch } from "../../src/core/instance.core";
import {
  calculateResizeAlignment,
  handleResizeAlignment,
  handleSizeChange,
  hasSizeChanged,
  measureSizes,
} from "../../src/core/resize/resize.logic";
import { ReactZoomPanPinchProps } from "../../src";

const sizedDiv = (width: number, height: number): HTMLDivElement => {
  const element = document.createElement("div");
  element.style.width = `${width}px`;
  element.style.height = `${height}px`;
  return element;
};

// A mounted-looking instance without React: wrapper 500 x 500, content
// 1000 x 500 => x bounds [-500, 0], y bounds [0, 0].
const createInstance = (props: ReactZoomPanPinchProps = {}) => {
  const instance = new ZoomPanPinch({
    limitToBounds: true,
    disablePadding: true,
    autoAlignment: { animationTime: 0 },
    ...props,
  });
  const wrapper = sizedDiv(500, 500);
  const content = sizedDiv(1000, 500);
  instance.wrapperComponent = wrapper;
  instance.contentComponent = content;
  instance.measuredSizes = measureSizes(wrapper, content);
  return { instance, wrapper, content };
};

describe("resize helpers", () => {
  describe("measureSizes / hasSizeChanged", () => {
    it("reads the offset sizes of both elements", () => {
      expect(measureSizes(sizedDiv(500, 400), sizedDiv(1000, 800))).toEqual({
        wrapperWidth: 500,
        wrapperHeight: 400,
        contentWidth: 1000,
        contentHeight: 800,
      });
    });

    it("reports a change for any differing dimension and for a missing snapshot", () => {
      const sizes = measureSizes(sizedDiv(500, 400), sizedDiv(1000, 800));
      expect(hasSizeChanged(null, sizes)).toBe(true);
      expect(hasSizeChanged(sizes, { ...sizes })).toBe(false);
      expect(hasSizeChanged(sizes, { ...sizes, wrapperWidth: 501 })).toBe(true);
      expect(hasSizeChanged(sizes, { ...sizes, wrapperHeight: 1 })).toBe(true);
      expect(hasSizeChanged(sizes, { ...sizes, contentWidth: 1 })).toBe(true);
      expect(hasSizeChanged(sizes, { ...sizes, contentHeight: 1 })).toBe(true);
    });
  });

  describe("calculateResizeAlignment", () => {
    it("returns null and stores the bounds when the transform is inside them", () => {
      const { instance } = createInstance();
      instance.setState(1, -300, 0);

      expect(calculateResizeAlignment(instance)).toBeNull();
      expect(instance.bounds).toMatchObject({
        minPositionX: -500,
        maxPositionX: 0,
      });
    });

    it("returns the clamped position when the content shrank under the transform", () => {
      const { instance, content } = createInstance();
      instance.setState(1, -500, 0);
      content.style.width = "700px";

      expect(calculateResizeAlignment(instance)).toEqual({
        scale: 1,
        positionX: -200,
        positionY: 0,
      });
      expect(instance.bounds!.minPositionX).toBe(-200);
    });

    it("keeps the current scale and clamps both axes", () => {
      const { instance, content } = createInstance();
      instance.setState(2, -1500, -500);
      // 1000 x 500 => at scale 2 => 2000 x 1000 => bounds x [-1500, 0], y [-500, 0]
      expect(calculateResizeAlignment(instance)).toBeNull();

      content.style.width = "800px";
      content.style.height = "400px";
      // 1600 x 800 => bounds x [-1100, 0], y [-300, 0]
      expect(calculateResizeAlignment(instance)).toEqual({
        scale: 2,
        positionX: -1100,
        positionY: -300,
      });
    });

    it("returns null when neither limitToBounds nor centerZoomedOut applies", () => {
      const { instance, content } = createInstance({ limitToBounds: false });
      instance.setState(1, -500, 0);
      content.style.width = "700px";

      expect(calculateResizeAlignment(instance)).toBeNull();
      // Bounds are still refreshed for the next gesture.
      expect(instance.bounds!.minPositionX).toBe(-200);
    });

    it("centres content smaller than the wrapper with centerZoomedOut", () => {
      const { instance, content } = createInstance({
        limitToBounds: false,
        centerZoomedOut: true,
      });
      instance.setState(1, -500, 0);
      content.style.width = "300px";

      expect(calculateResizeAlignment(instance)).toEqual({
        scale: 1,
        positionX: 100,
        positionY: 0,
      });
    });

    it("ignores sub-cent differences introduced by rounding", () => {
      const { instance } = createInstance();
      instance.setState(1, -0.004, 0);

      expect(calculateResizeAlignment(instance)).toBeNull();
    });

    it("returns null before the elements are mounted", () => {
      const instance = new ZoomPanPinch({});
      expect(calculateResizeAlignment(instance)).toBeNull();
    });
  });

  describe("handleResizeAlignment", () => {
    it("moves the transform into the bounds", () => {
      const { instance, content } = createInstance();
      instance.setState(1, -500, 0);
      content.style.width = "700px";

      handleResizeAlignment(instance);

      expect(instance.state.positionX).toBe(-200);
    });

    it("leaves a transform alone when the wrapper is disabled", () => {
      const { instance, content } = createInstance({ disabled: true });
      instance.setState(1, -500, 0);
      content.style.width = "700px";

      handleResizeAlignment(instance);

      expect(instance.state.positionX).toBe(-500);
      expect(instance.bounds!.minPositionX).toBe(-200);
    });

    /* eslint-disable no-param-reassign */
    const pointerGestures: Array<[string, (instance: ZoomPanPinch) => void]> = [
      [
        "isPanning",
        (instance) => {
          instance.isPanning = true;
        },
      ],
      [
        "isPinching",
        (instance) => {
          instance.isPinching = true;
        },
      ],
    ];
    const wheelSequences: Array<[string, (instance: ZoomPanPinch) => void]> = [
      [
        "wheelStopEventTimer",
        (instance) => {
          instance.wheelStopEventTimer = setTimeout(() => {}, 1000);
        },
      ],
      [
        "wheelAnimationTimer",
        (instance) => {
          instance.wheelAnimationTimer = setTimeout(() => {}, 1000);
        },
      ],
    ];
    /* eslint-enable no-param-reassign */

    it.each(pointerGestures)(
      "leaves the bounds to a held pointer and postpones (%s)",
      (_, arm) => {
        const { instance, content } = createInstance();
        instance.setState(1, -500, 0);
        content.style.width = "700px";
        arm(instance);

        handleResizeAlignment(instance);

        // Neither moved nor re-bounded: the next move must not jump.
        expect(instance.state.positionX).toBe(-500);
        expect(instance.bounds).toBeNull();
        expect(instance.isResizeAlignmentPending).toBe(true);
      },
    );

    it.each(wheelSequences)(
      "aligns immediately during a wheel sequence (%s)",
      (_, arm) => {
        const { instance, content } = createInstance();
        instance.setState(1, -500, 0);
        content.style.width = "700px";
        arm(instance);

        handleResizeAlignment(instance);

        expect(instance.state.positionX).toBe(-200);
        expect(instance.bounds!.minPositionX).toBe(-200);
        expect(instance.isResizeAlignmentPending).toBe(false);
        instance.clearTimers();
      },
    );

    it("cancels a move in flight so the resize takes effect immediately", () => {
      const { instance, content } = createInstance();
      instance.setState(1, -500, 0);
      content.style.width = "700px";
      const inFlight = () => {};
      instance.animation = inFlight;
      const resolve = jest.fn();
      instance.animationResolve = resolve;

      handleResizeAlignment(instance);

      expect(instance.animation).not.toBe(inFlight);
      expect(resolve).toHaveBeenCalledTimes(1);
      expect(instance.state.positionX).toBe(-200);
      expect(instance.isResizeAlignmentPending).toBe(false);
    });

    it("lets an animation that restores the scale range finish first", () => {
      const { instance, content } = createInstance({ minScale: 1 });
      // Elastic wheel zoom-out below minScale, on its way back to 1.
      instance.setState(0.8, -500, 0);
      content.style.width = "700px";
      const inFlight = () => {};
      instance.animation = inFlight;

      handleResizeAlignment(instance);

      expect(instance.animation).toBe(inFlight);
      expect(instance.state.positionX).toBe(-500);
      expect(instance.isResizeAlignmentPending).toBe(true);

      instance.animation = null;
      instance.setState(1, -500, 0);
      instance.flushResizeAlignment();
      expect(instance.state.positionX).toBe(-200);
    });

    it("stays pending when flushed while another gesture is still running", () => {
      const { instance, content } = createInstance();
      instance.setState(1, -500, 0);
      content.style.width = "700px";
      instance.isResizeAlignmentPending = true;
      instance.isPanning = true;

      instance.flushResizeAlignment();

      expect(instance.state.positionX).toBe(-500);
      expect(instance.isResizeAlignmentPending).toBe(true);
    });

    it("keeps update() from replacing the bounds during a gesture", () => {
      const { instance } = createInstance();
      instance.isPanning = true;

      instance.update({ limitToBounds: true });
      expect(instance.bounds).toBeNull();

      instance.isPanning = false;
      instance.update({ limitToBounds: true });
      expect(instance.bounds).toMatchObject({ minPositionX: -500 });
    });

    it("flushResizeAlignment is a no-op when nothing is pending", () => {
      const { instance } = createInstance();
      const setState = jest.spyOn(instance, "setState");

      instance.flushResizeAlignment();

      expect(setState).not.toHaveBeenCalled();
    });
  });

  describe("handleSizeChange", () => {
    it("ignores notifications without a size change", () => {
      const { instance } = createInstance();
      instance.setState(1, -600, 0);

      handleSizeChange(instance);

      expect(instance.state.positionX).toBe(-600);
    });

    it("records the new sizes and aligns when they changed", () => {
      const { instance, content } = createInstance();
      instance.setState(1, -500, 0);
      content.style.width = "700px";

      handleSizeChange(instance);

      expect(instance.measuredSizes).toMatchObject({ contentWidth: 700 });
      expect(instance.state.positionX).toBe(-200);
    });
  });
});
