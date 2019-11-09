/* eslint-disable react/prop-types */
import React from "react";
import { TransformWrapper, TransformComponent } from "../..";
import logoImg from "../../../logo/logo.png";

class SharedTestComponent extends React.PureComponent {
  render() {
    const { getComponentState } = this.props;
    return (
      <TransformWrapper {...this.props}>
        {componentState => {
          getComponentState(componentState);
          return (
            <TransformComponent>
              <img className="zoom" src={logoImg} alt="example" />
            </TransformComponent>
          );
        }}
      </TransformWrapper>
    );
  }
}

export default SharedTestComponent;
