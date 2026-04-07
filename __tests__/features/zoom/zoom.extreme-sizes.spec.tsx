import { waitFor } from "@testing-library/dom";

import { renderApp } from "../../utils/render-app";

describe("Zoom [Extreme sizes]", () => {
  describe("Huge canvas (5000×5000 content in 500×500 wrapper)", () => {
    const huge = {
      wrapperWidth: "500px",
      wrapperHeight: "500px",
      contentWidth: "5000px",
      contentHeight: "5000px",
      disablePadding: true,
    } as const;

    it("should zoom in while maintaining scale", async () => {
      const { ref, zoom } = renderApp(huge);

      zoom({ value: 3 });
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeCloseTo(3, 0);
      });
    });

    it("should zoom to cursor position on huge canvas", async () => {
      const { ref, zoom } = renderApp(huge);

      zoom({ value: 2, center: [250, 250] });
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeCloseTo(2, 0);
      });
      expect(ref.current?.instance.state.positionX).toBeLessThanOrEqual(0);
      expect(ref.current?.instance.state.positionY).toBeLessThanOrEqual(0);
    });

    it("should zoom out and respect minScale on huge canvas", async () => {
      const { ref, zoom } = renderApp({ ...huge, minScale: 0.1 });

      zoom({ value: 0.1 });
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeCloseTo(0.1, 1);
      });
    });

    it("should respect maxScale limit on huge canvas", async () => {
      const { ref, zoom } = renderApp({ ...huge, maxScale: 2 });

      zoom({ value: 5 });
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeLessThanOrEqual(2);
      });
    });

    it("should keep position in bounds after zoom out", async () => {
      const { ref, zoom } = renderApp({
        ...huge,
        limitToBounds: true,
        minScale: 0.5,
      });

      zoom({ value: 0.5 });
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeCloseTo(0.5, 0);
      });
      expect(ref.current?.instance.state.positionX).toBeGreaterThanOrEqual(0);
      expect(ref.current?.instance.state.positionY).toBeGreaterThanOrEqual(0);
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

    it("should zoom in on a tall document", async () => {
      const { ref, zoom } = renderApp(tall);

      zoom({ value: 2 });
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeCloseTo(2, 0);
      });
    });

    it("should zoom to cursor on a tall document", async () => {
      const { ref, zoom } = renderApp(tall);

      zoom({ value: 2, center: [250, 400] });
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeCloseTo(2, 0);
      });
      expect(ref.current?.instance.state.positionY).toBeLessThanOrEqual(0);
    });

    it("should allow zooming out below 1 on tall content", async () => {
      const { ref, zoom } = renderApp({ ...tall, minScale: 0.2 });

      zoom({ value: 0.2 });
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeCloseTo(0.2, 1);
      });
    });
  });

  describe("Wide panorama (3000×300 content in 500×500 wrapper)", () => {
    const wide = {
      wrapperWidth: "500px",
      wrapperHeight: "500px",
      contentWidth: "3000px",
      contentHeight: "300px",
      disablePadding: true,
    } as const;

    it("should zoom in on a wide panorama", async () => {
      const { ref, zoom } = renderApp(wide);

      zoom({ value: 3 });
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeCloseTo(3, 0);
      });
    });

    it("should zoom to cursor at edge of panorama", async () => {
      const { ref, zoom } = renderApp(wide);

      zoom({ value: 2, center: [450, 100] });
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeCloseTo(2, 0);
      });
      expect(ref.current?.instance.state.positionX).toBeLessThanOrEqual(0);
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

    it("should zoom in within a tiny viewport", async () => {
      const { ref, zoom } = renderApp(tiny);

      zoom({ value: 2 });
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeCloseTo(2, 0);
      });
    });

    it("should zoom to cursor in tiny viewport", async () => {
      const { ref, zoom } = renderApp(tiny);

      zoom({ value: 3, center: [25, 25] });
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeCloseTo(3, 0);
      });
      expect(ref.current?.instance.state.positionX).toBeLessThanOrEqual(0);
      expect(ref.current?.instance.state.positionY).toBeLessThanOrEqual(0);
    });

    it("should zoom out with extreme ratio and respect bounds", async () => {
      const { ref, zoom } = renderApp({
        ...tiny,
        limitToBounds: true,
        minScale: 0.05,
      });

      zoom({ value: 0.05 });
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeCloseTo(0.05, 1);
      });
      expect(ref.current?.instance.state.positionX).toBeGreaterThanOrEqual(0);
      expect(ref.current?.instance.state.positionY).toBeGreaterThanOrEqual(0);
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

    it("should zoom in on mismatched aspect content", async () => {
      const { ref, zoom } = renderApp(mismatched);

      zoom({ value: 2 });
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeCloseTo(2, 0);
      });
    });

    it("should zoom and pan keeping correct position", async () => {
      const { ref, zoom, pan } = renderApp(mismatched);

      zoom({ value: 2 });
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeCloseTo(2, 0);
      });

      pan({ x: -500, y: -100 });
      expect(ref.current?.instance.state.positionX).toBeLessThan(0);
    });

    it("should zoom out and respect bounds with inverted ratios", async () => {
      const { ref, zoom } = renderApp({
        ...mismatched,
        limitToBounds: true,
        minScale: 0.2,
      });

      zoom({ value: 0.2 });
      await waitFor(() => {
        expect(ref.current?.instance.state.scale).toBeCloseTo(0.2, 1);
      });
      expect(ref.current?.instance.state.positionX).toBeGreaterThanOrEqual(0);
      expect(ref.current?.instance.state.positionY).toBeGreaterThanOrEqual(0);
    });
  });
});
