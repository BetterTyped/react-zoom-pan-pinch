import { waitFor } from "@testing-library/react";

import { renderApp, sleep } from "../../utils";

describe("Pan Touch [Velocity]", () => {
  describe("When panning to coords", () => {
    it("should trigger velocity", async () => {
      const { content, touchPan, pinch } = renderApp();
      pinch({ value: 1.5 });
      expect(content.style.transform).toBe("translate(0px, 0px) scale(1.5)");
      await sleep(10);
      touchPan({ x: 20, y: 20 });
      expect(content.style.transform).toBe("translate(20px, 20px) scale(1.5)");
    });
    // it("should not trigger disabled velocity", async () => {
    //   const { content, touchPan, pinch } = renderApp({
    //     disablePadding: false,
    //   });
    //   pinch({ value: 1.2 });
    //   expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    //   touchPan({ x: 100, y: 100 });
    //   expect(content.style.transform).toBe("translate(100px, 100px) scale(1)");
    //   await waitFor(() => {
    //     expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    //   });
    // });
    // it("should accelerate to certain point", async () => {
    //   const { content, touchPan, zoom } = renderApp();
    //   expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    //   zoom({ value: 1.5 });
    //   expect(content.style.transform).toBe("translate(0px, 0px) scale(1.5)");
    //   touchPan({ x: 100, y: 100 });
    //   await sleep(10);
    //   expect(content.style.transform).toBe(
    //     "translate(100px, 100px) scale(1.5)",
    //   );
    // });
  });
});
