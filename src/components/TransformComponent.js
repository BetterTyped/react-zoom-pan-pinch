import React, { useContext, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Context } from "../store/StateContext";
import styles from "./TransformComponent.module.css";

function TransformComponent({ children }) {
  const wrapperRef = useRef(null);
  const contentRef = useRef(null);
  const { state, dispatch, nodes } = useContext(Context);
  const style = {
    transform: `translate(${state.positionX}px, ${state.positionY}px) scale(${state.scale})`,
  };

  useEffect(() => {
    if (wrapperRef.current) {
      nodes.setWrapperComponent(wrapperRef.current);
    }
    if (contentRef.current) {
      nodes.setContentComponent(contentRef.current);
    }
  }, [wrapperRef, contentRef]);

  return (
    <div
      ref={wrapperRef}
      onWheel={event => dispatch.handleZoom(event, wrapperRef.current, contentRef.current)}
      className={styles.container}
    >
      <div ref={contentRef} className={styles.content} style={style}>
        {children}
      </div>
    </div>
  );
}

TransformComponent.propTypes = { children: PropTypes.any };

export default TransformComponent;
