import React from "react";
import { render } from "@testing-library/react";

import { TransformWrapper, TransformComponent } from "../../src";
import { injectStylesheet } from "../../src/utils/styles.utils";

/**
 * Ref #403 (CSP) / #371 (shadow DOM) —
 * https://github.com/BetterTyped/react-zoom-pan-pinch/issues/403
 * https://github.com/BetterTyped/react-zoom-pan-pinch/issues/371
 *
 * The bundle used `style-inject`, which appends a `<style>` to
 * `document.head` when the module loads: blocked by a CSP without
 * `'unsafe-inline'` (no way to pass a nonce) and never applied inside a
 * shadow root. TransformComponent now injects the stylesheet into the
 * wrapper's own root at mount, with an optional nonce, and can skip it.
 */
const STYLE = "style[data-react-zoom-pan-pinch]";
const CSS = ".wrapper { overflow: hidden; }";

// The Jest CSS mock has no `stylesheet` export; give the module the shape
// rollup-plugin-postcss emits with `inject: false` (class map + CSS string).
jest.mock(
  "../../src/components/transform-component/transform-component.module.css",
  () => ({
    __esModule: true,
    default: { wrapper: "wrapper", content: "content" },
    stylesheet: ".wrapper { overflow: hidden; }",
  }),
);

const Viewer = (
  props: Omit<React.ComponentProps<typeof TransformComponent>, "children">,
) => (
  <TransformWrapper>
    <TransformComponent {...props}>
      <div>content</div>
    </TransformComponent>
  </TransformWrapper>
);

afterEach(() => {
  document.head.querySelectorAll(STYLE).forEach((node) => node.remove());
  document.body.innerHTML = "";
});

describe("injectStylesheet (#403, #371)", () => {
  it("adds the CSS to the document head, with the nonce", () => {
    const wrapper = document.createElement("div");
    document.body.appendChild(wrapper);

    injectStylesheet(wrapper, CSS, "abc123");

    const styles = document.head.querySelectorAll(STYLE);
    expect(styles).toHaveLength(1);
    expect(styles[0].textContent).toBe(CSS);
    expect(styles[0].getAttribute("nonce")).toBe("abc123");
  });

  it("adds it once per root, however many viewers mount", () => {
    const first = document.createElement("div");
    const second = document.createElement("div");
    document.body.append(first, second);

    injectStylesheet(first, CSS);
    injectStylesheet(second, CSS);

    expect(document.head.querySelectorAll(STYLE)).toHaveLength(1);
  });

  it("adds a different stylesheet (another copy of the library) next to it", () => {
    const wrapper = document.createElement("div");
    document.body.appendChild(wrapper);

    injectStylesheet(wrapper, CSS);
    injectStylesheet(wrapper, ".other { color: red; }");

    expect(document.head.querySelectorAll(STYLE)).toHaveLength(2);
  });

  it("goes into the shadow root the wrapper lives in, not the head", () => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    const shadowRoot = host.attachShadow({ mode: "open" });
    const wrapper = document.createElement("div");
    shadowRoot.appendChild(wrapper);

    injectStylesheet(wrapper, CSS);

    expect(shadowRoot.querySelectorAll(STYLE)).toHaveLength(1);
    expect(document.head.querySelectorAll(STYLE)).toHaveLength(0);
  });

  it("does nothing without CSS (a bundler that loads the CSS itself)", () => {
    const wrapper = document.createElement("div");
    document.body.appendChild(wrapper);

    injectStylesheet(wrapper, undefined);

    expect(document.head.querySelectorAll(STYLE)).toHaveLength(0);
  });
});

describe("TransformComponent style injection (#403, #371)", () => {
  it("injects the stylesheet on mount with the nonce prop", () => {
    render(<Viewer nonce="n0nce" />);

    const styles = document.head.querySelectorAll(STYLE);
    expect(styles).toHaveLength(1);
    expect(styles[0].getAttribute("nonce")).toBe("n0nce");
  });

  it("injects nothing with disableStyleInjection", () => {
    render(<Viewer disableStyleInjection />);

    expect(document.head.querySelectorAll(STYLE)).toHaveLength(0);
  });

  it("injects into the shadow root it renders in", () => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    const shadowRoot = host.attachShadow({ mode: "open" });

    render(<Viewer />, {
      container: shadowRoot as unknown as HTMLElement,
    });

    expect(shadowRoot.querySelectorAll(STYLE)).toHaveLength(1);
    expect(document.head.querySelectorAll(STYLE)).toHaveLength(0);
  });
});
