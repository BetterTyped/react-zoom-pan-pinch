import { checkIsNumber, roundNumber } from "../../src/utils/calculations.utils";
import {
  getCenterPosition,
  getMatrixTransformStyles,
  getTransformStyles,
  roundScaleForTransform,
} from "../../src/utils/styles.utils";
import { assignRef, mergeRefs } from "../../src/utils/ref.utils";
import { makePassiveEventOption } from "../../src/utils/event.utils";
import { handleCallback } from "../../src/utils/callback.utils";

describe("calculations.utils", () => {
  describe("roundNumber", () => {
    it("rounds to the requested number of decimals", () => {
      expect(roundNumber(2.34343, 1)).toBe(2.3);
      expect(roundNumber(2.34567, 2)).toBe(2.35);
      expect(roundNumber(2, 3)).toBe(2);
    });

    it("returns a number, not a string", () => {
      expect(typeof roundNumber(1.23456, 2)).toBe("number");
    });

    it("handles negative values", () => {
      expect(roundNumber(-1.005, 2)).toBe(-1);
      expect(roundNumber(-2.678, 1)).toBe(-2.7);
    });
  });

  describe("checkIsNumber", () => {
    it("returns the value when it is a number (including 0 and NaN)", () => {
      expect(checkIsNumber(2, 30)).toBe(2);
      expect(checkIsNumber(0, 30)).toBe(0);
      expect(checkIsNumber(NaN, 30)).toBeNaN();
    });

    it("returns the default for anything that is not a number", () => {
      expect(checkIsNumber(null, 30)).toBe(30);
      expect(checkIsNumber(undefined, 30)).toBe(30);
      expect(checkIsNumber("2", 30)).toBe(30);
    });
  });
});

describe("styles.utils", () => {
  describe("roundScaleForTransform", () => {
    it("drops binary float noise", () => {
      expect(roundScaleForTransform(1.5000000000000002)).toBe(1.5);
      expect(roundScaleForTransform(0.30000000000000004)).toBe(0.3);
    });

    it("keeps real precision up to 8 decimals", () => {
      expect(roundScaleForTransform(1.12345678)).toBe(1.12345678);
      expect(roundScaleForTransform(1.123456789)).toBe(1.12345679);
    });
  });

  describe("getTransformStyles", () => {
    it("builds a translate + scale string", () => {
      expect(getTransformStyles(10, -20, 2)).toBe(
        "translate(10px, -20px) scale(2)",
      );
    });

    it("uses the rounded scale", () => {
      expect(getTransformStyles(0, 0, 1.5000000000000002)).toBe(
        "translate(0px, 0px) scale(1.5)",
      );
    });
  });

  describe("getMatrixTransformStyles", () => {
    it("builds a matrix3d string with scale on the diagonal and translation last", () => {
      expect(getMatrixTransformStyles(10, 20, 2)).toBe(
        "matrix3d(2, 0, 0, 0, 0, 2, 0, 0, 0, 0, 1, 0, 10, 20, 0, 1)",
      );
    });
  });

  describe("getCenterPosition", () => {
    const element = (width: number, height: number) =>
      ({ offsetWidth: width, offsetHeight: height }) as HTMLDivElement;

    it("centers content smaller than the wrapper with a positive offset", () => {
      expect(
        getCenterPosition(1, element(500, 500), element(200, 100)),
      ).toEqual({ scale: 1, positionX: 150, positionY: 200 });
    });

    it("centers content larger than the wrapper with a negative offset", () => {
      expect(
        getCenterPosition(1, element(500, 500), element(2000, 2000)),
      ).toEqual({ scale: 1, positionX: -750, positionY: -750 });
    });

    it("accounts for the scale", () => {
      expect(
        getCenterPosition(2, element(500, 500), element(200, 100)),
      ).toEqual({ scale: 2, positionX: 50, positionY: 150 });
    });
  });
});

describe("ref.utils", () => {
  describe("assignRef", () => {
    it("calls function refs", () => {
      const ref = jest.fn();
      assignRef(ref, "value");
      expect(ref).toHaveBeenCalledWith("value");
    });

    it("sets object refs", () => {
      const ref = { current: null as string | null };
      assignRef(ref, "value");
      expect(ref.current).toBe("value");
    });

    it("ignores null and undefined refs", () => {
      expect(() => assignRef(null, "value")).not.toThrow();
      expect(() => assignRef(undefined, "value")).not.toThrow();
    });
  });

  describe("mergeRefs", () => {
    it("forwards the value to every ref and skips empty ones", () => {
      const fnRef = jest.fn();
      const objRef = { current: null as string | null };
      const merged = mergeRefs<string>([fnRef, objRef, null as never]);

      merged("value");

      expect(fnRef).toHaveBeenCalledWith("value");
      expect(objRef.current).toBe("value");
    });
  });
});

describe("event.utils", () => {
  it("makePassiveEventOption returns non-passive listener options", () => {
    const options = makePassiveEventOption();
    expect(options.passive).toBe(false);
  });
});

describe("callback.utils", () => {
  it("handleCallback invokes the callback with the context and event", () => {
    const callback = jest.fn();
    const context = { state: {} } as never;
    handleCallback(context, "event", callback);
    expect(callback).toHaveBeenCalledWith(context, "event");
  });

  it("handleCallback ignores missing or non-function callbacks", () => {
    expect(() => handleCallback({} as never, "event", undefined)).not.toThrow();
    expect(() =>
      handleCallback({} as never, "event", "nope" as never),
    ).not.toThrow();
  });
});
