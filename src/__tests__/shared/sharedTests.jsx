export const testComponentCssValueToBe = async (
  component,
  cssName,
  expectedValue,
) => {
  const cssValue = component.style[cssName];
  // Set timeout is needed due to styles update time after rerender
  expect(cssValue.includes(expectedValue)).toBe(true);
};
