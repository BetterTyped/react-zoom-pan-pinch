import * as fs from "fs";
import * as path from "path";

import { renderApp } from "../utils";

const CSS_MODULE_PATH = path.resolve(
  __dirname,
  "../../src/components/transform-component/transform-component.module.css",
);

describe("CSS and styles regressions", () => {
  it("wrapper CSS does not use fit-content sizing that breaks Chrome layout (Ref #112)", () => {
    const css = fs.readFileSync(CSS_MODULE_PATH, "utf-8");
    expect(css).not.toMatch(/width:\s*fit-content/);
    expect(css).not.toMatch(/height:\s*fit-content/);
  });

  it("wrapper sets touch-action to prevent native browser pinch-zoom (Ref #506)", () => {
    const css = fs.readFileSync(CSS_MODULE_PATH, "utf-8");
    expect(css).toMatch(/touch-action:\s*none/);
  });
});
