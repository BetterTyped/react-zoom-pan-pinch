import {
  getVelocityMoveTime,
  getVelocityPosition,
} from "../../src/core/pan/velocity.utils";
import {
  getDelta,
  getDeltaY,
  getMousePosition,
  handleWheelZoomStop,
} from "../../src/core/wheel/wheel.utils";
import { isTrackPad } from "../../src/utils/event.utils";
import { DeviceType } from "../../src/models";
import { initialSetup } from "../../src/constants/state.constants";

describe("velocity.utils", () => {
  describe("getVelocityMoveTime", () => {
    const context = (
      overrides: Partial<typeof initialSetup.velocityAnimation>,
    ) =>
      ({
        setup: {
          velocityAnimation: {
            ...initialSetup.velocityAnimation,
            ...overrides,
          },
        },
      }) as never;

    it("uses the base animation time for slow releases", () => {
      expect(getVelocityMoveTime(context({}), 0.5)).toBe(300);
    });

    it("scales the time with the velocity", () => {
      expect(getVelocityMoveTime(context({}), 2)).toBe(600);
    });

    it("caps the time at maxAnimationTime", () => {
      expect(getVelocityMoveTime(context({}), 50)).toBe(800);
      expect(getVelocityMoveTime(context({ maxAnimationTime: 400 }), 2)).toBe(
        400,
      );
    });

    it("takes inertia into account", () => {
      expect(getVelocityMoveTime(context({ inertia: 2 }), 2)).toBe(300);
    });
  });

  describe("getVelocityPosition", () => {
    // (newPosition, startPosition, currentPosition, isLocked, limitToBounds,
    //  minPosition, maxPosition, minTarget, maxTarget, step)

    it("clamps to the bounds when limited", () => {
      expect(
        getVelocityPosition(50, 0, 0, false, true, -100, 0, -120, 20, 1),
      ).toBe(0);
      expect(
        getVelocityPosition(-150, 0, 0, false, true, -100, 0, -120, 20, 1),
      ).toBe(-100);
    });

    it("passes the value through when unlimited", () => {
      expect(
        getVelocityPosition(150, 0, 0, false, false, -100, 0, -120, 20, 1),
      ).toBe(150);
    });

    it("keeps a locked axis at its start position", () => {
      expect(
        getVelocityPosition(50, -7, -7, true, true, -100, 0, -120, 20, 1),
      ).toBe(-7);
      expect(
        getVelocityPosition(50, -7, -7, true, false, -100, 0, -120, 20, 1),
      ).toBe(-7);
    });

    it("eases back toward the max bound when released beyond it", () => {
      // Started and still above maxPosition (0): interpolate toward the bound.
      expect(
        getVelocityPosition(15, 10, 12, false, true, -100, 0, -120, 20, 1),
      ).toBe(15);
      expect(
        getVelocityPosition(15, 10, 12, false, true, -100, 0, -120, 20, 0),
      ).toBe(0);
      // Cannot overshoot the padded target...
      expect(
        getVelocityPosition(40, 10, 12, false, true, -100, 0, -120, 20, 1),
      ).toBe(20);
      // ...nor go back past the bound itself.
      expect(
        getVelocityPosition(-5, 10, 12, false, true, -100, 0, -120, 20, 1),
      ).toBe(0);
    });

    it("eases back toward the min bound when released beyond it", () => {
      expect(
        getVelocityPosition(
          -110,
          -105,
          -108,
          false,
          true,
          -100,
          0,
          -120,
          20,
          1,
        ),
      ).toBe(-110);
      expect(
        getVelocityPosition(
          -110,
          -105,
          -108,
          false,
          true,
          -100,
          0,
          -120,
          20,
          0,
        ),
      ).toBe(-100);
      expect(
        getVelocityPosition(
          -200,
          -105,
          -108,
          false,
          true,
          -100,
          0,
          -120,
          20,
          1,
        ),
      ).toBe(-120);
      expect(
        getVelocityPosition(-50, -105, -108, false, true, -100, 0, -120, 20, 1),
      ).toBe(-100);
    });
  });
});

describe("wheel.utils", () => {
  describe("getDeltaY / getDelta", () => {
    it("maps wheel direction to a unit delta", () => {
      expect(getDeltaY({ deltaY: -100 } as WheelEvent)).toBe(1);
      expect(getDeltaY({ deltaY: 3 } as WheelEvent)).toBe(-1);
      expect(getDeltaY(undefined)).toBe(0);
    });

    it("prefers a numeric custom delta", () => {
      expect(getDelta({ deltaY: -100 } as WheelEvent, 0.5)).toBe(0.5);
      expect(getDelta({ deltaY: -100 } as WheelEvent, null)).toBe(1);
      expect(getDelta({ deltaY: 100 } as WheelEvent)).toBe(-1);
    });
  });

  describe("getMousePosition", () => {
    const content = {
      getBoundingClientRect: () => ({ left: 100, top: 50 }),
    } as HTMLDivElement;

    it("converts mouse coordinates to unscaled content space", () => {
      expect(
        getMousePosition(
          { clientX: 300, clientY: 250 } as MouseEvent,
          content,
          2,
        ),
      ).toEqual({ x: 100, y: 100 });
    });

    it("uses the first touch for touch events", () => {
      const event = {
        touches: [{ clientX: 200, clientY: 150 }],
      } as unknown as TouchEvent;
      expect(getMousePosition(event, content, 1)).toEqual({ x: 100, y: 100 });
    });
  });

  describe("isTrackPad", () => {
    const event = (init: Record<string, number>) =>
      init as unknown as WheelEvent & { wheelDeltaY: number };

    it("treats a classic 120-step wheelDeltaY as a mouse", () => {
      expect(isTrackPad(event({ wheelDeltaY: 120 }))).toBe(DeviceType.MOUSE);
      expect(isTrackPad(event({ wheelDeltaY: -120 }))).toBe(DeviceType.MOUSE);
    });

    it("treats any other wheelDeltaY as a trackpad", () => {
      expect(isTrackPad(event({ wheelDeltaY: 30 }))).toBe(DeviceType.TRACK_PAD);
    });

    it("falls back to deltaMode when wheelDeltaY is missing", () => {
      expect(isTrackPad(event({ deltaMode: 0 }))).toBe(DeviceType.TRACK_PAD);
      expect(isTrackPad(event({ deltaMode: 1 }))).toBe(DeviceType.MOUSE);
    });
  });

  describe("handleWheelZoomStop", () => {
    const context = (
      scale: number,
      previousDeltaY: number | null,
      minScale = 1,
      maxScale = 8,
    ) =>
      ({
        previousWheelEvent:
          previousDeltaY === null ? null : { deltaY: previousDeltaY },
        state: { scale },
        setup: { minScale, maxScale },
      }) as never;
    const wheel = (deltaY: number) => ({ deltaY }) as WheelEvent;

    it("is false before any wheel event was recorded", () => {
      expect(handleWheelZoomStop(context(2, null), wheel(-1))).toBe(false);
    });

    it("is true while the scale is strictly inside the limits", () => {
      expect(handleWheelZoomStop(context(2, -1), wheel(-1))).toBe(true);
    });

    it("at a hard limit, is true only when the direction flips or the delta grows", () => {
      // minScale === maxScale === scale: neither `scale < max` nor `scale > min`.
      expect(handleWheelZoomStop(context(1, -1, 1, 1), wheel(1))).toBe(true);
      expect(handleWheelZoomStop(context(1, 1, 1, 1), wheel(2))).toBe(true);
      expect(handleWheelZoomStop(context(1, -1, 1, 1), wheel(-2))).toBe(true);
      expect(handleWheelZoomStop(context(1, 2, 1, 1), wheel(1))).toBe(false);
      expect(handleWheelZoomStop(context(1, -2, 1, 1), wheel(-1))).toBe(false);
    });
  });
});
