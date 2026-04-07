import * as fs from "fs";
import * as path from "path";

const CSS_MODULE_PATH = path.resolve(
  __dirname,
  "../../src/components/transform-component/transform-component.module.css",
);

describe("CSS and styles regressions", () => {
  it("wrapper CSS uses fit-content sizing for intrinsic layout (Ref #112)", () => {
    const css = fs.readFileSync(CSS_MODULE_PATH, "utf-8");
    expect(css).toMatch(/width:\s*fit-content/);
    expect(css).toMatch(/height:\s*fit-content/);
  });

  it("wrapper CSS sets user-select to prevent accidental selection during gestures", () => {
    const css = fs.readFileSync(CSS_MODULE_PATH, "utf-8");
    expect(css).toMatch(/user-select:\s*none/);
  });
});
