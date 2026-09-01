import { animations } from "../../src/core/animations/animations.constants";

const names = Object.keys(animations) as Array<keyof typeof animations>;

describe("animations.constants", () => {
  it("exposes every documented easing", () => {
    expect(names).toEqual([
      "easeOut",
      "linear",
      "easeInQuad",
      "easeOutQuad",
      "easeInOutQuad",
      "easeInCubic",
      "easeOutCubic",
      "easeInOutCubic",
      "easeInQuart",
      "easeOutQuart",
      "easeInOutQuart",
      "easeInQuint",
      "easeOutQuint",
      "easeInOutQuint",
    ]);
  });

  describe.each(names)("%s", (name) => {
    const easing = animations[name];

    it("starts at 0 and ends at 1", () => {
      expect(easing(0)).toBeCloseTo(0, 10);
      expect(easing(1)).toBeCloseTo(1, 10);
    });

    it("never decreases over the animation", () => {
      let previous = easing(0);
      for (let t = 0.01; t <= 1; t += 0.01) {
        const value = easing(Number(t.toFixed(2)));
        expect(value).toBeGreaterThanOrEqual(previous - 1e-12);
        previous = value;
      }
    });

    it("stays within [0, 1]", () => {
      for (let t = 0; t <= 1; t += 0.05) {
        const value = easing(Number(t.toFixed(2)));
        expect(value).toBeGreaterThanOrEqual(-1e-12);
        expect(value).toBeLessThanOrEqual(1 + 1e-12);
      }
    });
  });

  it("linear is the identity", () => {
    expect(animations.linear(0.25)).toBe(0.25);
    expect(animations.linear(0.8)).toBe(0.8);
  });

  it("easeIn curves are below the diagonal and easeOut curves above it at the midpoint", () => {
    expect(animations.easeInQuad(0.5)).toBeLessThan(0.5);
    expect(animations.easeInCubic(0.5)).toBeLessThan(0.5);
    expect(animations.easeOutQuad(0.5)).toBeGreaterThan(0.5);
    expect(animations.easeOutCubic(0.5)).toBeGreaterThan(0.5);
  });

  it("easeInOut curves are symmetric around the midpoint", () => {
    expect(animations.easeInOutQuad(0.5)).toBeCloseTo(0.5, 10);
    expect(
      animations.easeInOutCubic(0.25) + animations.easeInOutCubic(0.75),
    ).toBeCloseTo(1, 10);
    expect(animations.easeInOutQuint(0.5)).toBeCloseTo(0.5, 10);
  });
});
