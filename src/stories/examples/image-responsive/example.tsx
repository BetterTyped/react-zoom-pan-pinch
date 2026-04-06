import React, { useState, useEffect, useMemo, useCallback } from "react";

import { TransformComponent, TransformWrapper } from "components";
import { Controls, normalizeArgs, viewerChrome } from "stories/utils";
import { useTransformComponent } from "../../../hooks";
import exampleImg from "../../assets/medium-image.jpg";

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
      {state.scale.toFixed(2)}x
    </div>
  ));
}

export const Example: React.FC<any> = (args: any) => {
  const src = exampleImg;
  const alt = "example";
  const scaleUp = true;
  const zoomFactor = 8;

  const [container, setContainer] = useState<HTMLDivElement | null>(null);

  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [containerHeight, setContainerHeight] = useState<number>(0);

  const [imageNaturalWidth, setImageNaturalWidth] = useState<number>(0);
  const [imageNaturalHeight, setImageNaturalHeight] = useState<number>(0);

  const imageScale = useMemo(() => {
    if (
      containerWidth === 0 ||
      containerHeight === 0 ||
      imageNaturalWidth === 0 ||
      imageNaturalHeight === 0
    )
      return 0;
    const scale = Math.min(
      containerWidth / imageNaturalWidth,
      containerHeight / imageNaturalHeight,
    );
    return scaleUp ? scale : Math.max(scale, 1);
  }, [
    scaleUp,
    containerWidth,
    containerHeight,
    imageNaturalWidth,
    imageNaturalHeight,
  ]);

  const applySize = useCallback((width: number, height: number) => {
    setContainerWidth(width);
    setContainerHeight(height);
  }, []);

  useEffect(() => {
    if (!container) return undefined;

    const measure = () => {
      const rect = container.getBoundingClientRect();
      applySize(rect.width, rect.height);
    };

    measure();

    const ro = new ResizeObserver((entries) => {
      const cr = entries[0]?.contentRect;
      if (cr) {
        applySize(cr.width, cr.height);
      }
    });
    ro.observe(container);

    return () => {
      ro.disconnect();
    };
  }, [container, applySize]);

  const handleImageOnLoad = (image: HTMLImageElement) => {
    setImageNaturalWidth(image.naturalWidth);
    setImageNaturalHeight(image.naturalHeight);
  };

  useEffect(() => {
    const image = new Image();
    image.onload = () => handleImageOnLoad(image);
    image.src = src;
  }, [src]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        minHeight: 0,
        maxWidth: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
        position: "relative",
      }}
      ref={(el: HTMLDivElement | null) => setContainer(el)}
    >
      {imageScale > 0 && (
        <TransformWrapper
          key={`${containerWidth}x${containerHeight}`}
          initialScale={imageScale}
          minScale={imageScale * 0.5}
          maxScale={imageScale * zoomFactor}
          centerOnInit
          {...normalizeArgs(args)}
        >
          {(utils) => (
            <>
              <Controls {...utils} />
              <ScaleBadge />
              <TransformComponent
                wrapperStyle={{
                  ...viewerChrome,
                  width: "100%",
                  height: "100%",
                }}
              >
                <img alt={alt} src={src} style={{ display: "block" }} />
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      )}
    </div>
  );
};
