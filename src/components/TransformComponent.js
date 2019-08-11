import React, { useContext, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Context } from "../store/StateContext";
import styles from "./TransformComponent.module.css";

function TransformComponent({ children }) {
  const wrapperRef = useRef(null);
  const contentRef = useRef(null);
  const { state, nodes, internal } = useContext(Context);
  const style = {
    transform: `translate(${state.positionX}px, ${state.positionY}px) scale(${state.scale})`,
    transition: `all ${getAnimationTime(internal.eventType)}ms ease-in-out`,
  };

  function getAnimationTime(type) {
    if (type !== false && !isNaN(type)) return type;
    switch (type) {
      case "pan":
        return state.panAnimationSpeed;
      case "wheel":
        return state.wheelAnimationSpeed;
      case "pinch":
        return state.pinchAnimationSpeed;
      case "reset":
        return state.resetAnimationSpeed;
      default:
        return state.zoomAnimationSpeed;
    }
  }

  useEffect(() => {
    if (wrapperRef.current) {
      nodes.setWrapperComponent(wrapperRef.current);
    }
    if (contentRef.current) {
      nodes.setContentComponent(contentRef.current);
    }
  }, []);

  return (
    <div ref={wrapperRef} className={`"react-transform-component" ${styles.container}`}>
      <div ref={contentRef} className={`react-transform-element ${styles.content}`} style={style}>
        {children}
      </div>
    </div>
  );
}

TransformComponent.propTypes = { children: PropTypes.any };

export default TransformComponent;
