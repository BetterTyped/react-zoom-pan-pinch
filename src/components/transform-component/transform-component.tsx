/* eslint-disable react/require-default-props */
import React, { useContext, useEffect, useRef } from "react";

import { Context } from "../transform-wrapper/transform-wrapper";
import { baseClasses } from "../../constants/state.constants";
import { getTransformStyles } from "../../utils/styles.utils";

import styles from "./transform-component.module.css";

type Props = {
  children: React.ReactNode;
  wrapperClass?: string;
  contentClass?: string;
  wrapperStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
  contentProps?: React.HTMLAttributes<HTMLDivElement>;
  /**
   * When true, renders an infinite dot-grid background behind the content
   * that scales and pans in sync with the transform. Pair with
   * `limitToBounds={false}` on TransformWrapper for full effect.
   */
  infinite?: boolean;
};

export const TransformComponent: React.FC<Props> = ({
  children,
  wrapperClass = "",
  contentClass = "",
  wrapperStyle,
  contentStyle,
  wrapperProps = {},
  contentProps = {},
  infinite = false,
}: Props) => {
  const instance = useContext(Context);
  const { init, cleanupWindowEvents } = instance;

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (wrapper !== null && content !== null && init) {
      init?.(wrapper, content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    return () => {
      cleanupWindowEvents?.();
    };
  }, []);

  useEffect(() => {
    if (!infinite) return;
    const grid = gridRef.current;
    if (!grid) return;

    const sync = () => {
      const { positionX, positionY } = instance.state;
      grid.style.backgroundPosition = `${positionX}px ${positionY}px`;
    };

    sync();
    return instance.onChange(sync);
  }, [infinite, instance]);

  return (
    <div
      {...wrapperProps}
      ref={wrapperRef}
      className={`${baseClasses.wrapperClass} ${styles.wrapper} ${wrapperClass}`}
      style={wrapperStyle}
    >
      {infinite && (
        <div ref={gridRef} className={styles.infiniteGrid} aria-hidden />
      )}
      <div
        {...contentProps}
        ref={contentRef}
        className={`${baseClasses.contentClass} ${styles.content} ${contentClass}`}
        style={{
          ...contentStyle,
          transform: getTransformStyles(
            instance.state.positionX,
            instance.state.positionY,
            instance.state.scale,
          ),
        }}
      >
        {children}
      </div>
    </div>
  );
};
