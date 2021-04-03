import React, { useContext, useEffect, useRef } from "react";

import { Context } from "./transform-context";

import styles from "./TransformComponent.module.css";

type Props = {
  children: React.ReactNode;
};

const TransformComponent: React.FC<Props> = ({ children }: Props) => {
  const {
    positionX,
    positionY,
    scale,
    wrapperClass,
    contentClass,
    setComponents,
  } = useContext(Context);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  const style = {
    WebkitTransform: `translate(${positionX}px, ${positionY}px) scale(${scale})`,
    transform: `translate3d(${positionX}px, ${positionY}px, 0) scale(${scale})`,
  };

  useEffect(() => {
    const hasComponents = Boolean(wrapperRef.current && contentRef.current);
    if (hasComponents && setComponents) {
      setComponents(wrapperRef.current, contentRef.current);
    }
  }, [setComponents]);

  return (
    <div
      ref={wrapperRef}
      className={`react-transform-component ${styles.container} ${wrapperClass}`}
    >
      <div
        ref={contentRef}
        className={`react-transform-element ${styles.content} ${contentClass}`}
        style={style}
      >
        {children}
      </div>
    </div>
  );
};

export default TransformComponent;
