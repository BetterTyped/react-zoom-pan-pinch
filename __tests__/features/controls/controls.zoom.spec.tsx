import { fireEvent, waitFor } from "@testing-library/react";

import { renderApp } from "../../utils/render-app";

describe("Controls [Base]", () => {
  describe("When zooming in with controls button", () => {
    // it("should increase css scale with animated zoom", async () => {
    //   const { content, zoomInBtn } = renderApp();
    //   expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    //   fireEvent(zoomInBtn, new MouseEvent("click", { bubbles: true }));
    //   // Animation starts
    //   expect(content.style.transform).toBe("translate(0px, 0px) scale(1)");
    //   await waitFor(() => {
    //     // Animation ends
    //     expect(content.style.transform).toBe("translate(0px, 0px) scale(1.65)");
    //   });
    // });
  });
});
