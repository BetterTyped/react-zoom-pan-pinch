import {
  cancelTimeout,
  isDraggableTarget,
  isEditableTarget,
  isExcludedNode,
} from "../../src/utils/helpers.utils";
import { baseClasses } from "../../src/constants/state.constants";

const build = (html: string) => {
  const wrapper = document.createElement("div");
  wrapper.className = baseClasses.wrapperClass;
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper);
  return wrapper;
};

afterEach(() => {
  document.body.innerHTML = "";
});

describe("helpers.utils", () => {
  describe("isExcludedNode", () => {
    it("matches an element by class name", () => {
      const wrapper = build('<div class="no-pan" id="target"></div>');
      const target = wrapper.querySelector("#target") as HTMLElement;
      expect(isExcludedNode(target, ["no-pan"])).toBe(true);
    });

    it("matches an element by tag name", () => {
      const wrapper = build('<button id="target">x</button>');
      const target = wrapper.querySelector("#target") as HTMLElement;
      expect(isExcludedNode(target, ["button"])).toBe(true);
    });

    it("matches descendants of an excluded element", () => {
      const wrapper = build(
        '<div class="no-pan"><span id="target"></span></div>',
      );
      const target = wrapper.querySelector("#target") as HTMLElement;
      expect(isExcludedNode(target, ["no-pan"])).toBe(true);
    });

    it("does not match elements outside of the excluded subtree", () => {
      const wrapper = build(
        '<div class="no-pan"></div><span id="target"></span>',
      );
      const target = wrapper.querySelector("#target") as HTMLElement;
      expect(isExcludedNode(target, ["no-pan"])).toBe(false);
    });

    it("only matches inside the library wrapper", () => {
      const outside = document.createElement("div");
      outside.className = "no-pan";
      document.body.appendChild(outside);
      expect(isExcludedNode(outside, ["no-pan"])).toBe(false);
    });

    it("returns false for an empty exclusion list", () => {
      const wrapper = build('<div class="no-pan" id="target"></div>');
      const target = wrapper.querySelector("#target") as HTMLElement;
      expect(isExcludedNode(target, [])).toBe(false);
    });
  });

  describe("isEditableTarget", () => {
    it.each(["input", "textarea", "select"])(
      "is true for a %s element",
      (tag) => {
        const wrapper = build(`<${tag} id="target"></${tag}>`);
        expect(isEditableTarget(wrapper.querySelector("#target"))).toBe(true);
      },
    );

    it("is true for an option inside a select", () => {
      const wrapper = build('<select><option id="target">a</option></select>');
      expect(isEditableTarget(wrapper.querySelector("#target"))).toBe(true);
    });

    it.each(['""', '"true"', '"plaintext-only"'])(
      "is true for descendants of contenteditable=%s",
      (value) => {
        const wrapper = build(
          `<div contenteditable=${value}><b><i id="target">x</i></b></div>`,
        );
        expect(isEditableTarget(wrapper.querySelector("#target"))).toBe(true);
      },
    );

    it("is false for descendants of contenteditable=false", () => {
      const wrapper = build(
        '<div contenteditable="false"><i id="target">x</i></div>',
      );
      expect(isEditableTarget(wrapper.querySelector("#target"))).toBe(false);
    });

    it("honours the isContentEditable property when the browser provides it", () => {
      const wrapper = build('<div id="target"></div>');
      const target = wrapper.querySelector("#target") as HTMLElement;
      Object.defineProperty(target, "isContentEditable", { value: true });
      expect(isEditableTarget(target)).toBe(true);
    });

    it("is false for plain elements", () => {
      const wrapper = build('<div id="target"><span>x</span></div>');
      expect(isEditableTarget(wrapper.querySelector("#target"))).toBe(false);
    });

    it("is false for non-elements", () => {
      expect(isEditableTarget(null)).toBe(false);
      expect(isEditableTarget(document.createTextNode("x"))).toBe(false);
      expect(isEditableTarget(window)).toBe(false);
    });
  });

  describe("isDraggableTarget", () => {
    it("is true for draggable elements and their descendants", () => {
      const wrapper = build(
        '<div draggable="true"><span><i id="target">x</i></span></div>',
      );
      expect(isDraggableTarget(wrapper.querySelector("#target"))).toBe(true);
      expect(isDraggableTarget(wrapper.firstElementChild)).toBe(true);
    });

    it("is false for draggable=false and plain elements", () => {
      const wrapper = build(
        '<div draggable="false" id="a"></div><div id="b"></div>',
      );
      expect(isDraggableTarget(wrapper.querySelector("#a"))).toBe(false);
      expect(isDraggableTarget(wrapper.querySelector("#b"))).toBe(false);
    });

    it("is false for non-elements", () => {
      expect(isDraggableTarget(null)).toBe(false);
      expect(isDraggableTarget(document)).toBe(false);
    });
  });

  describe("cancelTimeout", () => {
    afterEach(() => {
      jest.useRealTimers();
    });

    it("clears a pending timeout", () => {
      jest.useFakeTimers();
      const callback = jest.fn();
      const timer = setTimeout(callback, 100);

      cancelTimeout(timer);
      jest.advanceTimersByTime(200);

      expect(callback).not.toHaveBeenCalled();
    });

    it("ignores null", () => {
      expect(() => cancelTimeout(null)).not.toThrow();
    });
  });
});
