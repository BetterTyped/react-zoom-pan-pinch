import { waitFor } from "@testing-library/dom";

import { renderApp } from "../../utils/render-app";

describe("Pinch [Extreme sizes]", () => {
  describe("Huge canvas (5000×5000 content in 500×500 wrapper)", () => {
    const huge = {
      wrapperWidth: "500px",
      wrapperHeight: "500px",
      contentWidth: "5000px",
      contentHeight: "5000px",
      disablePadding: true,
    } as const;

    it("should pinch zoom in on a huge canvas", async () => {
      const { ref, pinch } = renderApp(huge);

      pinch({ value: 2, center: [250, 250] });
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeCloseTo(2, 0);
      });
    });

    it("should pinch zoom to max on huge canvas", async () => {
      const { ref, pinch } = renderApp({ ...huge, maxScale: 3 });

      pinch({ value: 5, center: [250, 250] });
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeLessThanOrEqual(3);
      });
    });
  });

  describe("Tall document (500×3000 content in 500×500 wrapper)", () => {
    const tall = {
      wrapperWidth: "500px",
      wrapperHeight: "500px",
      contentWidth: "500px",
      contentHeight: "3000px",
      disablePadding: true,
    } as const;

    it("should pinch zoom in on a tall document", async () => {
      const { ref, pinch } = renderApp(tall);

      pinch({ value: 2, center: [250, 250] });
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeCloseTo(2, 0);
      });
    });

    it("should pinch zoom to max on tall content", async () => {
      const { ref, pinch } = renderApp({ ...tall, maxScale: 3 });

      pinch({ value: 5, center: [250, 250] });
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeLessThanOrEqual(3);
      });
    });
  });

  describe("Tiny viewport (1000×1000 content in 50×50 wrapper)", () => {
    const tiny = {
      wrapperWidth: "50px",
      wrapperHeight: "50px",
      contentWidth: "1000px",
      contentHeight: "1000px",
      disablePadding: true,
    } as const;

    it("should pinch zoom in on tiny viewport", async () => {
      const { ref, pinch } = renderApp(tiny);

      pinch({ value: 2, center: [25, 25] });
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeCloseTo(2, 0);
      });
    });

    it("should pinch zoom respects maxScale in tiny viewport", async () => {
      const { ref, pinch } = renderApp({ ...tiny, maxScale: 4 });

      pinch({ value: 10, center: [25, 25] });
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeLessThanOrEqual(4);
      });
    });
  });

  describe("Mismatched aspect ratios (4000×200 content in 200×800 wrapper)", () => {
    const mismatched = {
      wrapperWidth: "200px",
      wrapperHeight: "800px",
      contentWidth: "4000px",
      contentHeight: "200px",
      disablePadding: true,
    } as const;

    it("should pinch zoom in on mismatched aspect content", async () => {
      const { ref, pinch } = renderApp(mismatched);

      pinch({ value: 2, center: [100, 100] });
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeCloseTo(2, 0);
      });
    });

    it("should pinch zoom to max on mismatched aspect", async () => {
      const { ref, pinch } = renderApp({ ...mismatched, maxScale: 4 });

      pinch({ value: 10, center: [100, 100] });
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeLessThanOrEqual(4);
      });
    });
  });
});
