/* eslint-disable react/require-default-props */
import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  useTransformContext,
  useTransformEffect,
  useTransformInit,
} from "hooks";
import { PositionType } from "models";
import { useResize } from "./use-resize.hook";
import {
  getMouseBoundedPosition,
  handleCalculateBounds,
} from "core/bounds/bounds.utils";
import { handleCancelAnimation } from "core/animations/animations.utils";
import { handleCalculateButtonZoom } from "core/handlers/handlers.utils";
import { handleZoomToPoint } from "core/zoom/zoom.logic";
import { roundNumber } from "utils";

export type MiniMapProps = {
  children: React.ReactNode;
  /** Width of the mini map box in px. */
  width?: number;
  /** Height of the mini map box in px. */
  height?: number;
  /** Border colour of the viewport indicator. */
  borderColor?: string;
  /**
   * Colour of the overlay that dims everything outside the viewport
   * (`.rzpp-minimap-mask`).
   */
  maskColor?: string;
  /** Merged onto the viewport indicator (`.rzpp-minimap-preview`). */
  previewStyle?: React.CSSProperties;
  /** Extra class name(s) appended to `.rzpp-minimap-wrapper`. */
  wrapperClassName?: string;
  /** Extra class name(s) appended to `.rzpp-minimap-preview`. */
  previewClassName?: string;
  /**
   * Dragging anywhere on the mini map grabs the viewport indicator and moves
   * it with the pointer (mouse and touch).
   */
  panning?: boolean;
  /**
   * Flips the drag direction: instead of grabbing the viewport indicator the
   * drag moves the content, like panning the main view.
   */
  inversePan?: boolean;
  /** Wheel over the mini map zooms the main view around its centre. */
  zoomable?: boolean;
  /** Scale increment applied per wheel notch when `zoomable` is on. */
  zoomStep?: number;
  /**
   * Padding around the mapped area, in mini map px at the current map scale
   * (same meaning as React Flow's `offsetScale`).
   */
  offsetScale?: number;
  /**
   * Fired for a click (or tap) that did not turn into a drag. `position` is
   * the clicked point in content coordinates, ready for `zoomToPoint`.
   */
  onClick?: (event: MouseEvent | TouchEvent, position: PositionType) => void;
} & Omit<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  "onClick"
>;

type MiniMapLayout = {
  /** Mini map px per content unit. */
  mapScale: number;
  /** Content coordinates of the mini map's top-left corner. */
  originX: number;
  originY: number;
  contentWidth: number;
  contentHeight: number;
  /** Viewport indicator in mini map px. */
  previewX: number;
  previewY: number;
  previewWidth: number;
  previewHeight: number;
};

type DragState = {
  x: number;
  y: number;
  moved: boolean;
};

const previewStyles = {
  position: "absolute",
  zIndex: 3,
  top: "0px",
  left: "0px",
  boxSizing: "border-box",
  border: "2px solid red",
  transformOrigin: "0% 0%",
  pointerEvents: "none",
} as const;

const wrapperStyles = {
  position: "absolute",
  top: "0px",
  left: "0px",
  transformOrigin: "0% 0%",
  boxSizing: "border-box",
  zIndex: 1,
  pointerEvents: "none",
} as const;

const maskStyles = {
  position: "absolute",
  top: "0px",
  left: "0px",
  zIndex: 2,
  pointerEvents: "none",
  display: "block",
} as const;

const getTouchPoint = (event: TouchEvent): PositionType | null => {
  const touch = event.touches[0] ?? event.changedTouches[0];
  if (!touch) return null;
  return { x: touch.clientX, y: touch.clientY };
};

const isInside = (element: HTMLElement | null, target: EventTarget | null) =>
  !!element &&
  !!target &&
  (target === element || element.contains(target as Node));

export const MiniMap: React.FC<MiniMapProps> = ({
  width = 200,
  height = 200,
  borderColor = "red",
  maskColor = "rgba(0, 0, 0, 0.2)",
  previewStyle,
  wrapperClassName,
  previewClassName,
  children,
  panning = true,
  inversePan = false,
  zoomable = false,
  zoomStep = 0.2,
  offsetScale = 5,
  onClick,
  ...rest
}) => {
  const [initialized, setInitialized] = useState(false);
  const instance = useTransformContext();

  const mainRef = useRef<HTMLDivElement | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);
  const maskPathRef = useRef<SVGPathElement | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const layoutRef = useRef<MiniMapLayout | null>(null);

  // Latest props for the document listeners, which are registered once.
  const optionsRef = useRef({ panning, inversePan, zoomStep, onClick });
  optionsRef.current = { panning, inversePan, zoomStep, onClick };

  const getViewportSize = useCallback(() => {
    if (instance.wrapperComponent) {
      const rect = instance.wrapperComponent.getBoundingClientRect();
      return { width: rect.width, height: rect.height };
    }
    return { width: 0, height: 0 };
  }, [instance]);

  const getContentSize = useCallback(() => {
    if (instance.contentComponent) {
      const rect = instance.contentComponent.getBoundingClientRect();
      const { scale } = instance.state;
      return { width: rect.width / scale, height: rect.height / scale };
    }
    return { width: 0, height: 0 };
  }, [instance]);

  /**
   * Like React Flow, the map shows the union of the content and the current
   * viewport (plus `offsetScale` padding) fitted into the box, so the
   * viewport indicator never leaves the mini map even when the view is
   * panned or zoomed past the content.
   */
  const computeLayout = useCallback((): MiniMapLayout | null => {
    const content = getContentSize();
    const viewport = getViewportSize();
    const { scale, positionX, positionY } = instance.state;

    if (!content.width || !content.height || !width || !height || !scale) {
      return null;
    }

    const viewX = -positionX / scale;
    const viewY = -positionY / scale;
    const viewWidth = viewport.width / scale;
    const viewHeight = viewport.height / scale;

    const minX = Math.min(0, viewX);
    const minY = Math.min(0, viewY);
    const maxX = Math.max(content.width, viewX + viewWidth);
    const maxY = Math.max(content.height, viewY + viewHeight);
    const boundsWidth = maxX - minX;
    const boundsHeight = maxY - minY;

    const viewScale = Math.max(boundsWidth / width, boundsHeight / height);
    const fitWidth = viewScale * width;
    const fitHeight = viewScale * height;
    const offset = offsetScale * viewScale;

    const originX = minX - (fitWidth - boundsWidth) / 2 - offset;
    const originY = minY - (fitHeight - boundsHeight) / 2 - offset;
    const mapScale = width / (fitWidth + offset * 2);

    return {
      mapScale,
      originX,
      originY,
      contentWidth: content.width,
      contentHeight: content.height,
      previewX: (viewX - originX) * mapScale,
      previewY: (viewY - originY) * mapScale,
      previewWidth: viewWidth * mapScale,
      previewHeight: viewHeight * mapScale,
    };
  }, [getContentSize, getViewportSize, height, instance, offsetScale, width]);

  const transformMiniMap = useCallback(() => {
    const layout = computeLayout();
    layoutRef.current = layout;
    if (!layout) return;

    const px = (value: number) => `${roundNumber(value, 2)}px`;

    if (wrapperRef.current) {
      const { style } = wrapperRef.current;
      style.width = px(layout.contentWidth);
      style.height = px(layout.contentHeight);
      style.transform = `translate(${px(-layout.originX * layout.mapScale)}, ${px(
        -layout.originY * layout.mapScale,
      )}) scale(${roundNumber(layout.mapScale, 4)})`;
    }

    if (previewRef.current) {
      const { style } = previewRef.current;
      style.transform = `translate(${px(layout.previewX)}, ${px(layout.previewY)})`;
      style.width = px(layout.previewWidth);
      style.height = px(layout.previewHeight);
    }

    if (maskPathRef.current) {
      const x = roundNumber(layout.previewX, 2);
      const y = roundNumber(layout.previewY, 2);
      const w = roundNumber(layout.previewWidth, 2);
      const h = roundNumber(layout.previewHeight, 2);
      maskPathRef.current.setAttribute(
        "d",
        `M0 0H${width}V${height}H0Z M${x} ${y}h${w}v${h}h${-w}Z`,
      );
    }
  }, [computeLayout, height, width]);

  useTransformEffect(transformMiniMap);

  useTransformInit(() => {
    transformMiniMap();
    setInitialized(true);
  });

  useResize(instance.contentComponent, transformMiniMap, [initialized]);

  useEffect(() => {
    transformMiniMap();
  }, [transformMiniMap]);

  useEffect(() => {
    const element = mainRef.current;
    if (!element) return;

    const getMapScale = () => {
      const layout = layoutRef.current ?? computeLayout();
      return layout?.mapScale ?? 0;
    };

    const start = (point: PositionType, target: EventTarget | null) => {
      if (!optionsRef.current.panning) return;
      if (!isInside(element, target)) return;
      if (!instance.wrapperComponent || !instance.contentComponent) return;

      handleCancelAnimation(instance);
      dragRef.current = { x: point.x, y: point.y, moved: false };
      element.style.cursor = "grabbing";
    };

    const move = (point: PositionType) => {
      const drag = dragRef.current;
      if (!drag) return;

      const deltaX = point.x - drag.x;
      const deltaY = point.y - drag.y;
      drag.x = point.x;
      drag.y = point.y;
      if (!deltaX && !deltaY) return;
      drag.moved = true;

      const mapScale = getMapScale();
      const { wrapperComponent, contentComponent, setup, state } = instance;
      if (!mapScale || !wrapperComponent || !contentComponent) return;

      // Dragging by one mini map px moves the viewport by 1 / mapScale
      // content units, so the indicator follows the pointer 1:1.
      const direction = optionsRef.current.inversePan ? 1 : -1;
      const moveScale = (direction * state.scale) / mapScale;
      const nextX = state.positionX + deltaX * moveScale;
      const nextY = state.positionY + deltaY * moveScale;

      const bounds = handleCalculateBounds(instance, state.scale);
      const { x, y } = getMouseBoundedPosition(
        nextX,
        nextY,
        bounds,
        setup.limitToBounds,
        0,
        0,
        wrapperComponent,
      );

      if (x === state.positionX && y === state.positionY) return;
      instance.setState(state.scale, x, y);
    };

    const stop = (
      event: MouseEvent | TouchEvent,
      point: PositionType | null,
    ) => {
      const drag = dragRef.current;
      if (!drag) return;
      dragRef.current = null;
      element.style.cursor = optionsRef.current.panning ? "grab" : "";

      const { onClick: handleClick } = optionsRef.current;
      if (drag.moved || !handleClick || !point) return;

      const layout = layoutRef.current ?? computeLayout();
      if (!layout) return;
      const rect = element.getBoundingClientRect();
      handleClick(event, {
        x: layout.originX + (point.x - rect.left) / layout.mapScale,
        y: layout.originY + (point.y - rect.top) / layout.mapScale,
      });
    };

    const onMouseDown = (event: MouseEvent) => {
      if (event.button !== 0) return;
      start({ x: event.clientX, y: event.clientY }, event.target);
    };
    const onMouseMove = (event: MouseEvent) => {
      if (!dragRef.current) return;
      // The mouse was released outside the window: end the drag.
      if (event.buttons === 0) {
        stop(event, null);
        return;
      }
      move({ x: event.clientX, y: event.clientY });
    };
    const onMouseUp = (event: MouseEvent) => {
      stop(event, { x: event.clientX, y: event.clientY });
    };

    const onTouchStart = (event: TouchEvent) => {
      if (event.touches.length !== 1) return;
      const point = getTouchPoint(event);
      if (point) start(point, event.target);
    };
    const onTouchMove = (event: TouchEvent) => {
      if (!dragRef.current) return;
      if (event.touches.length !== 1) {
        stop(event, null);
        return;
      }
      const point = getTouchPoint(event);
      if (point) move(point);
    };
    const onTouchEnd = (event: TouchEvent) => {
      stop(event, getTouchPoint(event));
    };

    // Listen on the mini map's own document so it keeps working inside
    // portal windows and iframes.
    const doc = element.ownerDocument;
    doc.addEventListener("mousedown", onMouseDown);
    doc.addEventListener("mousemove", onMouseMove);
    doc.addEventListener("mouseup", onMouseUp);
    doc.addEventListener("touchstart", onTouchStart);
    doc.addEventListener("touchmove", onTouchMove);
    doc.addEventListener("touchend", onTouchEnd);
    doc.addEventListener("touchcancel", onTouchEnd);
    return () => {
      doc.removeEventListener("mousedown", onMouseDown);
      doc.removeEventListener("mousemove", onMouseMove);
      doc.removeEventListener("mouseup", onMouseUp);
      doc.removeEventListener("touchstart", onTouchStart);
      doc.removeEventListener("touchmove", onTouchMove);
      doc.removeEventListener("touchend", onTouchEnd);
      doc.removeEventListener("touchcancel", onTouchEnd);
      dragRef.current = null;
    };
  }, [computeLayout, instance]);

  useEffect(() => {
    const element = mainRef.current;
    if (!element || !zoomable) return;

    const onWheel = (event: WheelEvent) => {
      const { wrapperComponent, contentComponent, setup, state } = instance;
      if (setup.disabled || !wrapperComponent || !contentComponent) return;
      if (!event.deltaY) return;

      if (event.cancelable) event.preventDefault();
      event.stopPropagation();

      const delta = event.deltaY < 0 ? 1 : -1;
      const newScale = handleCalculateButtonZoom(
        instance,
        delta,
        optionsRef.current.zoomStep,
      );
      if (newScale === state.scale) return;

      // Zoom around the centre of the current viewport.
      const centerX =
        (wrapperComponent.offsetWidth / 2 - state.positionX) / state.scale;
      const centerY =
        (wrapperComponent.offsetHeight / 2 - state.positionY) / state.scale;

      handleCancelAnimation(instance);
      const target = handleZoomToPoint(instance, newScale, centerX, centerY);
      if (!target) return;
      instance.setState(target.scale, target.positionX, target.positionY);
    };

    element.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      element.removeEventListener("wheel", onWheel);
    };
  }, [instance, zoomable]);

  const containerStyle: React.CSSProperties = {
    position: "relative",
    zIndex: 2,
    width: `${width}px`,
    height: `${height}px`,
    overflow: "hidden",
    userSelect: "none",
    WebkitUserSelect: "none",
    touchAction: "none",
    cursor: panning ? "grab" : undefined,
    ...rest.style,
  };

  return (
    <div
      {...rest}
      ref={mainRef}
      style={containerStyle}
      className={`rzpp-mini-map ${rest.className || ""}`.trim()}
    >
      <div
        style={wrapperStyles}
        ref={wrapperRef}
        className={`rzpp-minimap-wrapper ${wrapperClassName || ""}`.trim()}
      >
        {children}
      </div>
      <svg
        className="rzpp-minimap-mask"
        style={maskStyles}
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        aria-hidden="true"
      >
        <path
          ref={maskPathRef}
          fill={maskColor}
          fillRule="evenodd"
          d={`M0 0H${width}V${height}H0Z`}
        />
      </svg>
      <div
        className={`rzpp-minimap-preview ${previewClassName || ""}`.trim()}
        ref={previewRef}
        style={{ ...previewStyles, borderColor, ...previewStyle }}
      />
    </div>
  );
};
