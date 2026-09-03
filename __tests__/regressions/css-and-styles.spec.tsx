import * as fs from "fs";
import * as path from "path";

const CSS_MODULE_PATH = path.resolve(
  __dirname,
  "../../src/components/transform-component/transform-component.module.css",
);

const readBlock = (css: string, selector: string): string => {
  const match = css.match(new RegExp(`${selector}\\s*\\{([^}]*)\\}`));
  if (!match) throw new Error(`No ${selector} block in the CSS module`);
  return match[1];
};

/**
 * These pin the shipped stylesheet contract. They are not fixes for any
 * GitHub issue: #112 (fit-content in old Chrome) could not be reproduced on a
 * current browser and #467 (text selection inside the canvas) is fixed by an
 * inline lock during gestures;
 * see docs/bugs/112-*.md and docs/bugs/467-*.md.
 */
describe("CSS module contract", () => {
  const css = fs.readFileSync(CSS_MODULE_PATH, "utf-8");

  it("wrapper sizes itself to its content and clips overflow", () => {
    const wrapper = readBlock(css, "\\.wrapper");
    expect(wrapper).toMatch(/width:\s*fit-content/);
    expect(wrapper).toMatch(/height:\s*fit-content/);
    expect(wrapper).toMatch(/overflow:\s*hidden/);
    expect(wrapper).toMatch(/position:\s*relative/);
  });

  it("content scales from its top-left corner", () => {
    const content = readBlock(css, "\\.content");
    expect(content).toMatch(/transform-origin:\s*0%\s*0%/);
    expect(content).toMatch(/width:\s*fit-content/);
    expect(content).toMatch(/height:\s*fit-content/);
  });

  it("wrapper leaves text selectable; the lock is applied inline during a pan (#467)", () => {
    const wrapper = readBlock(css, "\\.wrapper");
    expect(wrapper).not.toMatch(/user-select/);
    // The iOS long-press callout on images stays disabled.
    expect(wrapper).toMatch(/-webkit-touch-callout:\s*none/);
  });

  it("images inside the content do not capture pointer events", () => {
    expect(css).toMatch(/\.content img\s*\{[^}]*pointer-events:\s*none/);
  });
});
