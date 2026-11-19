import React, { useRef, useState } from "react";

import { TransformComponent, TransformWrapper } from "components";
import { ReactZoomPanPinchRef } from "models";
import { normalizeArgs, viewerChrome } from "stories/utils";
import exampleImg from "../../assets/map.jpg";

const font = 'Inter, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
const MIN_SCALE = 0.5;
const MAX_SCALE = 6;

/**
 * Two-way sync between the viewer and a slider kept in React state (#366).
 * The library owns the transform; React only mirrors it:
 *
 * - viewer → slider: `onTransform` reports every change (wheel, pinch,
 *   double click, buttons) and the slider value follows.
 * - slider → viewer: `zoomToPoint` zooms around the middle of the viewport,
 *   so the slider zooms where you are looking instead of jumping to a corner.
 *
 * Nothing re-renders the content per frame, and gestures never fight a
 * controlled prop.
 */
export const Example: React.FC<Record<string, unknown>> = (args) => {
  const normalized = normalizeArgs(args);
  const viewerRef = useRef<ReactZoomPanPinchRef | null>(null);
  const [scale, setScale] = useState(1);

  const zoomFromSlider = (nextScale: number) => {
    const viewer = viewerRef.current;
    const wrapper = viewer?.instance.wrapperComponent;
    if (!viewer || !wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    viewer.zoomToPoint(
      nextScale,
      rect.left + rect.width / 2,
      rect.top + rect.height / 2,
      0,
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          color: "#64748b",
          fontFamily: font,
          fontSize: 12,
          fontWeight: 600,
        }}
      >
        <span aria-hidden>Zoom</span>
        <input
          aria-label="Zoom"
          type="range"
          min={MIN_SCALE}
          max={MAX_SCALE}
          step={0.01}
          value={scale}
          onChange={(event) => zoomFromSlider(Number(event.target.value))}
          style={{ flex: 1 }}
        />
        <output style={{ width: 48, textAlign: "right" }}>
          {Math.round(scale * 100)}%
        </output>
      </div>
      <TransformWrapper
        {...normalized}
        ref={viewerRef}
        minScale={MIN_SCALE}
        maxScale={MAX_SCALE}
        onTransform={(_, state) => setScale(state.scale)}
      >
        <TransformComponent
          wrapperStyle={{ ...viewerChrome, width: "100%", height: 420 }}
        >
          <img
            alt="City map"
            src={exampleImg}
            style={{ display: "block", width: 1200 }}
          />
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};
