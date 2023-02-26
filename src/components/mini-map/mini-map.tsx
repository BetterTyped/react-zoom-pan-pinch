/* eslint-disable react/require-default-props */
import React, { useMemo, useRef, useState } from "react";

import {
  useTransformContext,
  useTransformEffect,
  useTransformInit,
} from "hooks";

export type MiniMapProps = {
  width?: number;
  height?: number;
  children: React.ReactNode;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
>;

const previewStyles = {
  position: "absolute",
  zIndex: 2,
  top: "0px",
  left: "0px",
  boxSizing: "border-box",
  border: "3px solid red",
  transformOrigin: "0% 0%",
  boxShadow: "rgba(0,0,0,0.2) 0 0 0 10000000px",
} as const;

export const MiniMap: React.FC<MiniMapProps> = ({
  width = 200,
  height = 200,
  children,
  ...rest
}) => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const instance = useTransformContext();

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);

  const getContentSize = () => {
    if (instance.contentComponent) {
      return {
        width: instance.contentComponent.offsetWidth,
        height: instance.contentComponent.offsetHeight,
      };
    }
    return {
      width: 0,
      height: 0,
    };
  };

  const computeMiniMapScale = () => {
    const contentSize = getContentSize();
    const scaleX = width / contentSize.width;
    const scaleY = height / contentSize.height;
    const scale = scaleY > scaleX ? scaleX : scaleY;

    return scale;
  };

  const computeMiniMapSize = () => {
    const contentSize = getContentSize();
    const scaleX = width / contentSize.width;
    const scaleY = height / contentSize.height;
    if (scaleY > scaleX) {
      return { width, height: contentSize.height * scaleX };
    }
    return { width: contentSize.width * scaleY, height };
  };

  const computeWrapperStyle = () => {
    return {
      width: instance.contentComponent?.offsetWidth || 0,
      height: instance.contentComponent?.offsetHeight || 0,
    };
  };

  const computeMiniMapStyle = () => {
    const scale = computeMiniMapScale();
    return {
      transform: `scale(${scale || 1})`,
      transformOrigin: "0% 0%",
      position: "absolute",
      boxSizing: "border-box",
      zIndex: 1,
      overflow: "hidden",
    } as const;
  };

  const transformMiniMap = () => {
    const style = computeWrapperStyle();
    if (wrapperRef.current) {
      wrapperRef.current.style.width = `${style.width}px`;
      wrapperRef.current.style.width = `${style.width}px`;
      wrapperRef.current.style.height = `${style.height}px`;
    }
    if (previewRef.current) {
      const scale = computeMiniMapScale();
      const previewScale = scale * (1 / instance.transformState.scale);
      const transform = instance.handleTransformStyles(
        -instance.transformState.positionX * previewScale,
        -instance.transformState.positionY * previewScale,
        1,
      );
      previewRef.current.style.transform = transform;
      previewRef.current.style.width = `${style.width * previewScale}px`;
      previewRef.current.style.height = `${style.height * previewScale}px`;
    }
  };

  const initialize = () => {
    const style = computeMiniMapStyle();
    const initSize = computeMiniMapSize();
    setSize(initSize);
    Object.keys(style).forEach((key) => {
      if (wrapperRef.current) {
        wrapperRef.current.style[key] = style[key];
      }
    });
    transformMiniMap();
  };

  useTransformEffect(() => {
    transformMiniMap();
  });

  useTransformInit(() => {
    initialize();
  });

  const wrapperStyle = useMemo(() => {
    return {
      ...size,
      position: "relative",
      zIndex: 2,
      overflow: "hidden",
    } as const;
  }, [size]);

  return (
    <div
      {...rest}
      style={wrapperStyle}
      className={`rzpp-mini-map ${rest.className || ""}`}
    >
      <div {...rest} ref={wrapperRef} className="rzpp-wrapper">
        {children}
      </div>
      <div className="rzpp-preview" ref={previewRef} style={previewStyles} />
    </div>
  );
};
