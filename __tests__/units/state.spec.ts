import { createSetup, createState } from "../../src/utils/state.utils";
import { initialSetup } from "../../src/constants/state.constants";

describe("state.utils", () => {
  describe("createState", () => {
    it("uses the library defaults when no props are given", () => {
      expect(createState({})).toEqual({
        previousScale: 1,
        scale: 1,
        positionX: 0,
        positionY: 0,
      });
    });

    it("applies initialScale and initial positions", () => {
      expect(
        createState({
          initialScale: 2,
          initialPositionX: -10,
          initialPositionY: 30,
        }),
      ).toEqual({ previousScale: 2, scale: 2, positionX: -10, positionY: 30 });
    });

    it("clamps initialScale into [minScale, maxScale]", () => {
      expect(createState({ initialScale: 0.1, minScale: 0.5 }).scale).toBe(0.5);
      expect(createState({ initialScale: 20, maxScale: 8 }).scale).toBe(8);
    });

    it("never produces a zero or negative scale", () => {
      expect(createState({ initialScale: 0, minScale: 0 }).scale).toBe(1e-7);
      expect(createState({ initialScale: -3, minScale: -3 }).scale).toBe(1e-7);
    });

    it("clamps initial positions only when explicit bounds are given", () => {
      expect(
        createState({ initialPositionX: 500, maxPositionX: 100 }).positionX,
      ).toBe(100);
      expect(
        createState({ initialPositionY: -500, minPositionY: -100 }).positionY,
      ).toBe(-100);
      expect(createState({ initialPositionX: 500 }).positionX).toBe(500);
    });
  });

  describe("createSetup", () => {
    it("returns the defaults for empty props", () => {
      expect(createSetup({})).toEqual(initialSetup);
    });

    it("overrides primitives", () => {
      const setup = createSetup({ minScale: 0.5, maxScale: 4, disabled: true });
      expect(setup.minScale).toBe(0.5);
      expect(setup.maxScale).toBe(4);
      expect(setup.disabled).toBe(true);
    });

    it("deep-merges nested option objects with their defaults", () => {
      const setup = createSetup({ wheel: { step: 0.5 } });
      expect(setup.wheel).toEqual({ ...initialSetup.wheel, step: 0.5 });
    });

    it("does not mutate the shared defaults", () => {
      createSetup({ wheel: { step: 0.5 }, minScale: 0.1 });
      expect(initialSetup.wheel.step).toBe(0.015);
      expect(initialSetup.minScale).toBe(1);
    });

    it("ignores undefined values and unknown keys", () => {
      const setup = createSetup({
        minScale: undefined,
        onZoom: () => {},
        children: null,
      } as never);
      expect(setup.minScale).toBe(initialSetup.minScale);
      expect("onZoom" in setup).toBe(false);
    });

    it("keeps null position bounds as null", () => {
      const setup = createSetup({ minPositionX: null });
      expect(setup.minPositionX).toBeNull();
    });

    it("keeps explicit position bounds", () => {
      const setup = createSetup({ minPositionX: -100, maxPositionY: 50 });
      expect(setup.minPositionX).toBe(-100);
      expect(setup.maxPositionY).toBe(50);
    });

    it("lifts a non-positive minScale to a tiny positive value", () => {
      expect(createSetup({ minScale: 0 }).minScale).toBe(1e-7);
      expect(createSetup({ minScale: -1 }).minScale).toBe(1e-7);
    });
  });
});
