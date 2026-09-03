import React from "react";

import { TransformComponent, TransformWrapper } from "components";
import { Controls, normalizeArgs, viewerChrome } from "stories/utils";
import { useTransformComponent } from "../../../hooks";
import exampleImg from "../../assets/big-image.jpeg";

function ScaleBadge() {
  return useTransformComponent(({ state }) => (
    <div
      style={{
        position: "absolute",
        bottom: 16,
        right: 16,
        zIndex: 10,
        padding: "5px 12px",
        borderRadius: 8,
        background: "rgba(10, 10, 18, 0.78)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "rgba(255,255,255,0.7)",
        fontSize: 11,
        fontWeight: 600,
        fontFamily: "system-ui, -apple-system, sans-serif",
        letterSpacing: "0.02em",
        userSelect: "none",
        pointerEvents: "none",
      }}
    >
      {Math.round(state.scale * 100)}%
    </div>
  ));
}

/**
 * A photo much larger than its viewport. `fitOnInit` shows the whole image on
 * the first paint (and again once the image has loaded and reports its size),
 * while the buttons switch between the fit modes at runtime with `fitToView`.
 */
export const Example: React.FC<Record<string, unknown>> = (args) => {
  const normalized = normalizeArgs(args);

  return (
    <TransformWrapper
      {...normalized}
      fitOnInit
      // The default minScale of 1 never shrinks content; a large image needs
      // room to scale down for the fit to be possible.
      minScale={0.05}
      maxScale={8}
      centerZoomedOut
    >
      {(utils) => (
        <>
          <Controls
            {...utils}
            extraButtons={[
              {
                label: "Fit",
                onClick: () => utils.fitToView(),
              },
              {
                label: "Cover",
                onClick: () => utils.fitToView({ mode: "cover" }),
              },
              {
                label: "1:1",
                onClick: () => utils.centerView(1),
              },
            ]}
          />
          <ScaleBadge />
          <TransformComponent
            wrapperStyle={{
              ...viewerChrome,
              width: "100%",
              height: "100%",
            }}
          >
            <img
              alt="Aerial cityscape, fitted to the viewport on load"
              src={exampleImg}
              style={{ display: "block" }}
            />
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  );
};
