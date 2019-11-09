import React from "react";
import { Context } from "../store/StateContext";
// import styles from "./TransformComponent.module.css";

class TransformComponent extends React.Component {
  private wrapperRef = React.createRef<HTMLDivElement>();
  private contentRef = React.createRef<HTMLDivElement>();

  componentDidMount() {
    const { nodes } = this.context;
    nodes.setWrapperComponent(this.wrapperRef.current);
    nodes.setContentComponent(this.contentRef.current);
  }

  render() {
    const { children } = this.props;
    const {
      state: { positionX, positionY, scale },
    } = this.context;

    const style = {
      transform: `translate(${positionX}px, ${positionY}px) scale(${scale})`,
    };
    return (
      <div ref={this.wrapperRef} className={`react-transform-component `}>
        <div
          ref={this.contentRef}
          className={`react-transform-element `}
          style={style}
        >
          {children}
        </div>
      </div>
    );
  }
}

TransformComponent.contextType = Context;

export { TransformComponent };
