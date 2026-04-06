import React, { useCallback } from "react";
import { useTransformComponent } from "../../hooks/use-transform-component";

const THRESHOLD = 30;
const FOG_MAX = 60;
const FOG_COLOR = "10, 10, 18";

interface BoundsOverlayProps {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  wrapperWidth: number;
  wrapperHeight: number;
}

export function BoundsOverlay({
  minX,
  maxX,
  minY,
  maxY,
  wrapperWidth,
  wrapperHeight,
}: BoundsOverlayProps) {
  const computeEdges = useCallback(
    (state: {
      state: { positionX: number; positionY: number; scale: number };
    }) => {
      const { positionX, positionY, scale } = state.state;

      // Match the library's scaled bounds (see calculateBounds in bounds.utils.ts)
      const sMinX = wrapperWidth * (1 - scale) + minX * scale;
      const sMaxX = maxX * scale;
      const sMinY = wrapperHeight * (1 - scale) + minY * scale;
      const sMaxY = maxY * scale;

      const rangeX = sMaxX - sMinX || 1;
      const rangeY = sMaxY - sMinY || 1;
      const t = THRESHOLD;

      return {
        left: Math.max(0, 1 - (sMaxX - positionX) / Math.min(t, rangeX)),
        right: Math.max(0, 1 - (positionX - sMinX) / Math.min(t, rangeX)),
        top: Math.max(0, 1 - (sMaxY - positionY) / Math.min(t, rangeY)),
        bottom: Math.max(0, 1 - (positionY - sMinY) / Math.min(t, rangeY)),
      };
    },
    [minX, maxX, minY, maxY, wrapperWidth, wrapperHeight],
  );

  const edges = useTransformComponent(computeEdges);

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        overflow: "hidden",
        borderRadius: "10px",
        zIndex: 10,
      }}
    >
      <FogBar side="left" intensity={edges.left} />
      <FogBar side="right" intensity={edges.right} />
      <FogBar side="top" intensity={edges.top} />
      <FogBar side="bottom" intensity={edges.bottom} />

      <EdgeLabel side="left" intensity={edges.left} />
      <EdgeLabel side="right" intensity={edges.right} />
      <EdgeLabel side="top" intensity={edges.top} />
      <EdgeLabel side="bottom" intensity={edges.bottom} />
    </div>
  );
}

function FogBar({
  side,
  intensity,
}: {
  side: "left" | "right" | "top" | "bottom";
  intensity: number;
}) {
  if (intensity <= 0) return null;

  const depth = Math.round(FOG_MAX * intensity);
  const isHorizontal = side === "left" || side === "right";

  const gradientDir =
    side === "left"
      ? "to right"
      : side === "right"
        ? "to left"
        : side === "top"
          ? "to bottom"
          : "to top";

  const style: React.CSSProperties = {
    position: "absolute",
    background: `linear-gradient(${gradientDir}, rgba(${FOG_COLOR}, ${Math.min(0.97, intensity * 0.97)}) 0%, rgba(${FOG_COLOR}, ${Math.min(0.6, intensity * 0.6)}) 50%, rgba(${FOG_COLOR}, 0) 100%)`,
    pointerEvents: "none",
  };

  if (isHorizontal) {
    Object.assign(style, {
      top: 0,
      bottom: 0,
      [side]: 0,
      width: depth,
    });
  } else {
    Object.assign(style, {
      left: 0,
      right: 0,
      [side]: 0,
      height: depth,
    });
  }

  return <div style={style} />;
}

function EdgeLabel({
  side,
  intensity,
}: {
  side: "left" | "right" | "top" | "bottom";
  intensity: number;
}) {
  if (intensity < 0.3) return null;

  const opacity = Math.min(1, (intensity - 0.3) / 0.7);
  const isVertical = side === "left" || side === "right";

  const positionStyle: React.CSSProperties = isVertical
    ? {
        top: "50%",
        [side]: `${12 + (1 - Math.min(1, intensity)) * 20}px`,
        transform: `translateY(-50%) rotate(${side === "left" ? -90 : 90}deg)`,
      }
    : {
        left: "50%",
        [side]: `${12 + (1 - Math.min(1, intensity)) * 20}px`,
        transform: "translateX(-50%)",
      };

  return (
    <span
      style={{
        position: "absolute",
        color: `rgba(255, 100, 100, ${opacity * 0.8})`,
        fontSize: "13px",
        fontWeight: 700,
        letterSpacing: "4px",
        textTransform: "uppercase",
        fontFamily: "system-ui, -apple-system, sans-serif",
        userSelect: "none",
        pointerEvents: "none",
        transition: "opacity 0.15s ease-out",
        textShadow: `0 0 12px rgba(255, 80, 80, ${opacity * 0.5})`,
        ...positionStyle,
      }}
    >
      Limit
    </span>
  );
}
