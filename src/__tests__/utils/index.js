import { fireEvent } from "@testing-library/react";

export function clickOnComponent(component) {
  fireEvent.click(component);
}
