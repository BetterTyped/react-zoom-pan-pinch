export const testComponentCssValueToBe = (
  component,
  cssName,
  expectedValue,
) => {
  const cssValue = component.style[cssName];
  // Set timeout is needed due to styles update time after rerender
  setTimeout(() => expect(cssValue.includes(expectedValue)).toBe(true), 0);
};
