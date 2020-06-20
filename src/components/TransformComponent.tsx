import React, { useRef, useEffect, useContext, ReactNode, CSSProperties } from "react";
import { Context } from "../store/StateContext";
import styles from "./TransformComponent.module.css";

interface Props {
  children?: ReactNode;
  style?: CSSProperties
}

const TransformComponent = ({ children, style }: Props) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const context = useContext(Context)
  useEffect(() => {
    const { nodes: { setWrapperComponent, setContentComponent } }: any = context;
    setWrapperComponent(wrapperRef.current);
    setContentComponent(contentRef.current);
  }, [])

  const {
    state: {
      positionX,
      positionY,
      scale,
      options: { wrapperClass, contentClass },
    },
  }: any = context;

  const dynamicStyles = {
    WebkitTransform: `translate(${positionX}px, ${positionY}px) scale(${scale})`,
    transform: `translate(${positionX}px, ${positionY}px) scale(${scale})`,
    ...style
  };
  return (
    <div
      ref={wrapperRef}
      className={`react-transform-component ${styles.container} ${wrapperClass}`}
    >
      <div
        ref={contentRef}
        className={`react-transform-element ${styles.content} ${contentClass}`}
        style={dynamicStyles}
      >
        {children}
      </div>
    </div>
  );
}

export { TransformComponent };
