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

const getWidth = (element: HTMLElement) => {
  const isPercentageWidth = element.style.width.includes("%");
  const isPercentageHeight = element.style.height.includes("%");

  let width = 0;
  let height = 0;

  const top = parseFloat(element.style.marginTop) || 0;
  const left = parseFloat(element.style.marginLeft) || 0;

  if (isPercentageWidth || isPercentageHeight) {
    const parent = getWidth(element.parentNode as HTMLElement);
    width = (parseFloat(element.style.width) * parent.width) / 100;
    height = (parseFloat(element.style.height) * parent.height) / 100;
  } else {
    width = parseFloat(element.style.width);
    height = parseFloat(element.style.height);
  }

  return {
    width,
    height,
    top,
    left,
  };
};

// @ts-ignore
window.HTMLElement.prototype.getBoundingClientRect = function () {
  const size = getWidth(this);

  return size;
};
