import { waitFor } from "@testing-library/react";

import { renderApp } from "../../utils/render-app";
import { ReactZoomPanPinchState } from "models";

describe("Animations [Base]", () => {
  describe("When panning out of boundaries", () => {
    describe("And content is zoomed in", () => {
      it("should animate returning to the bounded position", async () => {
        const transformStates: ReactZoomPanPinchState[] = [];
        const { content, pan, zoom } = renderApp({
          onPanning: (ref) => {
            transformStates.push(ref.instance.transformState);
          },
        });
        expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
        zoom({ value: 1.5 });
        expect(content.style.transform).toBe(
          "translate(0px, 0px) scale(1.5009999999999448)",
        );
        pan({ x: -100, y: -100 });
        expect(transformStates).toHaveLength(1);
        expect(content.style.transform).toBe(
          "translate(-100px, -100px) scale(1.5009999999999448)",
        );
        // await waitFor(() => {
        //   expect(transformStates).toHaveLength(5);
        // });
      });
    });
    it("should animate returning to the bounded position", async () => {
      const { content, pan, zoom } = renderApp();
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
      pan({ x: -100, y: -100 });
      expect(content.style.transform).toBe(
        "translate(-100px, -100px) scale(1)",
      );
      // await waitFor(() => {
      //   expect(transformStates).toHaveLength(5);
      // });
    });
  });
});
