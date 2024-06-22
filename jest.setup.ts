// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import "jest-extended";
import { jestPreviewConfigure } from "jest-preview";

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
global.IS_REACT_ACT_ENVIRONMENT = true;
// ./config/jest/setupTests.js

// Should be path from root of your project
jestPreviewConfigure({
  autoPreview: true,
  // publicFolder: "static", // No need to configure if `publicFolder` is `public`
});

/** @returns {rotate: "-10 50 100", translate: "-36 45.5", skewX: "40", scale: "1 0.5"} */
function parseTransform(transform: string): Record<string, string> {
  return Array.from(transform.matchAll(/(\w+)\((.+?)\)/gm)).reduce(
    (agg, [, fn, val]) => ({
      ...agg,
      [fn]: val,
    }),
    {},
  );
}

const getSize = (element: HTMLElement) => {
  const isPercentageWidth = element.style.width.includes("%");
  const isPercentageHeight = element.style.height.includes("%");

  const values = parseTransform(element.style.transform);

  const scale = values?.scale || "1";

  let width = 0;
  let height = 0;

  if (isPercentageWidth || isPercentageHeight) {
    const parent = getSize(element.parentNode as HTMLElement);
    width = (parseFloat(element.style.width) * parent.width) / 100;
    height = (parseFloat(element.style.height) * parent.height) / 100;
  } else {
    width = parseFloat(element.style.width);
    height = parseFloat(element.style.height);
  }

  return {
    width: width * parseFloat(scale),
    height: height * parseFloat(scale),
  };
};

window.HTMLElement.prototype.getBoundingClientRect = function () {
  const style = window.getComputedStyle(this);
  const size = getSize(this);
  const elements = {
    x: parseFloat(style.left) || 0,
    y: parseFloat(style.top) || 0,
    width: size.width,
    height: size.height,
    top: parseFloat(style.top) || 0,
    right: parseFloat(style.right) || 0,
    bottom: parseFloat(style.bottom) || 0,
    left: parseFloat(style.left) || 0,
  };
  const rect: DOMRect = {
    ...elements,
    toJSON: () => {
      return JSON.stringify(elements);
    },
  };
  return rect;
};

Object.defineProperties(window.HTMLElement.prototype, {
  offsetLeft: {
    get: function () {
      return parseFloat(window.getComputedStyle(this).marginLeft) || 0;
    },
  },
  offsetTop: {
    get: function () {
      return parseFloat(window.getComputedStyle(this).marginTop) || 0;
    },
  },
  offsetHeight: {
    get: function () {
      return getSize(this).height;
    },
  },
  offsetWidth: {
    get: function () {
      return getSize(this).width;
    },
  },
});
