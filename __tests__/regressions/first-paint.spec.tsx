import React, { useState } from "react";
import ReactDOM from "react-dom";

import { TransformWrapper, TransformComponent, Virtualize } from "../../src";

const contentProps = (testId: string) =>
  ({ "data-testid": testId }) as React.HTMLAttributes<HTMLDivElement>;

/**
 * These specs use the legacy `ReactDOM.render` on purpose: it commits layout
 * effects synchronously and defers passive effects, which is the closest jsdom
 * gets to "what the user sees on the first painted frame". A `render` from
 * testing-library wraps everything in `act()` and flushes passive effects too,
 * which would hide a one-frame flash.
 *
 * React 18 logs a deprecation warning for the legacy API and act() warnings for
 * the synchronous updates; both are expected noise here.
 */
describe("first paint: initialization runs before the browser paints", () => {
  let container: HTMLDivElement;
  let errorSpy: jest.SpyInstance;

  beforeEach(() => {
    errorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.unmountComponentAtNode(container);
    container.remove();
    errorSpy.mockRestore();
  });

  const legacyRender = (element: React.ReactElement) => {
    // eslint-disable-next-line react/no-deprecated
    ReactDOM.render(element, container);
  };

  it("mounts visible virtualized children in the same synchronous commit as the wrapper init", () => {
    legacyRender(
      <TransformWrapper>
        <TransformComponent
          wrapperStyle={{ width: "500px", height: "500px" }}
          contentStyle={{ width: "2000px", height: "2000px" }}
        >
          <Virtualize x={10} y={10} width={100} height={100}>
            <div data-testid="near-tile" />
          </Virtualize>
          <Virtualize x={1500} y={1500} width={100} height={100}>
            <div data-testid="far-tile" />
          </Virtualize>
        </TransformComponent>
      </TransformWrapper>,
    );

    expect(container.querySelector('[data-testid="near-tile"]')).not.toBeNull();
    expect(container.querySelector('[data-testid="far-tile"]')).toBeNull();
  });

  it("renders children immediately for a Virtualize added after the wrapper is initialized", () => {
    function Board() {
      const [showTile, setShowTile] = useState(false);
      return (
        <TransformWrapper>
          <button
            type="button"
            data-testid="add"
            onClick={() => setShowTile(true)}
          >
            add
          </button>
          <TransformComponent
            wrapperStyle={{ width: "500px", height: "500px" }}
            contentStyle={{ width: "2000px", height: "2000px" }}
          >
            {showTile && (
              <Virtualize x={10} y={10} width={100} height={100}>
                <div data-testid="late-tile" />
              </Virtualize>
            )}
          </TransformComponent>
        </TransformWrapper>
      );
    }

    legacyRender(<Board />);
    expect(container.querySelector('[data-testid="late-tile"]')).toBeNull();

    const button = container.querySelector(
      '[data-testid="add"]',
    ) as HTMLButtonElement;
    button.dispatchEvent(new MouseEvent("click", { bubbles: true }));

    // Same commit as the click, before any passive effect had a chance to run.
    expect(container.querySelector('[data-testid="late-tile"]')).not.toBeNull();
  });

  it("applies centerOnInit before the first paint", () => {
    legacyRender(
      <TransformWrapper centerOnInit>
        <TransformComponent
          wrapperStyle={{ width: "500px", height: "500px" }}
          contentStyle={{ width: "2000px", height: "2000px" }}
          contentProps={contentProps("centered-content")}
        >
          <div />
        </TransformComponent>
      </TransformWrapper>,
    );

    const content = container.querySelector(
      '[data-testid="centered-content"]',
    ) as HTMLElement;
    expect(content.style.transform).toBe("translate(-750px, -750px) scale(1)");
  });

  it("applies initialPosition and initialScale in the very first render", () => {
    legacyRender(
      <TransformWrapper
        initialPositionX={-40}
        initialPositionY={-60}
        initialScale={2}
      >
        <TransformComponent
          wrapperStyle={{ width: "500px", height: "500px" }}
          contentStyle={{ width: "2000px", height: "2000px" }}
          contentProps={contentProps("initial-content")}
        >
          <div />
        </TransformComponent>
      </TransformWrapper>,
    );

    const content = container.querySelector(
      '[data-testid="initial-content"]',
    ) as HTMLElement;
    expect(content.style.transform).toBe("translate(-40px, -60px) scale(2)");
  });
});
