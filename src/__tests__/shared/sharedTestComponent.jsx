import React from "react";
import { TransformWrapper, TransformComponent } from "../..";
import logoImg from "../../../logo/logo.png";

class SharedTestComponent extends React.PureComponent {
  render() {
    return (
      <TransformWrapper {...this.props}>
        <TransformComponent>
          <img className="zoom" src={logoImg} alt="example" />
        </TransformComponent>
      </TransformWrapper>
    );
  }
}

export default SharedTestComponent;
