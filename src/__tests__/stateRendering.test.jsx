import React from "react";
import { render, wait } from "@testing-library/react";
import { SharedTestComponent } from "./shared";
import { propsList } from "../store/propsHandlers";
import { initialState } from "../store/InitialState";

describe("Library components", () => {
  const environment = {};

  beforeEach(async () => {
    environment.component = render(
      <SharedTestComponent
        getComponentState={values => {
          environment.state = values;
        }}
      />,
    );
    await wait(() => environment.state);
  });
  describe("When library components are in their initial state", async () => {
    propsList.forEach(propName => {
      describe(`When ${propName} prop value is in the initial state`, () => {
        test(`initial value matches the initialState one`, () => {
          expect(environment.state[propName]).toBe(initialState[propName]);
        });
      });
    });
  });
});
