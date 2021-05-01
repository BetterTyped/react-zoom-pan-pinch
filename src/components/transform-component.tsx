import React, { useContext, useEffect, useRef } from "react";

import { Context } from "./transform-context";

import styles from "./TransformComponent.module.css";

type Props = {
  children: React.ReactNode;
};

const TransformComponent: React.FC<Props> = ({ children }: Props) => {
  const { wrapperClass, contentClass, setComponents } = useContext(Context);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

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
      >
        {children}
      </div>
    </div>
  );
};

export default TransformComponent;
