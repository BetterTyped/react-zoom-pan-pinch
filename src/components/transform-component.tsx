import React, { useContext, useEffect, useRef } from "react";

import { Context } from "./transform-context";

import styles from "./transform-component.module.css";

type Props = {
  children: React.ReactNode;
};

export const TransformComponent: React.FC<Props> = ({ children }: Props) => {
  const { wrapperClass, contentClass, setComponents } = useContext(Context);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const content = contentRef.current;
    if (wrapper !== null && content !== null && setComponents) {
      setComponents(wrapper, content);
    }
  }, []);

  return (
    <div
      ref={wrapperRef}
      className={`react-transform-wrapper ${styles.wrapper} ${wrapperClass}`}
    >
      <div
        ref={contentRef}
        className={`react-transform-content ${styles.content} ${contentClass}`}
      >
        {children}
      </div>
    </div>
  );
};

export default TransformComponent;
