import React from "react";
import { act, render, screen } from "@testing-library/react";

import {
  TransformWrapper,
  TransformComponent,
  KeepScale,
  ReactZoomPanPinchContentRef,
} from "../../../src";

const ref = React.createRef<ReactZoomPanPinchContentRef>();

function App({ showMarker }: { showMarker: boolean }) {
  return (
    <TransformWrapper ref={ref}>
      <TransformComponent
        wrapperStyle={{ width: "500px", height: "500px" }}
        contentStyle={{ width: "1000px", height: "1000px" }}
      >
        {showMarker && (
          <KeepScale data-testid="marker">
            <span>pin</span>
          </KeepScale>
        )}
      </TransformComponent>
    </TransformWrapper>
  );
}

describe("KeepScale [Mount]", () => {
  it("applies the identity counter-scale as soon as it mounts at scale 1", () => {
    render(<App showMarker />);

    expect(screen.getByTestId("marker").style.transform).toBe(
      "translate(0px, 0px) scale(1)",
    );
  });

  it("applies the inverse scale immediately when mounted while already zoomed", () => {
    const view = render(<App showMarker={false} />);

    act(() => {
      ref.current!.setTransform(0, 0, 2, 0);
    });
    view.rerender(<App showMarker />);

    expect(screen.getByTestId("marker").style.transform).toBe(
      "translate(0px, 0px) scale(0.5)",
    );
  });

  it("keeps following later transform changes", () => {
    const view = render(<App showMarker={false} />);

    act(() => {
      ref.current!.setTransform(0, 0, 2, 0);
    });
    view.rerender(<App showMarker />);
    act(() => {
      ref.current!.setTransform(0, 0, 4, 0);
    });

    expect(screen.getByTestId("marker").style.transform).toBe(
      "translate(0px, 0px) scale(0.25)",
    );
  });
});
