/* eslint-disable react/require-default-props */
import React, { useContext, useEffect, useRef } from "react";

import { Context } from "./transform-wrapper";

import styles from "./transform-component.module.css";

type Props = {
  children: React.ReactNode;
  wrapperClass?: string;
  contentClass?: string;
  wrapperStyle?: React.CSSProperties;
  contentStyle?: React.CSSProperties;
  wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
  contentProps?: React.HTMLAttributes<HTMLDivElement>;
};

export const TransformComponent: React.FC<Props> = ({
  children,
  wrapperClass = "",
  contentClass = "",
  wrapperStyle,
  contentStyle,
  wrapperProps = {},
  contentProps = {},
}: Props) => {
  const { init } = useContext(Context);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (wrapper !== null && content !== null && init) {
      init(wrapper, content);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      {...wrapperProps}
      ref={wrapperRef}
      className={`react-transform-wrapper ${styles.wrapper} ${wrapperClass}`}
      style={wrapperStyle}
    >
      <div
        {...contentProps}
        ref={contentRef}
        className={`react-transform-component ${styles.content} ${contentClass}`}
        style={contentStyle}
      >
        {children}
      </div>
    </div>
  );
};

export default TransformComponent;
