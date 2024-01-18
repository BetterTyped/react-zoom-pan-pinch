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
